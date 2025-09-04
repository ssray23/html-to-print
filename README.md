# Universal HTML to Print Paginator v2

A sophisticated JavaScript-based tool that transforms any HTML content into perfectly paginated A4 print layouts. This tool intelligently analyzes HTML structure, sanitizes problematic CSS, and creates clean page breaks while preserving visual styling and content integrity.

## 🎯 What It Does

- **Smart Content Analysis**: Automatically identifies content types (headings, paragraphs, tables, styled containers)
- **CSS Sanitization**: Removes pagination-breaking CSS rules while preserving visual styling
- **Intelligent Pagination**: Creates natural page breaks that respect content boundaries
- **Print Optimization**: Generates print-ready pages that match screen preview exactly
- **Content Preservation**: Maintains styling, structure, and visual elements throughout the process

## 🚀 How to Use

1. **Upload or Paste HTML**: Use the file picker or paste HTML content directly
2. **Process & Clean**: Click to sanitize CSS and prepare content for pagination
3. **Paginate**: Transform the continuous content into A4 pages
4. **Print**: Generate perfect print output that matches the screen preview

## 🧠 Core Pagination Algorithm

### Phase 1: CSS Sanitization

The tool removes CSS rules that interfere with natural content flow:

```javascript
// Problematic rules removed:
- page-break-* properties
- @page rules
- viewport heights (100vh, 100%)
- calc() height constraints
- overflow: hidden on content areas
- hardcoded widths that break layout
```

### Phase 2: Content Structure Analysis

The algorithm intelligently categorizes HTML elements:

#### Content Types Identified:
- **Content Elements**: `P`, `H1-H6`, `TABLE`, `UL/OL`, `BLOCKQUOTE`, `PRE`, `IMG`, `FIGURE`
- **Indivisible Elements**: Elements with classes like `callout`, `warning`, `success`, `card`, `box`
- **Layout Containers**: `DIV`, `SECTION`, `ARTICLE` (traversed for child content)
- **Table Rows**: Special handling for `TR` elements within tables

#### Smart Container Detection:
```javascript
// Elements treated as indivisible units if they have:
- Visual styling (backgrounds, borders, shadows)
- Special CSS classes (callout, alert, etc.)
- Height under 500px threshold
- Combined styling + size criteria
```

### Phase 3: Height Measurement

Each content element is measured in a hidden container with A4 dimensions:

```javascript
// A4 specifications:
- Width: 210mm
- Height: 297mm  
- Padding: 0.6cm (top/bottom)
- Available content height: ~1077px at 96 DPI
```

### Phase 4: Intelligent Pagination

The core pagination logic follows these principles:

#### Page Space Calculation:
- **Total A4 height**: 1123px (297mm at 96 DPI)
- **Padding**: 46px (0.6cm × 2)
- **Available space**: 1077px per page
- **Safety buffer**: 20px to prevent edge-case overflows

#### Element Placement Logic:
```javascript
for each element:
  if (element.height + buffer <= remainingSpace):
    place_on_current_page()
    update_cumulative_height()
  else if (element.height > max_possible_space):
    skip_oversized_element() // Prevents infinite loops
  else:
    create_new_page()
    place_on_new_page()
```

#### Special Handling by Content Type:

**Table Rows:**
- Extract individual `<tr>` elements
- Create table structure with headers on each new page
- Place rows sequentially, creating new table pages as needed

**Indivisible Content (Callouts, Cards):**
- Treat entire element as single unit
- Move complete element to next page if insufficient space
- Never split styled containers across page boundaries

**Regular Content:**
- Place individual elements (paragraphs, headings, lists)
- Maintain natural content flow
- Preserve styling and structure

### Phase 5: Print CSS Integration

The tool generates CSS rules that force browsers to respect the JavaScript-created pagination:

```css
@media print {
  .page {
    page-break-after: always !important;
    page-break-inside: avoid !important;
  }
  
  .callout, .warning, .success {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }
}
```

## 🔍 Advanced Features

### Pre-Paginated Content Flattening

The tool detects and flattens existing paginated structures:

