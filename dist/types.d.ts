export interface ElementMeasurement {
    element: Element;
    height: number;
    width: number;
    naturalWidth: number;
    top: number;
    isTable: boolean;
    isTableRow: boolean;
    index: number;
}
export interface MeasurementResult {
    measurements: ElementMeasurement[];
    naturalContentWidth: number;
}
export interface PageData {
    elements: Element[];
    totalHeight: number;
    pageNumber: number;
    tableContext?: {
        table: Element;
        thead: Element;
    };
}
export interface PaginationConfig {
    readonly A4_WIDTH_MM: number;
    readonly A4_HEIGHT_MM: number;
    readonly MARGIN_CM: number;
    readonly CONTENT_WIDTH_MM: number;
    readonly CONTENT_HEIGHT_MM: number;
    readonly CONTENT_HEIGHT_PX: number;
}
export interface PdfExportOptions {
    filename?: string;
    quality?: 'low' | 'medium' | 'high';
    margins?: {
        top: string;
        right: string;
        bottom: string;
        left: string;
    };
    printBackground?: boolean;
    landscape?: boolean;
}
export type StatusType = 'info' | 'success' | 'error' | 'warning';
export interface StatusUpdate {
    message: string;
    type: StatusType;
    timestamp: Date;
}
//# sourceMappingURL=types.d.ts.map