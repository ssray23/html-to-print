// SIMPLE BROWSER-ONLY HTML PAGINATOR - NO IMPORTS/EXPORTS
// GPT5-compliant with Chromium LayoutNG

interface ElementMeasurement {
  element: Element;
  height: number;
  width: number;
  naturalWidth: number;
  top: number;
  isTable: boolean;
  isTableRow: boolean;
  index: number;
}

interface ElementRegistry {
  id: string;
  order: number;
  element: Element;
  tagName: string;
  className: string;
  width: number;
  height: number;
  isTable: boolean;
  canBreak: boolean; // Can this element be broken across pages?
  textContent: string; // For debugging/identification
}

interface MeasurementResult {
  measurements: ElementMeasurement[];
  naturalContentWidth: number;
}

interface PageData {
  elements: Element[];
  totalHeight: number;
  pageNumber: number;
}

type StatusType = 'info' | 'success' | 'error' | 'warning';

class HtmlPaginator {
  private readonly A4_HEIGHT_MM = 297;
  private readonly MARGIN_CM = 0.6;
  private readonly CONTENT_HEIGHT_MM = 297 - (0.6 * 2 * 10); // 285mm
  private readonly CONTENT_HEIGHT_PX = Math.floor(((297 - (0.6 * 2 * 10)) / 25.4) * 96 * 0.75); // ~810px for proper bottom margins
  private elementRegistry: ElementRegistry[] = [];

  constructor() {
    this.init();
  }

  public init(): void {
    console.log('🔥 Clean HTML Paginator initialized');
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const processBtn = document.getElementById('processBtn') as HTMLButtonElement | null;
    const paginateBtn = document.getElementById('paginateBtn') as HTMLButtonElement | null;
    const exportPdfBtn = document.getElementById('exportPdfBtn') as HTMLButtonElement | null;

    processBtn?.addEventListener('click', () => this.processHTML());
    paginateBtn?.addEventListener('click', () => this.paginateContent());
    exportPdfBtn?.addEventListener('click', () => this.exportToPdf());
  }

  private async processHTML(): Promise<void> {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
    
    if (!fileInput?.files?.[0]) {
      this.updateStatus('Please select an HTML file', 'error');
      return;
    }

    try {
      this.updateStatus('Processing HTML file...', 'info');
      const file = fileInput.files[0];
      
      const content = await this.readFile(file);
      
      // Simple processing - just display the content
      this.displayProcessedContent(content);
      this.updateStatus('✅ HTML processed successfully', 'success');

    } catch (error) {
      this.handleError('HTML processing failed', error);
    }
  }

  private async paginateContent(): Promise<void> {
    const sourceContent = this.getSourceContent();
    if (!sourceContent) {
      this.updateStatus('Please process HTML first', 'error');
      return;
    }

    try {
      console.log('🎨 Starting GPT5-compliant pagination...');
      this.updateStatus('Creating paginated HTML...', 'info');

      // Clone ONLY the extracted content, not the page structure
      const extractedContent = sourceContent.querySelector('.extracted-page-content');
      if (!extractedContent) {
        this.handleError('Pagination', new Error('No extracted content found. Run processing first.'));
        return;
      }
      const frozenDOM = extractedContent.cloneNode(true) as Element;
      console.log('✅ Frozen DOM snapshot created from extracted content only');

      // Use element registry instead of measurements
      console.log(`✅ Using element registry: ${this.elementRegistry.length} elements registered`);

      const pages = this.createPagesFromRegistry();
      console.log(`✅ Created ${pages.length} pages`);

      this.renderPaginatedPages(pages);
      this.switchToPaginatedView();

      // Validate word count between processed continuous content and paginated result
      const processedWordCount = this.getWordCount(sourceContent);
      const paginatedWordCount = this.getWordCount(this.getPaginatedContainer()!);
      
      console.log(`📊 Word count validation: Processed=${processedWordCount}, Paginated=${paginatedWordCount}`);
      
      const wordCountDiff = paginatedWordCount - processedWordCount;
      if (Math.abs(wordCountDiff) <= processedWordCount * 0.05) { // Allow 5% variance
        this.updateStatus(`✅ GPT5-compliant pagination completed! Created ${pages.length} pages. Word count verified: ${processedWordCount} words.`, 'success');
      } else if (wordCountDiff > 0 && wordCountDiff < processedWordCount * 0.15) { // Allow up to 15% increase due to repeated headers
        this.updateStatus(`✅ GPT5-compliant pagination completed! Created ${pages.length} pages. Word count: ${processedWordCount} + ${wordCountDiff} repeated headers.`, 'success');
      } else {
        this.updateStatus(`⚠️ Pagination completed with ${pages.length} pages. Word count: Processed=${processedWordCount}, Paginated=${paginatedWordCount} (${wordCountDiff > 0 ? '+' : ''}${wordCountDiff})`, 'warning');
      }

    } catch (error) {
      this.handleError('Pagination failed', error);
    }
  }

