const contents = document.querySelector('#contents');
const compact = matchMedia('(max-width: 760px)');
function adjustContents() {
  contents.open = !compact.matches;
}
adjustContents();
compact.addEventListener('change', adjustContents);
contents.addEventListener('click', event => {
  if (compact.matches && event.target.closest('a[href^="#"]')) contents.open = false;
});

const links = [...contents.querySelectorAll('nav a[href^="#"]')];
const chapters = links.map(link => document.getElementById(link.hash.slice(1)));
const currentChapter = document.querySelector('#current-chapter');
let activeChapter;
let scheduled = false;
function markChapter() {
  const top = document.querySelector('.topbar').getBoundingClientRect().height
    + (compact.matches ? contents.querySelector('summary').getBoundingClientRect().height : 0) + 22;
  const index = chapters.findLastIndex(chapter => chapter.getBoundingClientRect().top <= top);
  scheduled = false;
  if (index === activeChapter) return;
  activeChapter = index;
  currentChapter.textContent = links[index]?.textContent || '';
  for (const [i, link] of links.entries()) {
    if (i === index) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function scheduleMark() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(markChapter); }
}
window.addEventListener('scroll', scheduleMark, {passive: true});
window.addEventListener('resize', scheduleMark);
window.addEventListener('load', scheduleMark);
markChapter();

const dialog = document.querySelector('#photo-dialog');
const zoom = dialog.querySelector('[data-zoom]');
const close = dialog.querySelector('[data-close]');
const photo = dialog.querySelector('img');
let opener;
document.addEventListener('click', event => {
  const link = event.target.closest('a.shot-link, a.shot-open');
  if (!link || !dialog.showModal || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  opener = link;
  const thumbnail = link.closest('figure').querySelector('img');
  document.querySelector('#photo-title').textContent = link.dataset.title;
  photo.style.width = '';
  photo.src = link.href;
  photo.alt = thumbnail.alt;
  dialog.classList.remove('is-zoomed');
  zoom.textContent = '확대';
  zoom.setAttribute('aria-pressed', 'false');
  dialog.toggleAttribute('data-pointer-open', event.detail !== 0);
  dialog.showModal();
});
zoom.addEventListener('click', () => {
  const fittedWidth = photo.clientWidth;
  const enlarged = dialog.classList.toggle('is-zoomed');
  photo.style.width = enlarged ? Math.max(photo.naturalWidth, fittedWidth * 1.6) + 'px' : '';
  zoom.textContent = enlarged ? '화면에 맞춤' : '확대';
  zoom.setAttribute('aria-pressed', String(enlarged));
});
close.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  dialog.querySelector('.photo-scroll').scrollTo(0, 0);
  opener?.focus({preventScroll: true});
});
