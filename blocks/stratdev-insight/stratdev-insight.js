export default function init(blockEl) {
  blockEl.classList.add('content');
  const image = blockEl.querySelectorAll(':scope > div');
  image.forEach((element) => {
    element.classList.add('insight-row');
    const logo = element.querySelector(':scope > div');
    logo.classList.add('business-logo');
  });
}
