import { PdfExportOptions } from './types';
export declare class ChromiumPdfExporter {
    private readonly defaultOptions;
    /**
     * Export paginated HTML to PDF using headless Chromium
     */
    exportToPdf(htmlContent: string, options?: Partial<PdfExportOptions>): Promise<void>;
    /**
     * Server-side PDF export using Puppeteer
     */
    private exportServerSide;
    /**
     * Client-side PDF export using browser print API
     */
    private exportClientSide;
    /**
     * Save PDF buffer to file (Node.js environment)
     */
    private savePdfFile;
    /**
     * Check if running in Node.js environment
     */
    private isNodeEnvironment;
    /**
     * Validate A4 dimensions and margins
     */
    validateA4Compliance(pageElement: HTMLElement): boolean;
    /**
     * Verify 0.6cm margins
     */
    verifyMargins(pageElement: HTMLElement): boolean;
}
export default ChromiumPdfExporter;
//# sourceMappingURL=pdf-exporter.d.ts.map