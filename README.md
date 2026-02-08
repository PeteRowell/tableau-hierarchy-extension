# Hierarchy Tree Drill Down Extension

A Tableau **worksheet extension** (viz extension) that displays hierarchy dimensions in an expand/collapse tree with measures.

## Requirements

- **Tableau 2024.2 or later** — `worksheetContent` (required for worksheet extensions) was introduced in Tableau 2024.2.

If you have an older Tableau version, worksheet extensions will not work. Use a dashboard extension instead (add it to a dashboard, not a worksheet).

## Usage

1. On a worksheet, open the **Marks** card dropdown.
2. Select **Hierarchy Tree** (or your extension name).
3. **Drag your Tableau hierarchy to Rows** (e.g. drag the "Product" hierarchy—Category, Sub-Category, Product Name). The extension uses the hierarchy levels from the worksheet.
4. **Drag your measure(s) to Detail** (e.g. SUM(Sales)). Measures appear as columns and do not change.
5. **Date fields are excluded** from the tree—only the hierarchy dimensions (Category, Sub-Category, Product Name, etc.) appear for drill-down.

## If it stays on "Initializing extension..."

- Check your Tableau version: Help → About Tableau. You need **2024.2 or later**.
- If you’re on an older version, switch to the dashboard extension instead (add the extension to a dashboard, not the Marks card).

## Hosting

Host these files on GitHub Pages or any HTTPS server. 

**Important:** The URL in `hierarchy-tree.trex` must match your GitHub Pages URL exactly:
- Username is case-sensitive (e.g. `PeteRowell` not `peterowell`)
- Format: `https://YOUR_USERNAME.github.io/tableau-hierarchy-extension/hierarchy-tree-extension.html`
- Verify: open that URL in a browser — you should see the extension page
