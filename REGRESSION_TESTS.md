# HTML Paginator Regression Test Pack

## Test Scope
This test pack verifies that the HTML paginator preserves visual fidelity while correctly breaking content into pages.

## Core Requirements
- ✅ **Visual Fidelity**: Original document styling must be preserved exactly
- ✅ **Functionality**: Pagination must work without errors
- ✅ **Text Visibility**: All text must be readable (no invisible text issues)
- ✅ **Spacing**: Original spacing between elements must be maintained
- ✅ **Layout**: Container structures and visual elements preserved

## Test Documents

### 1. ML Document (ml.html) - CMYK Color Scheme
**Visual Elements to Verify:**
- [ ] Blue table headers (`--cmyk-blue: #0066CC`)
- [ ] Cyan stat boxes (`--cmyk-cyan: #00CCCC`) with white text
- [ ] Proper spacing between stat boxes (8pt margins)
- [ ] Two-column layout preservation
- [ ] Rounded corners on tables (6pt border-radius)
- [ ] Yellow highlights (`--cmyk-yellow: #FFCC00`)
- [ ] Gray text boxes with proper margins

### 2. Rose Document (rose.html) - Dark Theme
**Visual Elements to Verify:**
- [ ] Dark gradient table headers with WHITE text
- [ ] No white rectangle artifacts around tables
- [ ] Rounded table corners visible
- [ ] Purple/blue gradient reference box
- [ ] Score circles with colored backgrounds
- [ ] Proper link styling (blue with underlines)
- [ ] Alternating row colors in tables

### 3. Cloud Document (cloud.html) - Light Theme  
**Visual Elements to Verify:**
- [ ] Light gray table headers (`#fafafa`) with BLACK text
- [ ] Clean table borders and styling
- [ ] Callout boxes with proper colors (note: blue, warning: orange)
- [ ] Proper paragraph and heading spacing
- [ ] No visual artifacts or overlays

## Test Procedure

### Step 1: Process Each Document
1. Upload document to paginator
2. Click "Process HTML" 
3. Verify processed version maintains styling
4. Click "Paginate"
5. Verify paginated version maintains styling

### Step 2: Visual Inspection Checklist

#### Table Headers
- [ ] ML: Blue background with white text
- [ ] Rose: Dark gradient with white text  
- [ ] Cloud: Light gray with black text

#### Stat/Content Boxes
- [ ] ML: Cyan stat boxes visible with white text
- [ ] Rose: Score circles with proper colors
- [ ] Cloud: Callout boxes with correct background colors

#### Spacing and Layout
- [ ] Proper margins between elements
- [ ] Two-column layouts preserved
- [ ] Text box spacing maintained
- [ ] No collapsed or compressed sections

#### Visual Artifacts
- [ ] No white rectangle overlays
- [ ] Rounded corners visible where expected
- [ ] No invisible text issues
- [ ] Backgrounds and colors preserved

### Step 3: Error Detection
Check browser console for:
- [ ] No JavaScript errors during processing
- [ ] No CSS parsing warnings
- [ ] No missing element warnings

## Success Criteria
**PASS**: All visual elements preserved exactly as original, no functionality errors
**FAIL**: Any styling changes, invisible text, or visual artifacts detected

## Test Results Log
Date: ___________
Tester: __________

### ML Document Results:
- Blue headers: ☐ PASS ☐ FAIL
- Cyan stat boxes: ☐ PASS ☐ FAIL  
- Spacing: ☐ PASS ☐ FAIL
- Layout: ☐ PASS ☐ FAIL

### Rose Document Results:
- Dark headers: ☐ PASS ☐ FAIL
- No artifacts: ☐ PASS ☐ FAIL
- Rounded corners: ☐ PASS ☐ FAIL
- Colors: ☐ PASS ☐ FAIL

### Cloud Document Results:
- Light headers: ☐ PASS ☐ FAIL
- Black text: ☐ PASS ☐ FAIL
- Callouts: ☐ PASS ☐ FAIL
- Spacing: ☐ PASS ☐ FAIL

## Notes Section
_Record any issues found during testing_