```javascript
// Detects patterns like:
<div class="pages-container">
  <div class="page">
    <div class="content">...</div>
  </div>
</div>

// Extracts content while skipping headers/footers:
- Removes .page containers
- Extracts content from .content divs  
- Skips .header and .footer elements
- Creates continuous content flow
```

### Content Type Recognition

#### Tables:
- Preserves table structure and styling
- Extracts individual rows for flexible placement
- Automatically recreates headers on new pages
- Maintains table formatting across page breaks

#### Styled Containers:
- Identifies visually styled elements (backgrounds, borders, shadows)
- Treats as indivisible units to prevent visual breaking
- Supports common classes: callout, warning, success, info, alert, card, box

#### Text Content:
- Respects paragraph boundaries
- Maintains list structure and numbering
- Preserves heading hierarchy and styling

### Height Measurement System

The measurement system uses a hidden container that:
- Matches A4 dimensions exactly (210mm width)
- Applies identical padding (0.6cm)
- Forces layout calculation for accurate measurements
- Handles both wrapped and unwrapped content structures

## 📐 Technical Specifications

### Page Dimensions (A4 at 96 DPI):
- **Width**: 210mm = 794px
- **Height**: 297mm = 1123px
- **Padding**: 0.6cm = 23px (each side)
- **Content Area**: 748px × 1077px

### Element Classification:
- **Content Tags**: Elements that contain actual content
- **Layout Containers**: Elements used for structure/layout
- **Indivisible Classes**: Elements that must not be split
- **Table Components**: Special handling for tabular data

### Performance Optimizations:
- Single-pass measurement system
- Cumulative height tracking per page
- Efficient element cloning and placement
- Minimal DOM manipulation during pagination

## 🎨 CSS Architecture

### Screen Styles:
- A4-proportioned page containers with shadows
- Flexible content areas that expand naturally
- Visual page separation with margins and styling

### Print Styles:  
- Removes all decorative elements (shadows, margins)
- Enforces exact A4 dimensions
- Prevents content splitting with `page-break-inside: avoid`
- Matches screen layout exactly in print output

## 🛠️ Browser Compatibility

### Supported Features:
- Modern CSS Grid/Flexbox layouts
- CSS `page-break-*` and `break-*` properties
- JavaScript element measurement APIs
- Print media queries

### Tested Browsers:
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 💡 Use Cases

### Perfect For:
- **Reports and Documents**: Multi-page business reports with mixed content
- **Academic Papers**: Research documents with tables, figures, and formatted text
- **Print-Ready Web Content**: Converting web pages to professional print layouts
- **Form Documents**: Multi-page forms with consistent formatting
- **Presentation Materials**: Handouts and printed presentation materials

### Content Types Supported:
- Rich text with mixed formatting
- Data tables of any size
- Images and figures with captions
- Code blocks and formatted text
- Styled callout boxes and alerts
- Lists, quotes, and specialized content

## 🔧 Customization

### Modify Page Dimensions:
```javascript
// Change A4 to Letter size:
const pageHeightPx = 1056; // 11 inches at 96 DPI
const pageWidthMm = 216;   // 8.5 inches = 216mm
```

### Add Custom Indivisible Classes:
```javascript
const indivisibleClasses = [
  'callout', 'warning', 'success', 'info', 'alert', 
  'card', 'box', 'your-custom-class'
];
```

### Adjust Safety Margins:
```javascript
// Increase buffer for more conservative page breaks:
if (elementHeight <= remainingSpace - 40) { // 40px instead of 20px
```

## 📋 Algorithm Summary

1. **Parse & Clean**: Remove pagination-breaking CSS while preserving visual styles
2. **Flatten Structure**: Extract content from pre-paginated layouts
3. **Analyze Content**: Classify elements by type and identify indivisible units
4. **Measure Elements**: Calculate precise heights in A4-constrained environment
5. **Paginate Intelligently**: Place elements respecting content boundaries
6. **Generate Print CSS**: Create rules that enforce pagination in browser print
7. **Optimize Output**: Clean, professional pages ready for print or PDF export

This creates a seamless workflow from any HTML input to perfect print-ready output, maintaining visual fidelity while ensuring optimal page breaks and professional presentation.