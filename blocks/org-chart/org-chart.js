import { OrgChart } from '../../scripts/orgchart.js';

export default async function init(blockEl) {
  blockEl.classList.add('content');
  const config = {
    enableSearch: false,
    enableDragDrop: false,
    scaleInitial:OrgChart.match.boundary,
    orientation: OrgChart.orientation.left,
    layout: OrgChart.mixed,
    tags: { "assistant": { template: 'mery' } },
    nodeBinding: {
      field_0: 'name',
      field_1: 'title',
      img_0: 'img',
    },
  };
  const response = await fetch('/org-chart.json');
  const chartData = await response.json();
  const chart = new OrgChart(blockEl.querySelector(':scope > div'), config);
  chart.load(chartData.data);
}
