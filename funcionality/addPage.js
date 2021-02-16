const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const coverExamples = document.querySelectorAll('.cover-example');
const coverExamplesImg = document.querySelectorAll('.cover-example-img');
const coverExamplesAccepted = document.querySelectorAll('.cover-example-accepted');
const overlay = document.getElementById('overlay');
const findBtn = document.getElementById('find-btn');
const loadingMessage = document.querySelector('.loading-message');
const customFileInput = document.querySelector('.custom-file-input');
const coverAvatar = document.querySelector('.cover-avatar');
const submitCoverBtn = document.querySelector('.submit-cover-btn');
const formSubmitBtn = document.querySelector('.form-submit-btn');
const submitBtn = document.querySelector('.submit-btn');
let preview = document.getElementById('img-id=preview');

// Opening and closing the modals
openModalButtons.forEach(input => {
  input.addEventListener('click', () => {
      const modal = document.querySelector(input.dataset.modalTarget);
      openModal(modal);
    });
  });
  
  overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
      closeModal(modal);
    });
  });
  
  closeModalButtons.forEach(input => {
    input.addEventListener('click', () => {
      const modal = input.closest('.modal');
      closeModal(modal);
    });
  });
  
  function openModal(modal) {
    if (modal === null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
  };
  
  function closeModal(modal) {
    if (modal === null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
  };

  // Selecting focused item
  coverExamples.forEach((example) => {
    example.addEventListener('click', () => {
      // example.classList.contains('focused') ? example.classList.remove('focused') : example.classList.add('focused');
      if (!example.classList.contains('focused')){
        coverExamples.forEach((exampleV2) => { exampleV2.classList.remove('focused') });
        example.classList.add('focused');
      } else {
        example.classList.remove('focused');
      }
    });
  });

// Displaying the cover thumbnail after loading
customFileInput.addEventListener('change', (event) => {
  if (event.target.files.length > 0){
    let src = URL.createObjectURL(event.target.files[0]);
    // let preview = document.getElementById('img-id=preview');
    preview.src = src;
    preview.style.display = 'block';
  }
});

// Searching for cover thumbnails
let gbUri, imgUrl, j;

findBtn.addEventListener('click', () => {
  const title = document.getElementById('title').value;
  if (title === '' || !title) {
    const fillMsg = document.createElement('div');
    fillMsg.className = 'warningMsg';
    const fillTextMsg = document.createTextNode('Enter the title before searching for the cover');
    fillMsg.appendChild(fillTextMsg);
    const contentModal = document.querySelector('.msg-banner');
    contentModal.appendChild(fillMsg);
  } else {
    const warningMsg = document.querySelector('.warningMsg');
    if (warningMsg !== null) {
      warningMsg.parentNode.removeChild(warningMsg);
    }

    // Pass the link to the Google Books API with a key replacing MY_KEY
    gbUri = 'https://www.googleapis.com/books/v1/volumes?key=MY_KEY&cx=017576662512468239146:omuauf_lfve&q=' + title;
    imgUrl = null;
    j = 0;
    fetch(gbUri).then(response => response.json()).then(async response => {
      for (let i = 0; i < 3; i++) {
        while (j < response.items.length) {
          let currentImg = coverExamplesImg[i];
          if (await response.items[j].volumeInfo.imageLinks !== undefined) {
            imgUrl = await response.items[j].volumeInfo.imageLinks.thumbnail;
            currentImg.setAttribute('src', imgUrl);
            j++;
            break;
          }
          if (i < 2 && j >= response.items.length) console.log('There is no enough thumbnail for this book.');
          j++;
        }
      }
    });
  };
});

// Adding cover's src to submitted element
submitCoverBtn.addEventListener('click', () => {
  let i = 0;
  coverExamples.forEach(example => {
    if (example.classList.contains('focused')) {
      preview.src = coverExamplesImg[i].src;
    }
    i++;
  });
});

submitBtn.addEventListener('click', async () => {
  if (customFileInput.files.length === 0) {
    if (preview.src) {
      let hiddenImgInput = document.querySelector('.hiddenImgInput');
      hiddenImgInput.value = preview.src;
    }
  }
  formSubmitBtn.submit();
});