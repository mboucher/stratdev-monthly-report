/* eslint-disable no-plusplus */
import { getLibs } from '../../scripts/utils.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);
let currentIndex = 0;

const tableHeader = {
  rows: [
    {
      key: 'Categories',
      label: 'Categories',
    },
    {
      key: 'Outcomes',
      label: 'Outcomes',
    },
    {
      key: 'QTD',
      label: 'QTD',
    },
    {
      key: 'Q1 Target',
      label: 'Q1 Target',
    },
    {
      key: 'YTD',
      label: 'YTD',
    },
    {
      key: 'FY24 Target',
      label: 'FY24 Target',
    },
  ],

};

function initTable() {
  const table = createTag('table', { class: 'kpi-table' });
  const header = createTag('tr', { class: 'kpi-table-header' });
  tableHeader.rows.map((item, index) => {
    const columnHeader = createTag('th', { class: item.key });
    if (index > 1) {
      columnHeader.classList.add('kpi-value-header');
    }
    columnHeader.innerText = item.label;
    header.append(columnHeader);
    return true;
  });
  table.append(header);
  return table;
}

function getSpanCount(array, index) {
  let spanCount = 1;
  let trigger = false;
  for (let i = 1; i < 4; i++) {
    if (array[index + i]) {
      if (array[index + i].Categories.length === 0 && trigger === false) {
        spanCount += 1;
      } else {
        trigger = true;
      }
    }
  }
  currentIndex += spanCount;
  return spanCount;
}

function validateResult(item) {
  const result = Math.round((item.QTD / item['Q1 Target']) * 100);

  // eslint-disable-next-line radix
  if (parseInt(item.QTD) === 0 && parseInt(item['Q1 Target']) === 0) {
    return 'kpi-green';
  }

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
  blockEl.classList.add('content', 'kpi-table-container');
  const table = initTable();
  const response = await fetch('/kpis.json');
  const kpis = await response.json();
  kpis.data.map((item) => {
    const result = validateResult(item);
    const kpiRow = createTag('tr', { class: 'kpi-row' });
    tableHeader.rows.forEach((rowElement) => {
      const kpiColumn = createTag('td', { class: rowElement.key });
      if (rowElement.key === 'Categories') {
        if (item.Categories.length > 0) {
          const spanCount = getSpanCount(kpis.data, currentIndex);
          const attr = document.createAttribute('rowspan');
          attr.value = spanCount;
          kpiColumn.setAttributeNode(attr);
          kpiColumn.innerText = item[rowElement.key];
          kpiRow.append(kpiColumn);
        }
      } else {
        if (rowElement.key === 'QTD') {
          const attr = document.createAttribute('class');
          attr.value = result;
          kpiColumn.setAttributeNode(attr);
        }
        if (rowElement.key !== 'Outcomes') {
          kpiColumn.classList.add('kpi-value');
        } else {
          kpiColumn.classList.add('kpi-outcome');
        }
        kpiColumn.innerText = item[rowElement.key];
        kpiRow.append(kpiColumn);
      }
    });
    table.append(kpiRow);
    return true;
  });
  blockEl.append(table);
}
