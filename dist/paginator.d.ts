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
interface MeasurementResult {
    measurements: ElementMeasurement[];
    naturalContentWidth: number;
}
interface PageData {
    elements: Element[];
    totalHeight: number;
    pageNumber: number;
    tableContext?: {
        table: Element;
        thead: Element;
    };
}
interface PaginationConfig {
    readonly A4_WIDTH_MM: number;
    readonly A4_HEIGHT_MM: number;
    readonly MARGIN_CM: number;
    readonly CONTENT_WIDTH_MM: number;
    readonly CONTENT_HEIGHT_MM: number;
    readonly CONTENT_HEIGHT_PX: number;
}
type StatusType = 'info' | 'success' | 'error' | 'warning';
declare class HtmlPaginator {
    private readonly config;
    private preservedStyles;
    private logger;
    constructor();
    /**
     * Initialize the paginator with event listeners
     */
    init(): void;
    /**
     * Setup DOM event listeners with proper typing
     */
    private setupEventListeners;
    /**
     * Process HTML file with type-safe file handling
     */
    private processHTML;
    /**
     * GPT5-compliant pagination using Chromium LayoutNG
     */
    private paginateContent;
    /**
     * Chromium LayoutNG natural measurement with proper typing
     */
    private measureWithChromiumLayoutNG;
    /**
     * Create measurement container with proper styling
     */
    private createMeasurementContainer;
    /**
     * Measure elements using Chromium APIs
     */
    private measureElements;
    /**
     * Create pages with simple boundary logic
     */
    private createPagesFromMeasurements;
    /**
     * Render pages with GPT5-compliant styling
     */
    private renderPaginatedPages;
    /**
     * Create individual page element
     */
    private createPageElement;
    /**
     * Create page number element
     */
    private createPageNumber;
    /**
     * Export to PDF using Chromium headless
     */
    private exportToPdf;
    /**
     * Utility methods
     */
    private readFile;
    private getSourceContent;
    private getPaginatedContainer;
    private createFrozenSnapshot;
    private forceLayout;
    private calculateNaturalWidth;
    private displayProcessedContent;
    private switchToPaginatedView;
    private cleanAndProcessHTML;
    private updateStatus;
    private log;
    private handleError;
}
//# sourceMappingURL=paginator.d.ts.map