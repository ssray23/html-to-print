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
}
type StatusType = 'info' | 'success' | 'error' | 'warning';
declare class HtmlPaginator {
    private readonly A4_HEIGHT_MM;
    private readonly MARGIN_CM;
    private readonly CONTENT_HEIGHT_MM;
    private readonly CONTENT_HEIGHT_PX;
    constructor();
    init(): void;
    private setupEventListeners;
    private processHTML;
    private paginateContent;
    private measureWithChromiumLayoutNG;
    private createPagesFromMeasurements;
    private renderPaginatedPages;
    private createPageElement;
    private exportToPdf;
    private readFile;
    private getSourceContent;
    private getPaginatedContainer;
    private displayProcessedContent;
    private extractContentFromPages;
    private switchToPaginatedView;
    private updateStatus;
    private generateElementKey;
    private breakTableIntoPages;
    private createTablePage;
    private handleError;
}
//# sourceMappingURL=simple-paginator.d.ts.map