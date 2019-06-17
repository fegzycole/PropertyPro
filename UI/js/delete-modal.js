const modalContent = document.querySelector('.modal-content');

const cancelDelete = document.querySelector('#cancelDelete');

const initiateDelete = document.querySelector('#delete');

const showModal = () => {
  modalContent.style.display = 'block';
};

const hideModal = () => {
  modalContent.style.display = 'none';
};

initiateDelete.addEventListener('click', showModal);

cancelDelete.addEventListener('click', hideModal);
