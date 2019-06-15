const menuBtn = document.querySelector('#hamIcon');
const nav = document.querySelector('.sidenav');
const exitBtn = document.querySelector('#xBtn');

menuBtn.addEventListener('click', () => {
  nav.setAttribute('style', 'display:block !important');
});

exitBtn.addEventListener('click', () => {
  nav.style.display = 'none';
});
