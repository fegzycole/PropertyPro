const menuBtn = document.querySelector('#hamIcon');
const nav = document.querySelector('.sidenav');
const exitBtn = document.querySelector('#xBtn');
const newBtn = document.querySelectorAll('.newbtn');

menuBtn.addEventListener('click', () => {
  nav.setAttribute('style', 'display:block !important');
});

exitBtn.addEventListener('click', () => {
  nav.style.display = 'none';
});


const displayUpdatePage = () => {
  window.location.href = './updatelisting.html';
};
newBtn.forEach((el) => { el.addEventListener('click', displayUpdatePage); });
