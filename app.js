(function () {
  const SETTINGS_KEYS = {
    WORKSHEET: 'worksheet',
    COLUMNS: 'columns'
  };

  let treeData = null;
  let selectedPath = [];

  function $(id) {
    return document.getElementById(id);
  }

  function show( el ) { el.classList.remove('hidden'); }
  function hide( el ) { el.classList.add('hidden'); }

  function updateSelectionDisplay() {
    const el = $('current-selection');
    el.textContent = selectedPath.length ? selectedPath.join(' › ') : '—';
  }

  function buildTree(data, columns) {
    if (!data || !columns || columns.length === 0) return null;
    const root = { children: {}, label: null, path: [] };
    for (const row of data.data) {
      let node = root;
      for (let i = 0; i < columns.length; i++) {
        const colIndex = data.columns.findIndex(c => c.fieldName === columns[i]);
        if (colIndex < 0) continue;
        const val = row[colIndex] && row[colIndex].value !== undefined
          ? String(row[colIndex].value) : '';
        if (!val) continue;
        if (!node.children[val]) {
          node.children[val] = { children: {}, label: val, path: node.path.concat(val) };
        }
        node = node.children[val];
      }
    }
    return root;
  }

  function renderTree(node, container, depth = 0) {
    const keys = Object.keys(node.children || {}).sort();
    if (keys.length === 0) return;

    const ul = document.createElement('div');
    ul.className = 'tree-children';

    keys.forEach(key => {
      const child = node.children[key];
      const hasChildren = Object.keys(child.children || {}).length > 0;
      const div = document.createElement('div');
      div.className = 'tree-node';
      div.dataset.path = JSON.stringify(child.path);

      const toggle = document.createElement('span');
      toggle.className = 'toggle' + (hasChildren ? '' : ' empty');
      toggle.textContent = hasChildren ? '▶' : '  ';

      const label = document.createElement('span');
      label.className = 'label';
      label.textContent = child.label;

      div.appendChild(toggle);
      div.appendChild(label);
      ul.appendChild(div);

      const childContainer = document.createElement('div');
      childContainer.className = 'tree-children';
      if (hasChildren) {
        div.appendChild(childContainer);
        let expanded = depth < 2;
        const renderChildren = () => renderTree(child, childContainer, depth + 1);
        if (expanded) {
          toggle.textContent = '▼';
          renderChildren();
        }
        div.addEventListener('click', () => {
          if (hasChildren) {
            expanded = !expanded;
            toggle.textContent = expanded ? '▼' : '▶';
            childContainer.innerHTML = '';
            if (expanded) renderChildren();
          }
          document.querySelectorAll('.tree-node.selected').forEach(n => n.classList.remove('selected'));
          div.classList.add('selected');
          selectedPath = child.path;
          updateSelectionDisplay();
        });
      } else {
        div.addEventListener('click', () => {
          document.querySelectorAll('.tree-node.selected').forEach(n => n.classList.remove('selected'));
          div.classList.add('selected');
          selectedPath = child.path;
          updateSelectionDisplay();
        });
      }
    });

    container.appendChild(ul);
  }

  function expandAll(node, depth, maxDepth) {
    const keys = Object.keys(node.children || {}).sort();
    keys.forEach(key => {
      const child = node.children[key];
      const hasChildren = Object.keys(child.children || {}).length > 0;
      if (hasChildren && depth < maxDepth) {
        expandAll(child, depth + 1, maxDepth);
      }
    });
  }

  function render(root) {
    const container = $('tree-container');
    container.innerHTML = '';
    if (!root || !root.children) return;
    const keys = Object.keys(root.children).sort();
    keys.forEach(key => {
      const child = root.children[key];
      const hasChildren = Object.keys(child.children || {}).length > 0;
      const div = document.createElement('div');
      div.className = 'tree-node';
      div.dataset.path = JSON.stringify(child.path);

      const toggle = document.createElement('span');
      toggle.className = 'toggle' + (hasChildren ? '' : ' empty');
      toggle.textContent = hasChildren ? '▶' : '  ';

      const label = document.createElement('span');
      label.className = 'label';
      label.textContent = child.label;

      div.appendChild(toggle);
      div.appendChild(label);
      container.appendChild(div);

      const childContainer = document.createElement('div');
      childContainer.className = 'tree-children';
      if (hasChildren) {
        div.appendChild(childContainer);
        let expanded = true;
        const renderChildren = () => renderTree(child, childContainer, 1);
        toggle.textContent = '▼';
        renderChildren();

        div.addEventListener('click', () => {
          expanded = !expanded;
          toggle.textContent = expanded ? '▼' : '▶';
          childContainer.innerHTML = '';
          if (expanded) renderChildren();
          document.querySelectorAll('.tree-node.selected').forEach(n => n.classList.remove('selected'));
          div.classList.add('selected');
          selectedPath = child.path;
          updateSelectionDisplay();
        });
      } else {
        div.addEventListener('click', () => {
          document.querySelectorAll('.tree-node.selected').forEach(n => n.classList.remove('selected'));
          div.classList.add('selected');
          selectedPath = child.path;
          updateSelectionDisplay();
        });
      }
    });
  }

  async function loadData() {
    const worksheetName = tableau.extensions.settings.get(SETTINGS_KEYS.WORKSHEET);
    const columnsJson = tableau.extensions.settings.get(SETTINGS_KEYS.COLUMNS);
    const columns = columnsJson ? JSON.parse(columnsJson) : null;

    hide($('error'));
    hide($('empty'));

    if (!worksheetName) {
      hide($('loading'));
      show($('empty'));
      return;
    }

    show($('loading'));
    hide($('tree-container'));

    try {
      const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
      const worksheet = worksheets.find(ws => ws.name === worksheetName);
      if (!worksheet) {
        throw new Error('Worksheet "' + worksheetName + '" not found.');
      }

      let dataTable;
      if (worksheet.getSummaryDataReaderAsync) {
        const reader = await worksheet.getSummaryDataReaderAsync();
        try {
          dataTable = await reader.getAllPagesAsync();
        } finally {
          await reader.releaseAsync();
        }
      } else {
        dataTable = await worksheet.getSummaryDataAsync();
      }

      const dimColumns = columns && columns.length > 0
        ? columns
        : dataTable.columns.filter(c => c.dataType === 'string' || c.dataType === 'integer').slice(0, 5).map(c => c.fieldName);

      const root = buildTree(dataTable, dimColumns);
      treeData = root;
      hide($('loading'));
      show($('tree-container'));
      render(root);
      updateSelectionDisplay();
    } catch (err) {
      hide($('loading'));
      show($('error'));
      $('error').textContent = err.message || 'Failed to load data.';
    }
  }

  tableau.extensions.initializeAsync({ configure: configure }).then(() => {
    tableau.extensions.settings.addEventListener(tableau.TableauEventType.SettingsChanged, loadData);
    loadData();
  });

  function configure() {
    const configUrl = new URL('config.html', window.location.href).href;
    tableau.extensions.ui.displayDialogAsync(
      configUrl,
      '',
      { height: 400, width: 450 }
    ).then(() => loadData()).catch(() => {});
  }
})();
