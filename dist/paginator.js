"use strict";
// CLEAN HTML TO PRINT PAGINATOR - TYPESCRIPT IMPLEMENTATION
// GPT5-compliant with Chromium LayoutNG and type safety
class HtmlPaginator {
    constructor() {
        this.config = {
            A4_WIDTH_MM: 210,
            A4_HEIGHT_MM: 297,
            MARGIN_CM: 0.6,
            CONTENT_WIDTH_MM: 210 - (0.6 * 2 * 10), // 198mm
            CONTENT_HEIGHT_MM: 297 - (0.6 * 2 * 10), // 285mm
            CONTENT_HEIGHT_PX: ((297 - (0.6 * 2 * 10)) / 25.4) * 96 // ~1080px
        };
        this.preservedStyles = '';
        this.logger = console;
        this.init();
    }
    /**
     * Initialize the paginator with event listeners
     */
    init() {
        this.log('🔥 Clean TypeScript HTML Paginator initialized', 'info');
        this.setupEventListeners();
    }
    /**
     * Setup DOM event listeners with proper typing
     */
    setupEventListeners() {
        const processBtn = document.getElementById('processBtn');
        const paginateBtn = document.getElementById('paginateBtn');
        const exportPdfBtn = document.getElementById('exportPdfBtn');
        processBtn?.addEventListener('click', () => this.processHTML());
        paginateBtn?.addEventListener('click', () => this.paginateContent());
        exportPdfBtn?.addEventListener('click', () => this.exportToPdf());
    }
    /**
     * Process HTML file with type-safe file handling
     */
    async processHTML() {
        const fileInput = document.getElementById('fileInput');
        if (!fileInput?.files?.[0]) {
            this.updateStatus('Please select an HTML file', 'error');
            return;
        }
        try {
            this.updateStatus('Processing HTML file...', 'info');
            const file = fileInput.files[0];
            if (!file.type.includes('html') && !file.name.endsWith('.html')) {
                throw new Error('Please select a valid HTML file');
            }
            const content = await this.readFile(file);
            const processedContent = await this.cleanAndProcessHTML(content);
            this.displayProcessedContent(processedContent);
            this.updateStatus('✅ HTML processed successfully', 'success');
        }
        catch (error) {
            this.handleError('HTML processing failed', error);
        }
    }
    /**
     * GPT5-compliant pagination using Chromium LayoutNG
     */
    async paginateContent() {
        const sourceContent = this.getSourceContent();
        if (!sourceContent) {
            this.updateStatus('Please process HTML first', 'error');
            return;
        }
        try {
            this.log('🎨 Starting GPT5-compliant pagination...', 'info');
            this.updateStatus('Creating paginated HTML...', 'info');
            // Step 1: Create immutable frozen DOM snapshot
            const frozenDOM = this.createFrozenSnapshot(sourceContent);
            this.log('✅ Frozen DOM snapshot created', 'info');
            // Step 2: Measure using Chromium LayoutNG
            const measurementResult = this.measureWithChromiumLayoutNG(frozenDOM);
            this.log(`✅ LayoutNG measurements: ${measurementResult.measurements.length} elements, ${measurementResult.naturalContentWidth}px width`, 'info');
            // Step 3: Create pages with boundary respect
            const pages = this.createPagesFromMeasurements(measurementResult.measurements);
            this.log(`✅ Created ${pages.length} pages`, 'info');
            // Step 4: Render with GPT5-compliant styling
            this.renderPaginatedPages(pages);
            this.switchToPaginatedView();
            this.updateStatus(`✅ GPT5-compliant pagination completed! Created ${pages.length} pages.`, 'success');
        }
        catch (error) {
            this.handleError('Pagination failed', error);
        }
    }
    /**
     * Chromium LayoutNG natural measurement with proper typing
     */
    measureWithChromiumLayoutNG(frozenDOM) {
        this.log('🔍 Using Chromium LayoutNG for natural measurements...', 'info');
        const measurementContainer = this.createMeasurementContainer();
        const clonedDOM = frozenDOM.cloneNode(true);
        measurementContainer.appendChild(clonedDOM);
        document.body.appendChild(measurementContainer);
        // Force Chromium layout calculations
        this.forceLayout(measurementContainer, clonedDOM);
        // Measure all elements using getBoundingClientRect
        const measurements = this.measureElements(Array.from(clonedDOM.children));
        const naturalContentWidth = this.calculateNaturalWidth(measurements);
        // Cleanup
        document.body.removeChild(measurementContainer);
        this.log(`📐 Natural content width detected: ${naturalContentWidth}px`, 'info');
        return {
            measurements,
            naturalContentWidth
        };
    }
    /**
     * Create measurement container with proper styling
     */
    createMeasurementContainer() {
        const container = document.createElement('div');
        container.style.cssText = `
      position: absolute !important;
      top: -99999px !important;
      left: -99999px !important;
      visibility: hidden !important;
      background: white !important;
      font-family: Helvetica, Arial, sans-serif !important;
      font-size: 11pt !important;
      line-height: 1.4 !important;
    `;
        return container;
    }
    /**
     * Measure elements using Chromium APIs
     */
    measureElements(elements) {
        return elements.map((element, index) => {
            const rect = element.getBoundingClientRect();
            const computedWidth = element.offsetWidth;
            this.log(`📏 Element ${index + 1}: ${element.tagName}.${element.className || 'no-class'} - ${rect.height}px (natural width: ${computedWidth}px)`, 'info');
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
    }
    /**
     * Create pages with simple boundary logic
     */
    createPagesFromMeasurements(measurements) {
        const pages = [];
        let currentPageElements = [];
        let currentHeight = 0;
        let pageNumber = 1;
        for (const measurement of measurements) {
            // GPT5 boundary check: simple and clean
            if (currentHeight + measurement.height > this.config.CONTENT_HEIGHT_PX && currentPageElements.length > 0) {
                // Complete current page
                pages.push({
                    elements: [...currentPageElements],
                    totalHeight: currentHeight,
                    pageNumber: pageNumber++
                });
                // Start new page
                currentPageElements = [];
                currentHeight = 0;
            }
            // Add element to current page
            currentPageElements.push(measurement.element.cloneNode(true));
            currentHeight += measurement.height;
        }
        // Add final page if it has content
        if (currentPageElements.length > 0) {
            pages.push({
                elements: currentPageElements,
                totalHeight: currentHeight,
                pageNumber: pageNumber
            });
        }
        return pages;
    }
    /**
     * Render pages with GPT5-compliant styling
     */
    renderPaginatedPages(pages) {
        this.log('🎨 Rendering GPT5-compliant pages...', 'info');
        const container = this.getPaginatedContainer();
        if (!container)
            return;
        container.innerHTML = '';
        pages.forEach((pageData) => {
            const pageElement = this.createPageElement(pageData);
            container.appendChild(pageElement);
            const utilization = ((pageData.totalHeight / this.config.CONTENT_HEIGHT_PX) * 100).toFixed(1);
            this.log(`📄 Page ${pageData.pageNumber}: ${utilization}% utilized (${pageData.totalHeight}/${this.config.CONTENT_HEIGHT_PX}px, ${pageData.elements.length} elements)`, 'info');
        });
        this.log(`✅ Rendered ${pages.length} GPT5-compliant pages`, 'success');
    }
    /**
     * Create individual page element
     */
    createPageElement(pageData) {
        // GPT5-compliant page container
        const page = document.createElement('div');
        page.className = 'page';
        // Content container with preserved CSS context
        const pageContent = document.createElement('div');
        pageContent.className = 'source-content';
        pageContent.style.cssText = `
      width: calc(100% - 0mm) !important;
      height: calc(100% - 0mm) !important;
      max-width: 100% !important;
      max-height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      position: relative !important;
      box-sizing: border-box !important;
      display: block !important;
      background: transparent !important;
    `;
        // Add elements with preserved context
        pageData.elements.forEach(element => {
            pageContent.appendChild(element);
        });
        // Add page number
        const pageNumber = this.createPageNumber(pageData.pageNumber);
        page.appendChild(pageContent);
        page.appendChild(pageNumber);
        return page;
    }
    /**
     * Create page number element
     */
    createPageNumber(pageNum) {
        const pageNumberElement = document.createElement('div');
        pageNumberElement.textContent = `Page ${pageNum}`;
        pageNumberElement.style.cssText = `
      position: absolute !important;
      bottom: 2mm !important;
      right: 0.6cm !important;
      font-size: 9px !important;
      color: #666 !important;
      font-family: Arial, sans-serif !important;
      z-index: 1000 !important;
    `;
        return pageNumberElement;
    }
    /**
     * Export to PDF using Chromium headless
     */
    async exportToPdf() {
        try {
            this.updateStatus('Generating PDF...', 'info');
            // This would integrate with a PDF export service
            // For now, use browser's built-in print functionality
            this.log('📄 Opening print dialog for PDF export...', 'info');
            window.print();
            this.updateStatus('✅ PDF export initiated', 'success');
        }
        catch (error) {
            this.handleError('PDF export failed', error);
        }
    }
    /**
     * Utility methods
     */
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
    createFrozenSnapshot(sourceContent) {
        return sourceContent.cloneNode(true);
    }
    forceLayout(container, content) {
        container.offsetHeight;
        content.offsetHeight;
    }
    calculateNaturalWidth(measurements) {
        return Math.max(...measurements.map(m => m.width));
    }
    displayProcessedContent(content) {
        const sourceContent = this.getSourceContent();
        if (sourceContent) {
            sourceContent.innerHTML = content;
            sourceContent.style.display = 'block';
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
    async cleanAndProcessHTML(content) {
        // Implement HTML processing logic here
        // For now, return content as-is (placeholder)
        return content;
    }
    updateStatus(message, type) {
        this.log(`[${type.toUpperCase()}] ${message}`, type);
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `status ${type}`;
        }
    }
    log(message, type) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} [${type.toUpperCase()}] ${message}`;
        switch (type) {
            case 'error':
                this.logger.error(logMessage);
                break;
            case 'warning':
                this.logger.warn(logMessage);
                break;
            case 'success':
            case 'info':
            default:
                this.logger.log(logMessage);
                break;
        }
    }
    handleError(context, error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const fullMessage = `${context}: ${errorMessage}`;
        this.log(fullMessage, 'error');
        this.updateStatus(fullMessage, 'error');
    }
}
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HtmlPaginator();
});
//# sourceMappingURL=paginator.js.map