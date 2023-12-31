import { getLibs } from '../../scripts/utils.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

const tableHeader = {
  rows: [
    {
      key: 'categories',
      label: 'Categories',
    },
    {
      key: 'outcomes',
      label: 'Outcomes',
    },
    {
      key: 'target',
      label: '2023 Target',
    },
    {
      key: 'ytd',
      label: 'YTD',
    },
  ],

};

function initTable() {
  const table = createTag('table', { class: 'kpi-table' });
  const header = createTag('tr', { class: 'kpi-table-header' });
  tableHeader.rows.map((item) => {
    const columnHeader = createTag('th', { class: item.key });
    columnHeader.innerText = item.label;
    header.append(columnHeader);
  });
  table.append(header);
  return table;
}

function getSpanCount(array, index) {
  let spanCount = 1;
  for (let i = 0; i < 3; i++) {
    if (array[index + i]) {
      if (array[index + i].categories.length === 0) {
        spanCount += 1;
      }
    }
  }
  return spanCount;
}

function validateResult(item) {
  const result = Math.round((item.ytd / item.target) * 100);
  if (result >= 100) {
    return 'kpi-green';
  }

  if (result > 80 && result < 100) {
    return 'kpi-yellow';
  }

  if (result < 80) {
    return 'kpi-red';
  }

  return null;
}

export default async function init(blockEl) {
  blockEl.classList.add('content','kpi-table-container');
  const table = initTable();
  const response = await fetch('/kpis.json');
  const kpis = await response.json();
  kpis.data.map((item, index) => {
    const result = validateResult(item);
    const kpiRow = createTag('tr', { class: 'kpi-row' });
    tableHeader.rows.forEach((rowElement) => {
      const kpiColumn = createTag('td', { class: rowElement.key });
      if (rowElement.key === 'categories') {
        if (item.categories.length > 0) {
          const spanCount = getSpanCount(kpis.data, index);
          const attr = document.createAttribute('rowspan');
          attr.value = spanCount;
          kpiColumn.setAttributeNode(attr);
          kpiColumn.innerText = item[rowElement.key];
          kpiRow.append(kpiColumn);
        }
      } else {
        if (rowElement.key === 'ytd') {
          const attr = document.createAttribute('class');
          attr.value = result;
          kpiColumn.setAttributeNode(attr);
        }
        kpiColumn.innerText = item[rowElement.key];
        kpiRow.append(kpiColumn);
      }
    });
    table.append(kpiRow);
  });
  blockEl.append(table);
}