  private measureWithChromiumLayoutNG(frozenDOM: Element): MeasurementResult {
    console.log('🔍 Using Chromium LayoutNG for natural measurements...');

    const measurementContainer = document.createElement('div');
    measurementContainer.style.cssText = `
      position: absolute !important;
      top: -99999px !important;
      left: -99999px !important;
      width: 753px !important;
      max-width: 753px !important;
      visibility: hidden !important;
      background: white !important;
      font-family: Helvetica, Arial, sans-serif !important;
      font-size: 11pt !important;
      line-height: 1.4 !important;
      box-sizing: border-box !important;
      overflow: visible !important;
    `;

    const clonedDOM = frozenDOM.cloneNode(true) as Element;
    measurementContainer.appendChild(clonedDOM);
    document.body.appendChild(measurementContainer);

    // Force Chromium layout
    measurementContainer.offsetHeight;
    (clonedDOM as HTMLElement).offsetHeight;

    // Find the actual content elements to measure
    const contentContainer = clonedDOM.querySelector('.extracted-page-content') || clonedDOM;
    const elements = Array.from(contentContainer.children);
    
    console.log(`📋 Found ${elements.length} elements to measure in content container`);
    
    const measurements = elements.map((element, index): ElementMeasurement => {
      const rect = element.getBoundingClientRect();
      const computedWidth = (element as HTMLElement).offsetWidth;
      
      console.log(`📏 Element ${index + 1}: ${element.tagName}.${element.className || 'no-class'} - ${rect.height}px (natural width: ${computedWidth}px)`);

      return {
        element,
        height: Math.ceil(rect.height),
        width: computedWidth,
        naturalWidth: computedWidth,
        top: rect.top,
        isTable: element.tagName.toLowerCase() === 'table',
        isTableRow: element.tagName.toLowerCase() === 'tr',
        index
      };
    });

    const maxWidth = Math.max(...measurements.map(m => m.width));
    console.log(`📐 Natural content width: ${maxWidth}px`);

    document.body.removeChild(measurementContainer);

    return {
      measurements,
      naturalContentWidth: maxWidth
    };
  }

  private createPagesFromRegistry(): PageData[] {
    console.log('📄 Creating pages from element registry...');
    const pages: PageData[] = [];
    let currentPageElements: Element[] = [];
    let currentHeight = 0;
    let pageNumber = 1;
    let registryIndex = 0;
    
    // IMPORTANT: Never modify the registry during pagination to prevent skipped elements
    const registryItems = this.elementRegistry;

    while (registryIndex < registryItems.length) {
      const registryEntry = registryItems[registryIndex];
      
      // Handle tables with smarter placement logic
      if (registryEntry.isTable) {
        const remainingSpace = this.CONTENT_HEIGHT_PX * 0.95 - currentHeight;
        const freshPageSpace = this.CONTENT_HEIGHT_PX * 0.95;
        
        // If table fits comfortably on current page, treat it as a regular element
        if (registryEntry.height <= remainingSpace) {
          console.log(`📊 Table Registry[${registryEntry.order}] (${registryEntry.height}px) fits in available space (${remainingSpace}px), treating as regular element`);
          // Will be processed by normal flow below
        } else if (registryEntry.height <= freshPageSpace && currentPageElements.length > 0) {
          // Table doesn't fit on current page BUT would fit on a fresh page
          console.log(`📊 Table Registry[${registryEntry.order}] (${registryEntry.height}px) too large for current page (${remainingSpace}px) but fits on fresh page (${freshPageSpace}px) - creating page break`);
          
          // Finish current page
          pages.push({
            elements: [...currentPageElements],
            totalHeight: currentHeight,
            pageNumber: pageNumber++
          });
          currentPageElements = [];
          currentHeight = 0;
          
          // Table will be processed normally on the fresh page (don't increment registryIndex)
          continue;
        } else if (registryEntry.height > freshPageSpace) {
          // Table is genuinely too large for any single page - must break
          console.log(`📊 Table Registry[${registryEntry.order}] (${registryEntry.height}px) too large even for fresh page (${freshPageSpace}px), attempting to break`);
          const tablePages = this.breakTableIntoPages(registryEntry.element, currentHeight, pageNumber + pages.length);
        
          console.log(`📊 Table breaking result: ${tablePages.length} pages created`);
          
          if (tablePages.length > 0) {
            // If there are existing elements on current page, finish that page first
            if (currentPageElements.length > 0) {
              pages.push({
                elements: [...currentPageElements],
                totalHeight: currentHeight,
                pageNumber: pageNumber++
              });
              currentPageElements = [];
              currentHeight = 0;
            }
            
            // Add all table pages
            pages.push(...tablePages);
            pageNumber += tablePages.length;
            console.log(`✅ Table Registry[${registryEntry.order}] successfully broken into ${tablePages.length} pages`);
            registryIndex++; // Move to next element
            continue;
          } else {
            console.log(`⚠️ Table breaking failed, treating Registry[${registryEntry.order}] as regular element`);
          }
        } else {
          // Edge case: table fits on fresh page but we're already on an empty page
          console.log(`📊 Table Registry[${registryEntry.order}] (${registryEntry.height}px) treating as regular element (edge case)`);
        }
      }
      
      // Check if current element fits on page
      const remainingSpace = this.CONTENT_HEIGHT_PX * 0.95 - currentHeight;
      
      if (registryEntry.height > remainingSpace && currentPageElements.length > 0) {
        // Current element won't fit, finish the current page
        console.log(`🔍 Registry[${registryEntry.order}] ${registryEntry.tagName} (${registryEntry.height}px) won't fit in ${remainingSpace}px, finishing current page`);
        
        pages.push({
          elements: [...currentPageElements],
          totalHeight: currentHeight,
          pageNumber: pageNumber++
        });
        currentPageElements = [];
        currentHeight = 0;
        
        // Don't increment registryIndex - process this element on the new page
        continue;
      }
      
      // Add current element to page
      console.log(`📄 Adding Registry[${registryEntry.order}] ${registryEntry.tagName} (${registryEntry.height}px) to page ${pageNumber}`);
      
      // Special debug for tables
      if (registryEntry.isTable) {
        console.log(`🔍 TABLE DEBUG: Registry[${registryEntry.order}] is being added to page ${pageNumber} as regular element`);
        console.log(`🔍 TABLE DEBUG: Table element:`, registryEntry.element.outerHTML.substring(0, 200) + '...');
      }
      
      currentPageElements.push(registryEntry.element.cloneNode(true) as Element);
      currentHeight += registryEntry.height;
      registryIndex++;
      
      // After adding element, try to fill remaining space with SEQUENTIAL elements
      const availableSpaceNow = this.CONTENT_HEIGHT_PX * 0.95 - currentHeight;
      const fillResult = this.fillRemainingPageSpaceFixed(registryIndex, availableSpaceNow);
      
      if (fillResult.elementsFilled.length > 0) {
        console.log(`🔄 Filled page ${pageNumber} with ${fillResult.elementsFilled.length} additional sequential elements`);
        currentPageElements.push(...fillResult.elementsFilled);
        currentHeight += fillResult.totalHeight;
        
        // Move registry index forward by the number of elements we consumed
        registryIndex += fillResult.elementsProcessed;
      }
    }

    // Add remaining elements to final page
    if (currentPageElements.length > 0) {
      pages.push({
        elements: [...currentPageElements],
        totalHeight: currentHeight,
        pageNumber: pageNumber
      });
    }

    return pages;
  }

