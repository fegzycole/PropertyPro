const viewSpecificAdvertBtn = document.querySelectorAll('.all-list-btn');

const displaySpecifiProperty = () => {
  window.location.href = 'property.html';
};

viewSpecificAdvertBtn.forEach(el => el.addEventListener('click', displaySpecifiProperty));
