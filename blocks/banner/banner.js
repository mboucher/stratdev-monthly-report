/* ************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
************************************************************************* */
import { getLibs } from '../../scripts/utils.js';

const { decorateBlockBg, getBlockSize } = await import(`${getLibs()}/utils/decorate.js`);

const blockTypeSizes = {
  marquee: {
    small: ['xxl', 'l', 'laem'],
    medium: ['xl', 'm', 'm'],
    large: ['xxl', 'xl', 'l'],
    xlarge: ['xxl', 'xl', 'l'],
  },
};

function decorateText(el, size) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  const config = blockTypeSizes.marquee[size];
  const decorate = (headingEl, typeSize) => {
    headingEl.classList.add(`heading-${typeSize[0]}`);
    headingEl.nextElementSibling?.classList.add(`body-${typeSize[1]}`);
    const sib = headingEl.previousElementSibling;
    if (sib) {
      const className = sib.querySelector('img, .icon') ? 'icon-area' : `detail-${typeSize[2]}`;
      sib.classList.add(className);
      sib.previousElementSibling?.classList.add('icon-area');
    }
  };
  decorate(heading, config);
}

const decorateImage = (media) => {
  media.classList.add('image');

  const imageLink = media.querySelector('a');
  const picture = media.querySelector('picture');

  if (imageLink && picture && !imageLink.parentElement.classList.contains('modal-img-link')) {
    imageLink.textContent = '';
    imageLink.append(picture);
  }
};

export default async function init(el) {
  if (!['light', 'quiet'].some((s) => el.classList.contains(s))) el.classList.add('dark');
  const children = el.querySelectorAll(':scope > div');
  const foreground = children[children.length - 1];
  if (children.length > 1) {
    children[0].classList.add('background');
    decorateBlockBg(el, children[0], { useHandleFocalpoint: true });
  }

  foreground.classList.add('foreground', 'container');
  const headline = foreground.querySelector('h1, h2, h3, h4, h5, h6');
  const text = headline.closest('div');
  text.classList.add('text');

  const media = foreground.querySelector(':scope > div:not([class])');

  if (media) {
    media.classList.add('banner-media');
    if (!media.querySelector('video, a[href*=".mp4"]')) decorateImage(media);
  }

  const firstDivInForeground = foreground.querySelector(':scope > div');
  if (firstDivInForeground?.classList.contains('banner-media')) el.classList.add('row-reversed');

  const size = getBlockSize(el);
  decorateText(text, size);
}
