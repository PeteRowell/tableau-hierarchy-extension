# Tableau Hierarchy Drill Down Extension

A Tableau dashboard extension that lets users drill down through hierarchy dimensions (e.g., Country → State → City, or Header → Line → Detail) using a tree-style expand/collapse interface. The selected path is shown clearly at the top. **This extension does not filter other dashboards.**

## Features

- **Tree view** – Expand and collapse nodes to reveal lower hierarchy levels
- **Clear selection display** – Selected path shown as breadcrumb (e.g., `United States › California › Los Angeles`)
- **Works with Tableau hierarchies** – Uses dimensions from any worksheet as your hierarchy
- **Configurable** – Choose the worksheet and optionally the hierarchy column order
- **No filtering** – Selection is local to the extension; it does not affect other dashboard objects

## Setup in Tableau

1. Create a worksheet with your hierarchy dimensions on Rows (e.g., Country, State, City).
2. Add the extension to your dashboard: **Extensions** → **Add an Extension** → **My Extensions** (or use a local `.trex` file).
3. Right-click the extension zone → **Configure**.
4. Select the worksheet and, if desired, the hierarchy columns in order.
5. Click **Save**.

## Local development

To test locally before deploying:

1. Serve the files over HTTP (e.g., `npx serve .` or `python -m http.server 8080`).
2. Use `hierarchy-tree.local.trex` which points to `http://localhost:8080/`.
3. In Tableau Desktop, add the extension and select the local `.trex` file.

**Note:** Tableau Server/Cloud requires HTTPS. Use GitHub Pages or another HTTPS host for production.

## Hosting on GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings** → **Pages** in the repo.
3. Set **Source** to your main branch (e.g., `main`) and folder `/(root)`.
4. After deployment, your extension URL will be: `https://YOUR_USERNAME.github.io/tableau-hierarchy-extension/`
5. Edit `hierarchy-tree.trex` and replace `YOUR_USERNAME` in the `<url>` with your GitHub username.
6. In Tableau, use **Extensions** → **Add an Extension** → **My Extensions** and browse to your `.trex` file (or host the `.trex` and use its URL).

**Important:** Tableau requires extensions to be served over **HTTPS**. GitHub Pages provides this automatically.

## Files

| File | Purpose |
|------|---------|
| `hierarchy-tree.trex` | Extension manifest – register this with Tableau |
| `index.html` | Main extension UI |
| `config.html` | Configuration dialog |
| `app.js` | Extension logic and tree rendering |
| `styles.css` | Styling |

## Requirements

- Tableau 2018.2+ (2022.4+ recommended for large datasets)
- HTTPS hosting (e.g., GitHub Pages)
