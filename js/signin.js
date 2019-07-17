const form = document.querySelector('#myForm');

const signinUser = (e) => {
  e.preventDefault();
  window.location.href = './Agent/dashboard.html';
};

form.addEventListener('submit', signinUser);
