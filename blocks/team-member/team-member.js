import { createTag } from '../../scripts/utils.js';

/* eslint-disable no-plusplus */
export default async function init(el) {
  // blockEl.classList.add('content');
  const details = el.querySelectorAll('p');
  details[0].classList.add('card-sub-title');
  for (let i = 1; i < 2; i++) {
    details[i].classList.add('card-details');
  }
  const link = el.querySelectorAll('a');
  if (link.length > 0) {
    const element = link[0];
    const target = element.getAttribute('href');
    element.remove();
    el.addEventListener('click', () => {
      // eslint-disable-next-line no-restricted-globals
      location.href = `${target}?Subject=Request for information from team website`;
    });
  }
}