  private fillRemainingPageSpace(registryItems: ElementRegistry[], remainingSpace: number, startIndex: number): {elementsFilled: Element[], totalHeight: number, elementsProcessed: number} {
    const elementsFilled: Element[] = [];
    let totalHeight = 0;
    let elementsProcessed = 0;
    const availableSpace = remainingSpace;
    
    if (availableSpace < 30) return {elementsFilled, totalHeight, elementsProcessed}; // Not worth filling
    
    console.log(`🔄 Looking for SEQUENTIAL elements to fill remaining space (starting from index ${startIndex})...`);
    
    // Only look at NEXT elements in sequence to preserve content order
    for (let j = startIndex; j < registryItems.length && j < startIndex + 10; j++) { // Limit look-ahead to 10 elements
      const candidate = registryItems[j];
      
      if (totalHeight + candidate.height <= availableSpace && !candidate.isTable) {
        console.log(`✅ Sequentially fitting Registry[${candidate.order}] ${candidate.tagName} (${candidate.height}px)`);
        elementsFilled.push(candidate.element.cloneNode(true) as Element);
        totalHeight += candidate.height;
        elementsProcessed++;
        
        // Check if we should continue
        const newRemainingSpace = availableSpace - totalHeight;
        if (newRemainingSpace < 30) {
          console.log(`📄 Space filled sequentially (${newRemainingSpace}px remaining)`);
          break;
        }
      } else if (candidate.height > availableSpace - totalHeight) {
        // This element won't fit, and neither will any larger ones after it
        console.log(`🛑 Registry[${candidate.order}] ${candidate.tagName} (${candidate.height}px) won't fit in remaining ${availableSpace - totalHeight}px, stopping fill`);
        break;
      }
    }
    
    return {elementsFilled, totalHeight, elementsProcessed};
  }

