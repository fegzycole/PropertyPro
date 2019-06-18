const menuBtn = document.querySelector('#hamIcon');
const nav = document.querySelector('.sidenav');
const exitBtn = document.querySelector('#xBtn');
const newBtn = document.querySelectorAll('.newbtn');
const viewSpecificAdvertBtn = document.querySelectorAll('.all-list-btn');

menuBtn.addEventListener('click', () => {
  nav.setAttribute('style', 'display:block !important');
});

exitBtn.addEventListener('click', () => {
  nav.style.display = 'none';
});


const displayUpdatePage = () => {
  window.location.href = './updatelisting.html';
};

const displaySpecifiProperty = () => {
  window.location.href = './property.html';
};
newBtn.forEach(el => el.addEventListener('click', displayUpdatePage));
viewSpecificAdvertBtn.forEach(el => el.addEventListener('click', displaySpecifiProperty));
