const firstName = document.querySelector('#firstName');

const lastName = document.querySelector('#lastName');

const email = document.querySelector('#userEmail');

const phoneNumber = document.querySelector('#phoneNumber');

const password = document.querySelector('#userPassword');

const password2 = document.querySelector('#userPassword2');

const selectBox = document.querySelector('#selectBox');

const myForm = document.querySelector('#myForm');

const greenBox = document.querySelector('.green');

const validate = (e) => {
  e.preventDefault();
  greenBox.style.display = 'block';
  firstName.value = '';
  lastName.value = '';
  email.value = '';
  password.value = '';
  password2.value = '';
  phoneNumber.value = '';
  selectBox.value = '';
  setInterval(() => {
    greenBox.style.display = 'none';
  }, 3000);
}

myForm.addEventListener('submit', validate);