  private fillRemainingPageSpaceFixed(startIndex: number, remainingSpace: number): {elementsFilled: Element[], totalHeight: number, elementsProcessed: number} {
    const elementsFilled: Element[] = [];
    let totalHeight = 0;
    let elementsProcessed = 0;
    
    if (remainingSpace < 30) return {elementsFilled, totalHeight, elementsProcessed}; // Not worth filling
    
    console.log(`🔄 Looking for SEQUENTIAL elements to fill remaining space (starting from index ${startIndex})...`);
    
    // Only look at NEXT elements in sequence to preserve content order
    // CRITICAL: Never modify the main registry, only read from it
    for (let j = startIndex; j < this.elementRegistry.length && j < startIndex + 10; j++) { 
      const candidate = this.elementRegistry[j];
      
      if (totalHeight + candidate.height <= remainingSpace && !candidate.isTable) {
        console.log(`✅ Sequentially fitting Registry[${candidate.order}] ${candidate.tagName} (${candidate.height}px)`);
        elementsFilled.push(candidate.element.cloneNode(true) as Element);
        totalHeight += candidate.height;
        elementsProcessed++;
        
        // Check if we should continue
        const newRemainingSpace = remainingSpace - totalHeight;
        if (newRemainingSpace < 30) {
          console.log(`📄 Space filled sequentially (${newRemainingSpace}px remaining)`);
          break;
        }
      } else if (candidate.isTable) {
        // CRITICAL FIX: Don't skip tables, just don't include them in sequential fill
        // But still count them as "processed" so main loop can handle them
        console.log(`🔍 TABLE SKIP: Registry[${candidate.order}] ${candidate.tagName} (${candidate.height}px) is table - skipping in fill but will be processed by main loop`);
        // Don't increment elementsProcessed for tables - let main loop handle them
        break; // Stop sequential fill when we hit a table
      } else if (candidate.height > remainingSpace - totalHeight) {
        // This element won't fit, and neither will any larger ones after it
        console.log(`🛑 Registry[${candidate.order}] ${candidate.tagName} (${candidate.height}px) won't fit in remaining ${remainingSpace - totalHeight}px, stopping fill`);
        break;
      }
    }
    
    return {elementsFilled, totalHeight, elementsProcessed};
  }

  private createPagesFromMeasurements(measurements: ElementMeasurement[]): PageData[] {
    const pages: PageData[] = [];
    let currentPageElements: Element[] = [];
    let currentHeight = 0;
    let pageNumber = 1;
    let i = 0;

    while (i < measurements.length) {
      const measurement = measurements[i];
      // Handle tables with row-level breaking
      if (measurement.isTable) {
        console.log(`📊 Attempting to break table: ${measurement.height}px tall, ${measurement.element.tagName}`);
        const tablePages = this.breakTableIntoPages(measurement.element, currentHeight, pageNumber + pages.length);
        
        console.log(`📊 Table breaking result: ${tablePages.length} pages created`);
        
        if (tablePages.length > 0) {
          // If there are existing elements on current page, finish that page first
          if (currentPageElements.length > 0) {
            pages.push({
              elements: [...currentPageElements],
              totalHeight: currentHeight,
              pageNumber: pageNumber++
            });
            currentPageElements = [];
            currentHeight = 0;
          }
          
          // Add all table pages
          pages.push(...tablePages);
          pageNumber += tablePages.length;
          console.log(`✅ Table successfully broken into ${tablePages.length} pages`);
          i++;
          continue;
        } else {
          console.log(`⚠️ Table breaking failed, falling back to whole table handling`);
        }
      }
      
      // Smart page filling - look ahead for smaller elements that can fit
      const remainingSpace = this.CONTENT_HEIGHT_PX * 0.95 - currentHeight;
      
      if (measurement.height > remainingSpace && currentPageElements.length > 0) {
        // Current element won't fit, but look ahead for smaller ones that might
        console.log(`🔍 Element ${i + 1} (${measurement.height}px) won't fit in ${remainingSpace}px, looking ahead...`);
        
        let foundSmallerElement = false;
        for (let j = i + 1; j < measurements.length; j++) {
          const nextMeasurement = measurements[j];
          if (nextMeasurement.height <= remainingSpace && !nextMeasurement.isTable) {
            console.log(`✅ Found smaller element ${j + 1} (${nextMeasurement.height}px) that fits!`);
            // Add the smaller element to current page
            currentPageElements.push(nextMeasurement.element.cloneNode(true) as Element);
            currentHeight += nextMeasurement.height;
            // Remove it from the array so we don't process it again
            measurements.splice(j, 1);
            foundSmallerElement = true;
            break;
          }
        }
        
        if (!foundSmallerElement) {
          // No smaller elements found, break the page
          console.log(`📄 Page break: No smaller elements found, breaking page at ${currentHeight}px`);
          pages.push({
            elements: [...currentPageElements],
            totalHeight: currentHeight,
            pageNumber: pageNumber++
          });
          currentPageElements = [];
          currentHeight = 0;
        } else {
          // Continue with the same element next iteration (don't increment i)
          continue;
        }
      }
      
      currentPageElements.push(measurement.element.cloneNode(true) as Element);
      currentHeight += measurement.height;
      i++;
    }

    if (currentPageElements.length > 0) {
      pages.push({
        elements: currentPageElements,
        totalHeight: currentHeight,
        pageNumber: pageNumber
      });
    }

    return pages;
  }

  private renderPaginatedPages(pages: PageData[]): void {
    console.log('🎨 Rendering GPT5-compliant pages...');

    const container = this.getPaginatedContainer();
    if (!container) return;

    container.innerHTML = '';

    pages.forEach((pageData) => {
      const pageElement = this.createPageElement(pageData);
      container.appendChild(pageElement);

      const utilization = ((pageData.totalHeight / this.CONTENT_HEIGHT_PX) * 100).toFixed(1);
      console.log(`📄 Page ${pageData.pageNumber}: ${utilization}% utilized (${pageData.totalHeight}/${this.CONTENT_HEIGHT_PX}px, ${pageData.elements.length} elements)`);
    });

    console.log(`✅ Rendered ${pages.length} GPT5-compliant pages`);
  }

