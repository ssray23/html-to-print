// CHROMIUM PDF EXPORTER - TYPESCRIPT IMPLEMENTATION
// GPT5-compliant PDF generation using headless Chromium
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var __syncRequire = typeof module === "object" && typeof module.exports === "object";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChromiumPdfExporter = void 0;
    class ChromiumPdfExporter {
        constructor() {
            this.defaultOptions = {
                filename: 'paginated-document.pdf',
                quality: 'high',
                margins: {
                    top: '0.6cm',
                    right: '0.6cm',
                    bottom: '0.6cm',
                    left: '0.6cm'
                },
                printBackground: true,
                landscape: false
            };
        }
        /**
         * Export paginated HTML to PDF using headless Chromium
         */
        async exportToPdf(htmlContent, options = {}) {
            const config = { ...this.defaultOptions, ...options };
            try {
                console.log('🔄 Starting Chromium PDF export...');
                if (this.isNodeEnvironment()) {
                    await this.exportServerSide(htmlContent, config);
                }
                else {
                    await this.exportClientSide(htmlContent, config);
                }
                console.log('✅ PDF export completed successfully');
            }
            catch (error) {
                console.error('❌ PDF export failed:', error);
                throw error;
            }
        }
        /**
         * Server-side PDF export using Puppeteer
         */
        async exportServerSide(htmlContent, config) {
            // This would require Puppeteer in a Node.js environment
            try {
                const puppeteer = await (__syncRequire ? Promise.resolve().then(() => __importStar(require('puppeteer'))) : new Promise((resolve_1, reject_1) => { require(['puppeteer'], resolve_1, reject_1); }).then(__importStar));
                console.log('🚀 Launching headless Chromium...');
                const browser = await puppeteer.launch({
                    headless: true,
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-gpu'
                    ]
                });
                const page = await browser.newPage();
                // Set viewport for consistent rendering
                await page.setViewport({
                    width: 794, // A4 width in pixels at 96 DPI
                    height: 1123, // A4 height in pixels at 96 DPI
                    deviceScaleFactor: 1
                });
                // Load HTML content
                await page.setContent(htmlContent, {
                    waitUntil: ['networkidle0', 'domcontentloaded']
                });
                // Generate PDF with GPT5-compliant settings
                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    width: '210mm',
                    height: '297mm',
                    margin: config.margins,
                    printBackground: config.printBackground,
                    landscape: config.landscape,
                    preferCSSPageSize: true,
                    displayHeaderFooter: false
                });
                await browser.close();
                // Save PDF file
                await this.savePdfFile(Buffer.from(pdfBuffer), config.filename);
                console.log(`📄 PDF saved: ${config.filename}`);
            }
            catch (error) {
                throw new Error(`Puppeteer export failed: ${error}`);
            }
        }
        /**
         * Client-side PDF export using browser print API
         */
        async exportClientSide(htmlContent, config) {
            try {
                // Create new window with paginated content
                const printWindow = window.open('', '_blank');
                if (!printWindow) {
                    throw new Error('Failed to open print window. Please allow popups.');
                }
                // Write GPT5-compliant HTML structure
                printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${config.filename}</title>
          <meta charset="utf-8">
          <link rel="stylesheet" href="paginator.css">
          <style>
            @page {
              size: A4;
              margin: ${config.margins.top} ${config.margins.right} ${config.margins.bottom} ${config.margins.left};
            }
            
            body {
              margin: 0;
              padding: 0;
              font-family: Helvetica, Arial, sans-serif;
              font-size: 12pt;
              line-height: 1.4;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            
            .page {
              width: 210mm !important;
              height: 297mm !important;
              box-sizing: border-box !important;
              padding: 0.6cm !important;
              margin: 0 !important;
              border: none !important;
              background: white !important;
              page-break-after: always !important;
              overflow: hidden !important;
            }
            
            .page:last-child {
              page-break-after: auto !important;
            }
            
            /* Table-specific rules for clean breaks */
            table { 
              break-inside: auto !important; 
            }
            thead { 
              display: table-header-group !important; 
            }
            tr { 
              break-inside: avoid !important; 
            }
            
            @media screen {
              .page {
                box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                margin: 0 auto 20px auto !important;
              }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);
                printWindow.document.close();
                // Wait for content to load
                await new Promise((resolve) => {
                    if (printWindow.document.readyState === 'complete') {
                        resolve();
                    }
                    else {
                        printWindow.addEventListener('load', () => resolve());
                    }
                });
                // Focus and print
                printWindow.focus();
                printWindow.print();
                // Clean up after a delay
                setTimeout(() => {
                    printWindow.close();
                }, 1000);
            }
            catch (error) {
                throw new Error(`Client-side export failed: ${error}`);
            }
        }
        /**
         * Save PDF buffer to file (Node.js environment)
         */
        async savePdfFile(pdfBuffer, filename) {
            if (!this.isNodeEnvironment()) {
                throw new Error('File saving only available in Node.js environment');
            }
            try {
                const fs = await (__syncRequire ? Promise.resolve().then(() => __importStar(require('fs/promises'))) : new Promise((resolve_2, reject_2) => { require(['fs/promises'], resolve_2, reject_2); }).then(__importStar));
                await fs.writeFile(filename, pdfBuffer);
            }
            catch (error) {
                throw new Error(`Failed to save PDF file: ${error}`);
            }
        }
        /**
         * Check if running in Node.js environment
         */
        isNodeEnvironment() {
            return typeof process !== 'undefined' &&
                process.versions !== undefined &&
                typeof process.versions.node === 'string';
        }
        /**
         * Validate A4 dimensions and margins
         */
        validateA4Compliance(pageElement) {
            const rect = pageElement.getBoundingClientRect();
            const expectedA4WidthPx = (210 / 25.4) * 96; // ~794px
            const expectedA4HeightPx = (297 / 25.4) * 96; // ~1123px
            const tolerance = 5; // 5px tolerance
            const widthValid = Math.abs(rect.width - expectedA4WidthPx) <= tolerance;
            const heightValid = Math.abs(rect.height - expectedA4HeightPx) <= tolerance;
            if (!widthValid || !heightValid) {
                console.warn(`⚠️ A4 compliance check failed:
        Expected: ${expectedA4WidthPx.toFixed(0)}x${expectedA4HeightPx.toFixed(0)}px
        Actual: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)}px
        Valid: width=${widthValid}, height=${heightValid}`);
                return false;
            }
            console.log('✅ A4 compliance check passed');
            return true;
        }
        /**
         * Verify 0.6cm margins
         */
        verifyMargins(pageElement) {
            const computedStyles = window.getComputedStyle(pageElement);
            const paddingTop = parseFloat(computedStyles.paddingTop);
            const paddingRight = parseFloat(computedStyles.paddingRight);
            const paddingBottom = parseFloat(computedStyles.paddingBottom);
            const paddingLeft = parseFloat(computedStyles.paddingLeft);
            const expectedPadding = (0.6 / 2.54) * 96; // 0.6cm in pixels
            const tolerance = 2; // 2px tolerance
            const marginsValid = [paddingTop, paddingRight, paddingBottom, paddingLeft]
                .every(padding => Math.abs(padding - expectedPadding) <= tolerance);
            if (!marginsValid) {
                console.warn(`⚠️ Margin verification failed:
        Expected: ${expectedPadding.toFixed(1)}px all sides
        Actual: ${paddingTop.toFixed(1)}px ${paddingRight.toFixed(1)}px ${paddingBottom.toFixed(1)}px ${paddingLeft.toFixed(1)}px`);
                return false;
            }
            console.log('✅ 0.6cm margin verification passed');
            return true;
        }
    }
    exports.ChromiumPdfExporter = ChromiumPdfExporter;
    // Export for use
    exports.default = ChromiumPdfExporter;
});
//# sourceMappingURL=pdf-exporter.js.map