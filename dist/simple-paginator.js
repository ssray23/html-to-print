// SIMPLE BROWSER-ONLY HTML PAGINATOR - NO IMPORTS/EXPORTS
// GPT5-compliant with Chromium LayoutNG
class HtmlPaginator {
    constructor() {
        this.A4_HEIGHT_MM = 297;
        this.MARGIN_CM = 0.6;
        this.CONTENT_HEIGHT_MM = 297 - (0.6 * 2 * 10); // 285mm
        this.CONTENT_HEIGHT_PX = Math.floor(((297 - (0.6 * 2 * 10)) / 25.4) * 96 * 0.75); // ~810px for proper bottom margins
        this.elementRegistry = [];
        this.extractedVariables = {};
        this.completeOriginalStyles = '';
        // Global pagination tolerance setting - controls how aggressively content is packed onto pages
        this.PAGINATION_TOLERANCE_PX = 123; // Default 123px tolerance - the SWEET SPOT for optimal space utilization
        this.init();
    }
    init() {
        console.log('🔥 Clean HTML Paginator initialized');
        this.setupEventListeners();
        this.initializeDisplay();
    }
    initializeDisplay() {
        // Explicitly hide content containers initially
        const sourceContent = this.getSourceContent();
        const paginatedContent = this.getPaginatedContainer();
        if (sourceContent) {
            sourceContent.style.display = 'none';
        }
        if (paginatedContent) {
            paginatedContent.style.display = 'none';
        }
    }
    // Method to update pagination tolerance setting
    setPaginationTolerance(tolerancePx) {
        this.PAGINATION_TOLERANCE_PX = Math.max(0, Math.min(500, tolerancePx)); // Clamp between 0-500px
        console.log(`📏 Pagination tolerance updated to ${this.PAGINATION_TOLERANCE_PX}px`);
    }
    setupEventListeners() {
        const processBtn = document.getElementById('processBtn');
        const paginateBtn = document.getElementById('paginateBtn');
        const exportPdfBtn = document.getElementById('exportPdfBtn');
        processBtn?.addEventListener('click', () => this.processHTML());
        paginateBtn?.addEventListener('click', () => this.paginateContent());
        exportPdfBtn?.addEventListener('click', () => this.exportToPdf());
    }
    async processHTML() {
        console.log('🔥 processHTML called');
        // Clear all previous content when uploading a new HTML file
        this.clearAllContent();
        const sourceContent = this.getSourceContent();
        // Check if there's already processed content - just show it
        if (sourceContent && sourceContent.innerHTML.trim() !== '') {
            console.log('📄 Found existing content, showing it');
            console.log('📄 Existing content length:', sourceContent.innerHTML.length);
            console.log('📄 Existing content preview:', sourceContent.innerHTML.substring(0, 500));
            this.showProcessedContent();
            this.updateStatus('✅ Showing existing processed HTML', 'success');
            return;
        }
        // No existing content, process new file
        const fileInput = document.getElementById('fileInput');
        console.log('📁 File input element:', fileInput);
        console.log('📁 Selected files:', fileInput?.files);
        if (!fileInput?.files?.[0]) {
            this.updateStatus('Please select an HTML file', 'error');
            return;
        }
        try {
            this.updateStatus('Processing HTML file...', 'info');
            const file = fileInput.files[0];
            console.log('📄 Processing file:', file.name);
            const content = await this.readFile(file);
            console.log('📄 File content length:', content.length);
            // Simple processing - just display the content
            this.displayProcessedContent(content);
            this.updateStatus('✅ HTML processed successfully', 'success');
        }
        catch (error) {
            console.error('❌ Error in processHTML:', error);
            this.handleError('HTML processing failed', error);
        }
    }
    async paginateContent() {
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
            const frozenDOM = extractedContent.cloneNode(true);
            console.log('✅ Frozen DOM snapshot created from extracted content only');
            // Use element registry instead of measurements
            console.log(`✅ Using element registry: ${this.elementRegistry.length} elements registered`);
            const pages = this.createPagesFromRegistry();
            console.log(`✅ Created ${pages.length} pages`);
            this.renderPaginatedPages(pages);
            this.switchToPaginatedView();
            // Validate word count between processed continuous content and paginated result
            const processedWordCount = this.getWordCount(sourceContent);
            const paginatedWordCount = this.getWordCount(this.getPaginatedContainer());
            console.log(`📊 Word count validation: Processed=${processedWordCount}, Paginated=${paginatedWordCount}`);
            const wordCountDiff = paginatedWordCount - processedWordCount;
            if (Math.abs(wordCountDiff) <= processedWordCount * 0.05) { // Allow 5% variance
                this.updateStatus(`✅ GPT5-compliant pagination completed! Created ${pages.length} pages. Word count verified: ${processedWordCount} words.`, 'success');
            }
            else if (wordCountDiff > 0 && wordCountDiff < processedWordCount * 0.15) { // Allow up to 15% increase due to repeated headers
                this.updateStatus(`✅ GPT5-compliant pagination completed! Created ${pages.length} pages. Word count: ${processedWordCount} + ${wordCountDiff} repeated headers.`, 'success');
            }
            else {
                this.updateStatus(`⚠️ Pagination completed with ${pages.length} pages. Word count: Processed=${processedWordCount}, Paginated=${paginatedWordCount} (${wordCountDiff > 0 ? '+' : ''}${wordCountDiff})`, 'warning');
            }
        }
        catch (error) {
            this.handleError('Pagination failed', error);
        }
    }
    measureWithChromiumLayoutNG(frozenDOM) {
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
        const clonedDOM = frozenDOM.cloneNode(true);
        measurementContainer.appendChild(clonedDOM);
        document.body.appendChild(measurementContainer);
        // Force Chromium layout
        measurementContainer.offsetHeight;
        clonedDOM.offsetHeight;
        // Find the actual content elements to measure
        const contentContainer = clonedDOM.querySelector('.extracted-page-content') || clonedDOM;
        const elements = Array.from(contentContainer.children);
        console.log(`📋 Found ${elements.length} elements to measure in content container`);
        const measurements = elements.map((element, index) => {
            const rect = element.getBoundingClientRect();
            const computedWidth = element.offsetWidth;
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
    createPagesFromRegistry() {
        console.log('📄 Creating pages from element registry...');
        const pages = [];
        let currentPageElements = [];
        let currentHeight = 0;
        let pageNumber = 1;
        let registryIndex = 0;
        // IMPORTANT: Never modify the registry during pagination to prevent skipped elements
        const registryItems = this.elementRegistry;
        while (registryIndex < registryItems.length) {
            const registryEntry = registryItems[registryIndex];
            // Handle oversized elements that exceed page capacity
            if (registryEntry.height > this.CONTENT_HEIGHT_PX * 2) {
                console.log(`🚨 OVERSIZED ELEMENT DETECTED: Registry[${registryIndex}] (${registryEntry.height}px) exceeds 2x page capacity`);
                console.log(`🔍 Element details: ${registryEntry.element.tagName}.${registryEntry.element.className || 'no-class'}`);
                console.log(`📄 Content preview: ${registryEntry.element.textContent?.substring(0, 200)}...`);
                // Try to break down the oversized element into children
                const children = Array.from(registryEntry.element.children);
                if (children.length > 0) {
                    console.log(`🔧 Attempting to break down oversized element into ${children.length} children`);
                    // Skip this element and let the children be processed individually if they exist
                    registryIndex++;
                    continue;
                }
                else {
                    console.log(`⚠️ Cannot break down oversized element - no children found. Creating oversized page.`);
                }
            }
            // Handle tables with smarter placement logic
            if (registryEntry.isTable) {
                const remainingSpace = this.CONTENT_HEIGHT_PX * 0.95 - currentHeight;
                const freshPageSpace = this.CONTENT_HEIGHT_PX * 0.95;
                // If table fits comfortably on current page, treat it as a regular element
                if (registryEntry.height <= remainingSpace) {
                    console.log(`📊 Table Registry[${registryEntry.order}] (${registryEntry.height}px) fits in available space (${remainingSpace}px), treating as regular element`);
                    // Will be processed by normal flow below
                }
                else if (registryEntry.height <= freshPageSpace && currentPageElements.length > 0) {
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
                }
                else if (registryEntry.height > freshPageSpace) {
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
                    }
                    else {
                        console.log(`⚠️ Table breaking failed, treating Registry[${registryEntry.order}] as regular element`);
                    }
                }
                else {
                    // Edge case: table fits on fresh page but we're already on an empty page
                    console.log(`📊 Table Registry[${registryEntry.order}] (${registryEntry.height}px) treating as regular element (edge case)`);
                }
            }
            // Check if current element fits on page
            const remainingSpace = this.CONTENT_HEIGHT_PX * 0.95 - currentHeight;
            if (registryEntry.height > remainingSpace + this.PAGINATION_TOLERANCE_PX && currentPageElements.length > 0) { // Use global tolerance for space utilization
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
            currentPageElements.push(registryEntry.element.cloneNode(true));
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
    fillRemainingPageSpace(registryItems, remainingSpace, startIndex) {
        const elementsFilled = [];
        let totalHeight = 0;
        let elementsProcessed = 0;
        const availableSpace = remainingSpace;
        if (availableSpace < 30)
            return { elementsFilled, totalHeight, elementsProcessed }; // Not worth filling
        console.log(`🔄 Looking for SEQUENTIAL elements to fill remaining space (starting from index ${startIndex})...`);
        // Only look at NEXT elements in sequence to preserve content order
        for (let j = startIndex; j < registryItems.length && j < startIndex + 10; j++) { // Limit look-ahead to 10 elements
            const candidate = registryItems[j];
            if (totalHeight + candidate.height <= availableSpace && !candidate.isTable) {
                console.log(`✅ Sequentially fitting Registry[${candidate.order}] ${candidate.tagName} (${candidate.height}px)`);
                elementsFilled.push(candidate.element.cloneNode(true));
                totalHeight += candidate.height;
                elementsProcessed++;
                // Check if we should continue
                const newRemainingSpace = availableSpace - totalHeight;
                if (newRemainingSpace < 20) {
                    console.log(`📄 Space filled sequentially (${newRemainingSpace}px remaining)`);
                    break;
                }
            }
            else if (candidate.height > availableSpace - totalHeight) {
                // This element won't fit, and neither will any larger ones after it
                console.log(`🛑 Registry[${candidate.order}] ${candidate.tagName} (${candidate.height}px) won't fit in remaining ${availableSpace - totalHeight}px, stopping fill`);
                break;
            }
        }
        return { elementsFilled, totalHeight, elementsProcessed };
    }
    fillRemainingPageSpaceFixed(startIndex, remainingSpace) {
        const elementsFilled = [];
        let totalHeight = 0;
        let elementsProcessed = 0;
        if (remainingSpace < 20)
            return { elementsFilled, totalHeight, elementsProcessed }; // Allow tighter fitting
        console.log(`🔄 Looking for SEQUENTIAL elements to fill remaining space (starting from index ${startIndex})...`);
        // Only look at NEXT elements in sequence to preserve content order
        // CRITICAL: Never modify the main registry, only read from it
        for (let j = startIndex; j < this.elementRegistry.length && j < startIndex + 10; j++) {
            const candidate = this.elementRegistry[j];
            if (totalHeight + candidate.height <= remainingSpace && !candidate.isTable) {
                console.log(`✅ Sequentially fitting Registry[${candidate.order}] ${candidate.tagName} (${candidate.height}px)`);
                elementsFilled.push(candidate.element.cloneNode(true));
                totalHeight += candidate.height;
                elementsProcessed++;
                // Check if we should continue
                const newRemainingSpace = remainingSpace - totalHeight;
                if (newRemainingSpace < 20) {
                    console.log(`📄 Space filled sequentially (${newRemainingSpace}px remaining)`);
                    break;
                }
            }
            else if (candidate.isTable) {
                // CRITICAL FIX: Don't skip tables, just don't include them in sequential fill
                // But still count them as "processed" so main loop can handle them
                console.log(`🔍 TABLE SKIP: Registry[${candidate.order}] ${candidate.tagName} (${candidate.height}px) is table - skipping in fill but will be processed by main loop`);
                // Don't increment elementsProcessed for tables - let main loop handle them
                break; // Stop sequential fill when we hit a table
            }
            else if (candidate.height > remainingSpace - totalHeight) {
                // This element won't fit, and neither will any larger ones after it
                console.log(`🛑 Registry[${candidate.order}] ${candidate.tagName} (${candidate.height}px) won't fit in remaining ${remainingSpace - totalHeight}px, stopping fill`);
                break;
            }
        }
        return { elementsFilled, totalHeight, elementsProcessed };
    }
    createPagesFromMeasurements(measurements) {
        const pages = [];
        let currentPageElements = [];
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
                }
                else {
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
                        currentPageElements.push(nextMeasurement.element.cloneNode(true));
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
                }
                else {
                    // Continue with the same element next iteration (don't increment i)
                    continue;
                }
            }
            currentPageElements.push(measurement.element.cloneNode(true));
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
    renderPaginatedPages(pages) {
        console.log('🎨 Rendering GPT5-compliant pages...');
        const container = this.getPaginatedContainer();
        if (!container)
            return;
        container.innerHTML = '';
        pages.forEach((pageData) => {
            const pageElement = this.createPageElement(pageData);
            container.appendChild(pageElement);
            const utilization = ((pageData.totalHeight / this.CONTENT_HEIGHT_PX) * 100).toFixed(1);
            console.log(`📄 Page ${pageData.pageNumber}: ${utilization}% utilized (${pageData.totalHeight}/${this.CONTENT_HEIGHT_PX}px, ${pageData.elements.length} elements)`);
        });
        console.log(`✅ Rendered ${pages.length} GPT5-compliant pages`);
    }
    createPageElement(pageData) {
        const page = document.createElement('div');
        page.className = 'page';
        // Create content container that inherits processed HTML styles
        const pageContent = document.createElement('div');
        pageContent.className = 'extracted-page-content';
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
        // Inject complete original styles directly into this page for 100% visual fidelity
        if (this.completeOriginalStyles) {
            console.log('🎨 Injecting complete original styles into paginated page...');
            const pageStyleElement = document.createElement('style');
            pageStyleElement.textContent = this.completeOriginalStyles;
            console.log(`🎨 Injected ${this.completeOriginalStyles.length} characters of original CSS into page`);
            pageContent.appendChild(pageStyleElement);
        }
        else if (this.extractedVariables && Object.keys(this.extractedVariables).length > 0) {
            console.log('🎨 Fallback: Injecting CSS variables into paginated page...');
            const pageStyleElement = document.createElement('style');
            let cssVariables = ':root {\n';
            for (const [varName, varValue] of Object.entries(this.extractedVariables)) {
                cssVariables += `  ${varName}: ${varValue};\n`;
            }
            cssVariables += '}\n';
            pageStyleElement.textContent = cssVariables;
            pageContent.appendChild(pageStyleElement);
        }
        // Append elements and preserve their original styling (no manual overrides needed)
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
    async exportToPdf() {
        try {
            this.updateStatus('Opening print dialog for PDF export...', 'info');
            window.print();
            this.updateStatus('✅ PDF export initiated', 'success');
        }
        catch (error) {
            this.handleError('PDF export failed', error);
        }
    }
    // Utility methods
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
    getSourceContent() {
        return document.getElementById('sourceContent');
    }
    getPaginatedContainer() {
        return document.getElementById('paginatedContent');
    }
    clearAllContent() {
        console.log('🧹 Clearing all previous content and starting fresh...');
        // Clear processed content
        const sourceContent = this.getSourceContent();
        if (sourceContent) {
            sourceContent.innerHTML = '';
            sourceContent.style.display = 'none';
            console.log('🧹 Cleared processed content');
        }
        // Clear paginated content
        const paginatedContainer = this.getPaginatedContainer();
        if (paginatedContainer) {
            paginatedContainer.innerHTML = '';
            paginatedContainer.style.display = 'none';
            console.log('🧹 Cleared paginated content');
        }
        // Clear element registry
        this.elementRegistry = [];
        console.log('🧹 Cleared element registry');
        // Clear CSS variables and original styles
        this.extractedVariables = {};
        this.completeOriginalStyles = '';
        console.log('🧹 Cleared CSS variables and original styles');
        // Reset any status messages
        this.updateStatus('Ready to process new HTML file...', 'info');
    }
    displayProcessedContent(content) {
        console.log('🎨 displayProcessedContent called with content length:', content.length);
        const sourceContent = this.getSourceContent();
        console.log('📄 Source content element:', sourceContent);
        if (sourceContent) {
            // Check if content is already processed to prevent duplication
            if (sourceContent.innerHTML.trim() !== '' && sourceContent.querySelector('.extracted-page-content')) {
                console.log('📄 Content already processed, skipping to avoid duplication');
                return;
            }
            // Extract content from paginated structure if present
            const processedContent = this.extractContentFromPages(content);
            // Check if content includes styles - extract and wrap properly
            if (processedContent.includes('<style')) {
                // Extract styles and content separately
                const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/gi;
                const styles = processedContent.match(styleRegex) || [];
                const contentWithoutStyles = processedContent.replace(styleRegex, '').trim();
                // Combine styles with wrapped content
                const wrappedContent = styles.join('\n') + `<div class="extracted-page-content">${contentWithoutStyles}</div>`;
                sourceContent.innerHTML = wrappedContent;
                console.log('✅ Set innerHTML with styles, content length:', wrappedContent.length);
            }
            else {
                // Wrap in extracted-page-content for proper styling
                const wrappedContent = `<div class="extracted-page-content">${processedContent}</div>`;
                sourceContent.innerHTML = wrappedContent;
                console.log('✅ Set innerHTML without styles, content length:', wrappedContent.length);
            }
            console.log('📄 Final sourceContent innerHTML length:', sourceContent.innerHTML.length);
            sourceContent.style.display = 'block';
            console.log('👁️ Set sourceContent display to block');
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
    showProcessedContent() {
        console.log('🔍 showProcessedContent called');
        const sourceContent = this.getSourceContent();
        const paginatedContent = this.getPaginatedContainer();
        console.log('📄 sourceContent element:', sourceContent);
        console.log('📄 sourceContent innerHTML length:', sourceContent?.innerHTML?.length);
        console.log('📄 sourceContent innerHTML preview:', sourceContent?.innerHTML?.substring(0, 200));
        if (sourceContent) {
            // Show processed content, hide paginated content
            sourceContent.style.display = 'block';
            console.log('👁️ Set sourceContent display to block');
            if (paginatedContent) {
                paginatedContent.style.display = 'none';
                console.log('👁️ Hidden paginated content');
            }
            // Ensure proper layout
            sourceContent.style.height = 'auto';
            sourceContent.style.minHeight = 'auto';
            sourceContent.style.overflow = 'visible';
            sourceContent.style.visibility = 'visible';
            sourceContent.style.position = 'static';
            console.log('👁️ Applied all visibility styles');
            console.log('📐 sourceContent computed styles:', {
                display: getComputedStyle(sourceContent).display,
                visibility: getComputedStyle(sourceContent).visibility,
                height: getComputedStyle(sourceContent).height,
                overflow: getComputedStyle(sourceContent).overflow
            });
            // Force layout recalculation
            sourceContent.offsetHeight;
            console.log('🔄 Forced layout recalculation');
        }
    }
    getElementsForRegistry(container) {
        const elements = [];
        const maxElementHeight = this.CONTENT_HEIGHT_PX * 1.5; // 1.5x page height threshold
        Array.from(container.children).forEach(child => {
            const rect = child.getBoundingClientRect();
            const height = Math.ceil(rect.height);
            // If element is oversized and has children, break it down
            if (height > maxElementHeight && child.children.length > 0) {
                console.log(`🔧 Breaking down oversized ${child.tagName}.${child.className || 'no-class'} (${height}px) into ${child.children.length} children`);
                // Recursively get children instead of the oversized parent
                elements.push(...this.getElementsForRegistry(child));
            }
            else {
                // Element is appropriately sized or is a leaf element
                elements.push(child);
                if (height > maxElementHeight) {
                    console.log(`⚠️ Leaf element ${child.tagName}.${child.className || 'no-class'} is oversized (${height}px) but has no children to break down`);
                }
            }
        });
        return elements;
    }
    populateElementRegistry() {
        console.log('📋 Populating element registry...');
        this.elementRegistry = [];
        console.log('📋 Registry population started - clearing existing registry');
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
        const clonedContent = extractedContent.cloneNode(true);
        measurementContainer.appendChild(clonedContent);
        document.body.appendChild(measurementContainer);
        // Get all child elements and recursively break down oversized containers
        const elements = this.getElementsForRegistry(clonedContent);
        elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const registryEntry = {
                id: `elem_${index + 1}`,
                order: index + 1,
                element: element.cloneNode(true),
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
        if (this.elementRegistry.length > 0) {
            // Display registry table for debugging
            this.displayElementRegistry();
        }
        else {
            console.warn('⚠️ Registry is empty - no elements were registered');
        }
    }
    displayElementRegistry() {
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
    extractContentFromPages(htmlContent) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            // Check if this is already paginated content (has .page elements)
            const pageElements = doc.querySelectorAll('.page');
            if (pageElements.length > 0) {
                console.log(`📄 Detected pre-paginated content, extracting from ${pageElements.length} pages to continuous document`);
                // Extract and preserve CSS styles from the original document
                let extractedStyles = '';
                const styleElements = doc.querySelectorAll('style');
                styleElements.forEach(styleEl => {
                    extractedStyles += styleEl.outerHTML + '\n';
                });
                // Extract CSS variables for dynamic application and store full original styles
                this.extractAndApplyCSSVariables(styleElements, extractedStyles);
                // Extract all content from page containers to create one continuous document
                let extractedContent = '';
                // Track table state for merging split tables
                let currentTable = null;
                pageElements.forEach((pageElement, index) => {
                    // Look for content inside page-content containers or directly in page
                    const contentContainer = pageElement.querySelector('.page-content') ||
                        pageElement.querySelector('.extracted-page-content') ||
                        pageElement;
                    if (contentContainer) {
                        console.log(`📄 Extracting content from page ${index + 1}`);
                        // Check if this is our own paginated content vs original multi-page document
                        const isOurPaginatedContent = pageElement.querySelector('.extracted-page-content') !== null;
                        if (isOurPaginatedContent) {
                            // Handle our own paginated content with table merging
                            Array.from(contentContainer.children).forEach(child => {
                                const childElement = child;
                                // Skip page numbers, navigation elements, etc.
                                if (childElement.className &&
                                    (childElement.className.includes('page-number') ||
                                        childElement.className.includes('navigation') ||
                                        childElement.className.includes('footer'))) {
                                    return;
                                }
                                // Handle table merging for split tables
                                if (childElement.tagName.toLowerCase() === 'table') {
                                    const table = childElement;
                                    const hasHeader = table.querySelector('thead') !== null;
                                    if (currentTable && !hasHeader) {
                                        // This is likely a continuation of the previous table
                                        console.log(`🔗 Merging table continuation from page ${index + 1}`);
                                        const tbody = table.querySelector('tbody');
                                        if (tbody && currentTable.element.querySelector('tbody')) {
                                            // Merge tbody rows
                                            const currentTbody = currentTable.element.querySelector('tbody');
                                            Array.from(tbody.children).forEach(row => {
                                                currentTbody.appendChild(row.cloneNode(true));
                                            });
                                        }
                                        return; // Skip adding this table separately
                                    }
                                    else {
                                        // New table or table with header
                                        if (currentTable) {
                                            extractedContent += currentTable.element.outerHTML + '\n';
                                        }
                                        currentTable = { element: table.cloneNode(true), hasHeader };
                                        return; // Don't add yet, in case it continues
                                    }
                                }
                                else {
                                    // Non-table element, add any pending table first
                                    if (currentTable) {
                                        extractedContent += currentTable.element.outerHTML + '\n';
                                        currentTable = null;
                                    }
                                }
                                extractedContent += childElement.outerHTML + '\n';
                            });
                        }
                        else {
                            // Handle original multi-page documents (like ml.html) - extract ALL content
                            console.log(`📄 Processing original multi-page document (page ${index + 1})`);
                            Array.from(contentContainer.children).forEach(child => {
                                const childElement = child;
                                // Only skip obvious non-content elements, but be much more permissive
                                if (childElement.className &&
                                    (childElement.className.includes('page-number') ||
                                        childElement.className.includes('report-footer'))) {
                                    console.log(`⏭️ Skipping non-content element: ${childElement.className}`);
                                    return;
                                }
                                // For original documents, add ALL content including complete tables
                                console.log(`✅ Including element: ${childElement.tagName}.${childElement.className || 'no-class'}`);
                                extractedContent += childElement.outerHTML + '\n';
                            });
                        }
                    }
                });
                // Add any remaining table
                if (currentTable) {
                    extractedContent += currentTable.element.outerHTML + '\n';
                }
                // Combine styles and content
                const finalContent = extractedStyles + extractedContent;
                console.log(`✅ Extracted continuous content: ${finalContent.length} characters (${extractedStyles.length} chars styles + ${extractedContent.length} chars content)`);
                return finalContent;
            }
            else {
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
        }
        catch (error) {
            console.warn('Failed to extract content, using raw HTML:', error);
            return htmlContent;
        }
    }
    switchToPaginatedView() {
        const sourceContent = this.getSourceContent();
        const paginatedContent = this.getPaginatedContainer();
        if (sourceContent)
            sourceContent.style.display = 'none';
        if (paginatedContent)
            paginatedContent.style.display = 'block';
    }
    updateStatus(message, type) {
        console.log(`[${type.toUpperCase()}] ${message}`);
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `status ${type}`;
        }
    }
    extractAndApplyCSSVariables(styleElements, fullExtractedStyles) {
        console.log('🎨 Extracting and preserving ALL styles for 100% visual fidelity...');
        let completeStylesCSS = '';
        let cssVariables = {};
        styleElements.forEach((styleEl, index) => {
            const cssText = styleEl.textContent || '';
            completeStylesCSS += `\n/* EXTRACTED STYLE BLOCK ${index + 1} */\n${cssText}\n`;
            // Extract CSS variables for reference (but preserve all styles)
            const variableRegex = /--([\w-]+):\s*([^;]+);/g;
            let match;
            while ((match = variableRegex.exec(cssText)) !== null) {
                const varName = match[1];
                const varValue = match[2].trim();
                cssVariables[`--${varName}`] = varValue;
                console.log(`🎨 Found CSS variable: --${varName} = ${varValue}`);
            }
        });
        // Store both complete styles and variables
        this.completeOriginalStyles = completeStylesCSS;
        this.extractedVariables = cssVariables;
        console.log(`🎨 Extracted complete styles: ${completeStylesCSS.length} characters`);
        console.log(`🎨 Found ${Object.keys(cssVariables).length} CSS variables`);
        // Apply complete original styling for 100% visual fidelity
        this.applyCompleteOriginalStyles(completeStylesCSS);
    }
    applyCompleteOriginalStyles(completeStyles) {
        console.log('🎨 Applying complete original styles for 100% visual fidelity...');
        // Create or update global style element for complete original styles
        let globalStyleElement = document.getElementById('complete-original-styles');
        if (!globalStyleElement) {
            globalStyleElement = document.createElement('style');
            globalStyleElement.id = 'complete-original-styles';
            document.head.appendChild(globalStyleElement);
        }
        globalStyleElement.textContent = completeStyles;
        console.log(`🎨 Applied ${completeStyles.length} characters of original CSS`);
    }
    applyCSSVariables(variables, fullExtractedStyles) {
        console.log('🎨 Storing extracted CSS variables in paginator.css...');
        // Store the extracted variables for updating paginator.css
        this.updatePaginatorCSS(variables, fullExtractedStyles);
        console.log(`🎨 Updated paginator.css with ${Object.keys(variables).length} extracted CSS variables`);
    }
    async updatePaginatorCSS(variables, fullExtractedStyles) {
        try {
            // First, apply the styles immediately via inline styles for instant effect
            this.createInlineVariableStyles(variables, fullExtractedStyles);
            // Try to read the existing paginator.css
            const response = await fetch('./paginator.css');
            let cssContent = await response.text();
            // Create the CSS variables section with enhanced styling
            let variablesSection = ':root {\n';
            for (const [varName, varValue] of Object.entries(variables)) {
                variablesSection += `  ${varName}: ${varValue};\n`;
            }
            variablesSection += '}\n\n';
            // Check if there's already an extracted variables section
            const extractedSectionRegex = /\/\* EXTRACTED CSS VARIABLES \*\/[\s\S]*?\/\* END EXTRACTED CSS VARIABLES \*\/\n*/;
            const extractedSection = `/* EXTRACTED CSS VARIABLES */
${variablesSection}
/* ONLY FOR PAGINATED CONTENT - DO NOT TOUCH PROCESSED CONTENT */
.paginated-content th,
.paginated-content thead th,
.paginated-content table th,
.paginated-content table thead th,
.paginated-content .page th,
.paginated-content .page thead th,
.paginated-content .page table th,
.paginated-content .page table thead th {
  background: var(--cmyk-blue, #0066CC) !important;
  color: white !important;
  font-weight: bold !important;
}
/* END EXTRACTED CSS VARIABLES */

`;
            if (extractedSectionRegex.test(cssContent)) {
                // Replace existing section
                cssContent = cssContent.replace(extractedSectionRegex, extractedSection);
            }
            else {
                // Add new section at the beginning
                cssContent = extractedSection + cssContent;
            }
            console.log('🎨 CSS variables extracted and applied to current session');
            console.log(`🎨 Variables applied: ${Object.keys(variables).join(', ')}`);
            console.log('📝 Note: paginator.css updated content ready (CORS prevents direct file write)');
        }
        catch (error) {
            console.error('🎨 Failed to read paginator.css:', error);
            // Still apply the fallback inline styles
            this.createInlineVariableStyles(variables, fullExtractedStyles);
        }
    }
    createInlineVariableStyles(variables, fullExtractedStyles) {
        console.log('🎨 Creating CSS variables + original styles fallback...');
        let fallbackStyle = document.getElementById('fallback-extracted-variables');
        if (!fallbackStyle) {
            fallbackStyle = document.createElement('style');
            fallbackStyle.id = 'fallback-extracted-variables';
            document.head.appendChild(fallbackStyle);
        }
        let cssRules = '';
        // Add full original styles if available (for complete styling preservation)
        if (fullExtractedStyles) {
            console.log('🎨 Including full original styles in fallback...');
            // Extract just the CSS content from style elements
            const styleContentRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
            let match;
            while ((match = styleContentRegex.exec(fullExtractedStyles)) !== null) {
                cssRules += match[1] + '\n';
            }
        }
        else {
            // Fallback to just CSS variables
            cssRules = ':root {\n';
            for (const [varName, varValue] of Object.entries(variables)) {
                cssRules += `  ${varName}: ${varValue};\n`;
            }
            cssRules += '}\n\n';
        }
        // Apply SUPER-SPECIFIC table header styles to override any existing CSS
        cssRules += `
/* SUPER-SPECIFIC TABLE HEADER STYLES - MAXIMUM PRIORITY */
.source-content table th,
.source-content table thead th,
.source-content .extracted-page-content table th,
.source-content .extracted-page-content table thead th,
.source-content .extracted-page-content table.no-class th,
.source-content .extracted-page-content table.no-class thead th,
html .source-content table th,
html .source-content table thead th,
html .source-content .extracted-page-content table th,
html .source-content .extracted-page-content table thead th,
body .source-content table th,
body .source-content table thead th,
body .source-content .extracted-page-content table th,
body .source-content .extracted-page-content table thead th,
.paginated-content th,
.paginated-content thead th,
.paginated-content table th,
.paginated-content table thead th,
.paginated-content .page th,
.paginated-content .page thead th,
.paginated-content .page table th,
.paginated-content .page table thead th {
  background-color: var(--cmyk-blue, #0066CC) !important;
  background: var(--cmyk-blue, #0066CC) !important;
  color: white !important;
  font-weight: bold !important;
}

/* EVEN MORE SPECIFIC - Target exact structure from ml.html */
.source-content .extracted-page-content table:not([class=""]) th,
.source-content .extracted-page-content table thead:not([class=""]) th {
  background-color: var(--cmyk-blue, #0066CC) !important;
  background: var(--cmyk-blue, #0066CC) !important;
  color: white !important;
}
`;
        fallbackStyle.textContent = cssRules;
        if (fullExtractedStyles) {
            console.log('🎨 Full original styles applied - complete styling preserved 100%');
        }
        else {
            console.log('🎨 CSS variables + table headers applied');
        }
    }
    generateElementKey(element) {
        // Generate a unique key for an element based on its content and structure
        const tagName = element.tagName;
        const textContent = element.textContent?.trim().substring(0, 100) || '';
        const classes = element.className || '';
        const id = element.id || '';
        return `${tagName}:${id}:${classes}:${textContent}`;
    }
    measureSingleElement(element) {
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
        const clonedElement = element.cloneNode(true);
        measurementContainer.appendChild(clonedElement);
        document.body.appendChild(measurementContainer);
        // Force layout
        measurementContainer.offsetHeight;
        const height = Math.ceil(clonedElement.getBoundingClientRect().height);
        document.body.removeChild(measurementContainer);
        return height;
    }
    breakTableIntoPages(table, startHeight, startPageNumber) {
        console.log(`📅 Breaking table: startHeight=${startHeight}px, pageHeight=${this.CONTENT_HEIGHT_PX}px`);
        const pages = [];
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
        console.log(`📅 Table structure: thead=${!!thead}, tbody=${!!tbody}`);
        // Get rows from tbody or directly from table if no tbody
        let rows;
        if (tbody) {
            rows = Array.from(tbody.querySelectorAll('tr'));
        }
        else {
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
                    elements: [table.cloneNode(true)],
                    totalHeight: 100, // Rough estimate for empty table
                    pageNumber: startPageNumber
                }];
        }
        // For better page utilization, break tables more aggressively
        // Only keep very small tables (1-2 rows) as single units
        if (rows.length <= 2) {
            console.log(`📅 Very small table (${rows.length} rows), creating single page`);
            return [{
                    elements: [table.cloneNode(true)],
                    totalHeight: this.measureSingleElement(table.cloneNode(true)), // Use actual measured height
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
        const testTable = table.cloneNode(true);
        measurementContainer.appendChild(testTable);
        document.body.appendChild(measurementContainer);
        // Force layout
        measurementContainer.offsetHeight;
        const headerHeight = thead ? thead.getBoundingClientRect().height : 0;
        // Get row heights from the test table, handling both tbody and direct tr cases
        let testRows;
        const testTbody = testTable.querySelector('tbody');
        if (testTbody) {
            testRows = Array.from(testTbody.querySelectorAll('tr'));
        }
        else {
            const testThead = testTable.querySelector('thead');
            const allTestRows = Array.from(testTable.querySelectorAll('tr'));
            const testTheadRows = testThead ? Array.from(testThead.querySelectorAll('tr')) : [];
            testRows = allTestRows.filter(row => !testTheadRows.includes(row));
        }
        const rowHeights = testRows.map(row => Math.ceil(row.getBoundingClientRect().height));
        document.body.removeChild(measurementContainer);
        let currentPageRows = [];
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
    createTableWithRows(originalTable, thead, rows) {
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
        }
        else {
            // Original has no tbody, add rows directly
            rows.forEach(row => {
                table.appendChild(row.cloneNode(true));
            });
        }
        return table;
    }
    createTablePage(originalTable, thead, rows, pageNumber, rowHeights) {
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
        }
        else {
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
    getWordCount(element) {
        if (!element)
            return 0;
        // Get text content and count words
        const textContent = element.textContent || '';
        const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
        return words.length;
    }
    handleError(context, error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const fullMessage = `${context}: ${errorMessage}`;
        console.error(fullMessage);
        this.updateStatus(fullMessage, 'error');
    }
}
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.paginator = new HtmlPaginator();
});
