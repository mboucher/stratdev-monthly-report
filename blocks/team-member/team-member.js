/* eslint-disable no-plusplus */
export default async function init(el) {
  // blockEl.classList.add('content');
  const details = el.querySelectorAll('p');
  details[0].classList.add('card-sub-title');
  for (let i = 1; i < details.length; i++) {
    details[i].classList.add('card-details');
  }
}