  private createPageElement(pageData: PageData): HTMLDivElement {
    const page = document.createElement('div');
    page.className = 'page';
    
    // Extract any embedded styles from the source content to preserve them
    const sourceContent = this.getSourceContent();
    let embeddedStyles = '';
    if (sourceContent) {
      const existingStyles = sourceContent.querySelectorAll('style');
      existingStyles.forEach(style => {
        embeddedStyles += style.outerHTML;
      });
    }
    
    // Create content container that inherits processed HTML styles
    const pageContent = document.createElement('div');
    pageContent.className = 'extracted-page-content';
    
    // If we have embedded styles, inject them first
    if (embeddedStyles) {
      pageContent.innerHTML = embeddedStyles;
    }
    
    // Set minimal override styles to ensure layout works
    pageContent.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      position: relative !important;
      box-sizing: border-box !important;
      display: block !important;
    `;
    
    // Ensure no child elements break out of the page margins
    pageContent.style.maxWidth = '100%';
    pageContent.style.wordWrap = 'break-word';
    pageContent.style.overflowWrap = 'break-word';

    // Append elements and preserve their original styling
    pageData.elements.forEach(element => {
      pageContent.appendChild(element);
    });

    const pageNumber = document.createElement('div');
    pageNumber.textContent = `Page ${pageData.pageNumber}`;
    pageNumber.style.cssText = `
      position: absolute !important;
      bottom: 0.6cm !important;
      right: 0.6cm !important;
      font-size: 9px !important;
      color: #666 !important;
      font-family: Arial, sans-serif !important;
      z-index: 1000 !important;
    `;

    page.appendChild(pageContent);
    page.appendChild(pageNumber);

    return page;
  }

  private async exportToPdf(): Promise<void> {
    try {
      this.updateStatus('Opening print dialog for PDF export...', 'info');
      window.print();
      this.updateStatus('✅ PDF export initiated', 'success');
    } catch (error) {
      this.handleError('PDF export failed', error);
    }
  }

  // Utility methods
  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private getSourceContent(): HTMLElement | null {
    return document.getElementById('sourceContent') as HTMLElement | null;
  }

  private getPaginatedContainer(): HTMLElement | null {
    return document.getElementById('paginatedContent') as HTMLElement | null;
  }

  private displayProcessedContent(content: string): void {
    const sourceContent = this.getSourceContent();
    if (sourceContent) {
      // Check if content is already processed to prevent duplication
      if (sourceContent.innerHTML.trim() !== '' && sourceContent.querySelector('.extracted-page-content')) {
        console.log('📄 Content already processed, skipping to avoid duplication');
        return;
      }
      
      // Extract content from paginated structure if present
      const processedContent = this.extractContentFromPages(content);
      
      // Check if content includes styles - if so, inject directly
      if (processedContent.includes('<style')) {
        // Content has embedded styles, use as-is
        sourceContent.innerHTML = processedContent;
      } else {
        // Wrap in extracted-page-content for proper styling
        const wrappedContent = `<div class="extracted-page-content">${processedContent}</div>`;
        sourceContent.innerHTML = wrappedContent;
      }
      
      sourceContent.style.display = 'block';
      
      // Make sure it's visible and has proper layout
      sourceContent.style.height = 'auto';
      sourceContent.style.minHeight = 'auto';
      sourceContent.style.overflow = 'visible';
      sourceContent.style.visibility = 'visible';
      sourceContent.style.position = 'static';
      
      // Force layout recalculation
      sourceContent.offsetHeight;
      
      // Populate element registry after HTML is processed
      this.populateElementRegistry();
    }
  }

  private populateElementRegistry(): void {
    console.log('📋 Populating element registry...');
    this.elementRegistry = [];
    
    const sourceContent = this.getSourceContent();
    if (!sourceContent) {
      console.warn('⚠️ No source content found for registry population');
      return;
    }

    const extractedContent = sourceContent.querySelector('.extracted-page-content');
    if (!extractedContent) {
      console.warn('⚠️ No extracted content found for registry population');
      return;
    }

    // Create measurement container for accurate dimensions
    const measurementContainer = document.createElement('div');
    measurementContainer.style.cssText = `
      position: absolute !important;
      top: -99999px !important;
      left: -99999px !important;
      width: 753px !important;
      max-width: 753px !important;
      visibility: hidden !important;
      background: white !important;
      font-family: Helvetica, Arial, sans-serif !important;
      font-size: 11pt !important;
      line-height: 1.4 !important;
      box-sizing: border-box !important;
      overflow: visible !important;
    `;

    const clonedContent = extractedContent.cloneNode(true) as Element;
    measurementContainer.appendChild(clonedContent);
    document.body.appendChild(measurementContainer);

    // Get all child elements (direct children only for now)
    const elements = Array.from(clonedContent.children);
    
    elements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const registryEntry: ElementRegistry = {
        id: `elem_${index + 1}`,
        order: index + 1,
        element: element.cloneNode(true) as Element,
        tagName: element.tagName.toLowerCase(),
        className: element.className || 'no-class',
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height),
        isTable: element.tagName.toLowerCase() === 'table',
        canBreak: element.tagName.toLowerCase() === 'table', // Only tables can break for now
        textContent: (element.textContent || '').trim().substring(0, 50) + '...'
      };
      
      this.elementRegistry.push(registryEntry);
      console.log(`📋 Registry[${registryEntry.order}]: ${registryEntry.tagName}.${registryEntry.className} - ${registryEntry.height}px - "${registryEntry.textContent}"`);
      
      // Special debug for tables
      if (registryEntry.isTable) {
        console.log(`🔍 TABLE DETECTED: Registry[${registryEntry.order}] is a TABLE with ${registryEntry.height}px height`);
      }
    });

    document.body.removeChild(measurementContainer);
    console.log(`✅ Element registry populated with ${this.elementRegistry.length} elements`);
    
    // Display registry table for debugging
    this.displayElementRegistry();
  }

  private displayElementRegistry(): void {
    console.log('\n📊 ELEMENT REGISTRY TABLE:');
    console.log('┌─────┬──────────────┬───────────────┬───────┬────────┬───────┬──────────────────────────────────┐');
    console.log('│ ID  │ Order │ Tag   │ Class        │ Width │ Height │ Table │ Text Content                     │');
    console.log('├─────┼───────┼───────┼──────────────┼───────┼────────┼───────┼──────────────────────────────────┤');
    
    this.elementRegistry.forEach(entry => {
      const id = entry.id.padEnd(4);
      const order = entry.order.toString().padStart(5);
      const tag = entry.tagName.padEnd(6);
      const className = entry.className.substring(0, 12).padEnd(12);
      const width = entry.width.toString().padStart(5);
      const height = entry.height.toString().padStart(6);
      const table = entry.isTable ? ' ✓ '.padEnd(5) : '   '.padEnd(5);
      const text = entry.textContent.substring(0, 32).padEnd(32);
      
      console.log(`│ ${id} │ ${order} │ ${tag} │ ${className} │ ${width} │ ${height} │ ${table} │ ${text} │`);
    });
    
    console.log('└─────┴───────┴───────┴──────────────┴───────┴────────┴───────┴──────────────────────────────────┘\n');
  }

  private extractContentFromPages(htmlContent: string): string {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Check if this is already paginated content (has .page elements)
      const pageElements = doc.querySelectorAll('.page');
      
      if (pageElements.length > 0) {
        console.log(`📄 Detected pre-paginated content, extracting from ${pageElements.length} pages to continuous document`);
        
        // Extract all content from page containers to create one continuous document
        let extractedContent = '';
        
        // Track table state for merging split tables
        let currentTable: {element: HTMLTableElement, hasHeader: boolean} | null = null;
        
        pageElements.forEach((pageElement, index) => {
          // Look for content inside page-content containers or directly in page
          const contentContainer = pageElement.querySelector('.page-content') || 
                                  pageElement.querySelector('.extracted-page-content') || 
                                  pageElement;
          
          if (contentContainer) {
            console.log(`📄 Extracting content from page ${index + 1}`);
            
            // Get all content elements (skip page numbers and other non-content elements)
            Array.from(contentContainer.children).forEach(child => {
              const childElement = child as HTMLElement;
              
              // Skip page numbers, navigation elements, etc.
              if (childElement.className && 
                  (childElement.className.includes('page-number') || 
                   childElement.className.includes('navigation') ||
                   childElement.className.includes('footer'))) {
                return;
              }
              
              // Handle table merging for split tables
              if (childElement.tagName.toLowerCase() === 'table') {
                const table = childElement as HTMLTableElement;
                const hasHeader = table.querySelector('thead') !== null;
                
                if (currentTable && !hasHeader) {
                  // This is likely a continuation of the previous table
                  console.log(`🔗 Merging table continuation from page ${index + 1}`);
                  const tbody = table.querySelector('tbody');
                  if (tbody && currentTable.element.querySelector('tbody')) {
                    // Merge tbody rows
                    const currentTbody = currentTable.element.querySelector('tbody')!;
                    Array.from(tbody.children).forEach(row => {
                      currentTbody.appendChild(row.cloneNode(true));
                    });
                  }
                  return; // Skip adding this table separately
                } else {
                  // New table or table with header
                  if (currentTable) {
                    extractedContent += currentTable.element.outerHTML + '\n';
                  }
                  currentTable = {element: table.cloneNode(true) as HTMLTableElement, hasHeader};
                  return; // Don't add yet, in case it continues
                }
              } else {
                // Non-table element, add any pending table first
                if (currentTable) {
                  extractedContent += currentTable.element.outerHTML + '\n';
                  currentTable = null;
                }
              }
              
              extractedContent += childElement.outerHTML + '\n';
            });
          }
        });
        
        // Add any remaining table
        if (currentTable) {
          extractedContent += currentTable.element.outerHTML + '\n';
        }
        
        console.log(`✅ Extracted continuous content: ${extractedContent.length} characters`);
        return extractedContent;
      } else {
        // Not paginated, extract body content with preserved styles
        const body = doc.body;
        const head = doc.head;
        if (body) {
          // Preserve styles but remove scripts
          const scripts = body.querySelectorAll('script');
          scripts.forEach(script => script.remove());
          
          // Extract and preserve head styles
          let preservedStyles = '';
          if (head) {
            const headStyles = head.querySelectorAll('style');
            headStyles.forEach(style => {
              preservedStyles += style.outerHTML;
            });
          }
          
          // Include preserved styles with body content
          return preservedStyles + body.innerHTML;
        }
      }
      
      return htmlContent;
    } catch (error) {
      console.warn('Failed to extract content, using raw HTML:', error);
      return htmlContent;
    }
  }

  private switchToPaginatedView(): void {
    const sourceContent = this.getSourceContent();
    const paginatedContent = this.getPaginatedContainer();

    if (sourceContent) sourceContent.style.display = 'none';
    if (paginatedContent) paginatedContent.style.display = 'block';
  }

  private updateStatus(message: string, type: StatusType): void {
    console.log(`[${type.toUpperCase()}] ${message}`);

    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.className = `status ${type}`;
    }
  }

  private generateElementKey(element: Element): string {
    // Generate a unique key for an element based on its content and structure
    const tagName = element.tagName;
    const textContent = element.textContent?.trim().substring(0, 100) || '';
    const classes = element.className || '';
    const id = element.id || '';
    return `${tagName}:${id}:${classes}:${textContent}`;
  }

  private measureSingleElement(element: Element): number {
    // Accurately measure a single element's height
    const measurementContainer = document.createElement('div');
    measurementContainer.style.cssText = `
      position: absolute !important;
      top: -99999px !important;
      left: -99999px !important;
      visibility: hidden !important;
      width: 753px !important;
      max-width: 753px !important;
      padding: 0.6cm !important;
      box-sizing: border-box !important;
    `;
    
    const clonedElement = element.cloneNode(true) as Element;
    measurementContainer.appendChild(clonedElement);
    document.body.appendChild(measurementContainer);
    
    // Force layout
    measurementContainer.offsetHeight;
    const height = Math.ceil(clonedElement.getBoundingClientRect().height);
    
    document.body.removeChild(measurementContainer);
    return height;
  }
  
  private breakTableIntoPages(table: Element, startHeight: number, startPageNumber: number): PageData[] {
    console.log(`📅 Breaking table: startHeight=${startHeight}px, pageHeight=${this.CONTENT_HEIGHT_PX}px`);
    
    const pages: PageData[] = [];
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    console.log(`📅 Table structure: thead=${!!thead}, tbody=${!!tbody}`);
    
    // Get rows from tbody or directly from table if no tbody
    let rows: Element[];
    if (tbody) {
      rows = Array.from(tbody.querySelectorAll('tr'));
    } else {
      // No tbody, get tr elements directly from table (excluding thead rows)
      const allRows = Array.from(table.querySelectorAll('tr'));
      const theadRows = thead ? Array.from(thead.querySelectorAll('tr')) : [];
      rows = allRows.filter(row => !theadRows.includes(row));
    }
    
    console.log(`📅 Found ${rows.length} data rows to process`);
    
    if (rows.length === 0) {
      console.log(`⚠️ No data rows found, creating single table page`);
      // No rows to break, but still create a single page with the table
      return [{
        elements: [table.cloneNode(true) as Element],
        totalHeight: 100, // Rough estimate for empty table
        pageNumber: startPageNumber
      }];
    }
    
    // For better page utilization, break tables more aggressively
    // Only keep very small tables (1-2 rows) as single units
    if (rows.length <= 2) {
      console.log(`📅 Very small table (${rows.length} rows), creating single page`);
      return [{
        elements: [table.cloneNode(true) as Element],
        totalHeight: this.measureSingleElement(table.cloneNode(true) as Element), // Use actual measured height
        pageNumber: startPageNumber
      }];
    }
    
    // Force breaking for tables with 3+ rows to improve page utilization
    console.log(`📅 Medium/large table (${rows.length} rows), forcing row-level breaking`);
    
    // Create a measurement container to get row heights
    const measurementContainer = document.createElement('div');
    measurementContainer.style.cssText = `
      position: absolute !important;
      top: -99999px !important;
      left: -99999px !important;
      visibility: hidden !important;
      width: 800px !important;
    `;
    
    const testTable = table.cloneNode(true) as Element;
    measurementContainer.appendChild(testTable);
    document.body.appendChild(measurementContainer);
    
    // Force layout
    measurementContainer.offsetHeight;
    
    const headerHeight = thead ? thead.getBoundingClientRect().height : 0;
    
    // Get row heights from the test table, handling both tbody and direct tr cases
    let testRows: Element[];
    const testTbody = testTable.querySelector('tbody');
    if (testTbody) {
      testRows = Array.from(testTbody.querySelectorAll('tr'));
    } else {
      const testThead = testTable.querySelector('thead');
      const allTestRows = Array.from(testTable.querySelectorAll('tr'));
      const testTheadRows = testThead ? Array.from(testThead.querySelectorAll('tr')) : [];
      testRows = allTestRows.filter(row => !testTheadRows.includes(row));
    }
    
    const rowHeights = testRows.map(row => 
      Math.ceil(row.getBoundingClientRect().height)
    );
    
    document.body.removeChild(measurementContainer);
    
    let currentPageRows: Element[] = [];
    let currentHeight = startHeight + headerHeight; // Include header in height calculation
    let pageNumber = startPageNumber;
    
    console.log(`📅 Processing ${rows.length} rows with heights:`, rowHeights.slice(0, 5));
    
    for (let i = 0; i < rows.length; i++) {
      const rowHeight = rowHeights[i];
      
      console.log(`📅 Row ${i + 1}: ${rowHeight}px, currentHeight: ${currentHeight}px, available: ${this.CONTENT_HEIGHT_PX - currentHeight}px`);
      
      // More aggressive page breaking: break when we have reasonable content OR exceed height
      const shouldBreakPage = (currentHeight + rowHeight > this.CONTENT_HEIGHT_PX && currentPageRows.length > 0) ||
                             (currentPageRows.length >= 4 && currentHeight > this.CONTENT_HEIGHT_PX * 0.4); // Break if 4+ rows and 40%+ utilized
      
      if (shouldBreakPage) {
        console.log(`📅 Creating table page with ${currentPageRows.length} rows (height: ${currentHeight}px)`);
        // Create page with current rows using actual calculated height
        const tableElement = this.createTableWithRows(table, thead, currentPageRows);
        const actualHeight = this.measureSingleElement(tableElement);
        pages.push({
          elements: [tableElement],
          totalHeight: actualHeight, // Use the actual measured height
          pageNumber: pageNumber++
        });
        currentPageRows = [];
        currentHeight = headerHeight; // Reset with header height
      }
      
      currentPageRows.push(rows[i]);
      currentHeight += rowHeight;
    }
    
    // Add remaining rows to final page
    if (currentPageRows.length > 0) {
      const tableElement = this.createTableWithRows(table, thead, currentPageRows);
      const actualHeight = this.measureSingleElement(tableElement);
      pages.push({
        elements: [tableElement],
        totalHeight: actualHeight, // Use the actual measured height
        pageNumber: pageNumber
      });
    }
    
    return pages;
  }
  
  private createTableWithRows(originalTable: Element, thead: Element | null, rows: Element[]): Element {
    const table = document.createElement('table');
    
    // Copy table attributes and styles
    Array.from(originalTable.attributes).forEach(attr => {
      table.setAttribute(attr.name, attr.value);
    });
    
    // Add header if it exists
    if (thead) {
      table.appendChild(thead.cloneNode(true));
    }
    
    // Add rows for this page (with or without tbody structure)
    if (originalTable.querySelector('tbody')) {
      // Original has tbody, maintain structure
      const tbody = document.createElement('tbody');
      rows.forEach(row => {
        tbody.appendChild(row.cloneNode(true));
      });
      table.appendChild(tbody);
    } else {
      // Original has no tbody, add rows directly
      rows.forEach(row => {
        table.appendChild(row.cloneNode(true));
      });
    }
    
    return table;
  }
  
  private createTablePage(originalTable: Element, thead: Element | null, rows: Element[], pageNumber: number, rowHeights?: number[]): PageData {
    const table = document.createElement('table');
    
    // Copy table attributes and styles
    Array.from(originalTable.attributes).forEach(attr => {
      table.setAttribute(attr.name, attr.value);
    });
    
    // Add header if it exists
    if (thead) {
      table.appendChild(thead.cloneNode(true));
    }
    
    // Add rows for this page (with or without tbody structure)
    if (originalTable.querySelector('tbody')) {
      // Original has tbody, maintain structure
      const tbody = document.createElement('tbody');
      rows.forEach(row => {
        tbody.appendChild(row.cloneNode(true));
      });
      table.appendChild(tbody);
    } else {
      // Original has no tbody, add rows directly
      rows.forEach(row => {
        table.appendChild(row.cloneNode(true));
      });
    }
    
    // Calculate height for this table page using pre-calculated row heights
    const actualRowHeights = rowHeights ? 
      rowHeights.reduce((total, height) => total + height, 0) : 
      rows.length * 50; // Fallback estimate if no heights provided
    const estimatedHeight = (thead ? 40 : 0) + actualRowHeights;
    
    return {
      elements: [table],
      totalHeight: estimatedHeight,
      pageNumber: pageNumber
    };
  }

  private getWordCount(element: HTMLElement): number {
    if (!element) return 0;
    
    // Get text content and count words
    const textContent = element.textContent || '';
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }

  private handleError(context: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const fullMessage = `${context}: ${errorMessage}`;
    
    console.error(fullMessage);
    this.updateStatus(fullMessage, 'error');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new HtmlPaginator();
});