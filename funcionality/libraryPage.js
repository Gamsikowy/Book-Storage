const deleteBtns = document.querySelectorAll('.delete-btn-form');
const readBtns = document.querySelectorAll('.read-btn');
const sortBtnForm = document.querySelector('.sort-btn-form');
const backToAddBtn = document.querySelector('.back-to-add-btn');
const overlay = document.getElementById('overlay');

// Button management
deleteBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.submit();
  });
});

sortBtnForm.addEventListener('change', () => {
  sortBtnForm.submit();
});

backToAddBtn.addEventListener('click', () => {
  backToAddBtn.submit();
});

// Load, init, set Google Books API
let viewer = null, wasCalled;
google.books.load();

const initialize = () => {
  const viewerCanvas = document.createElement('div');
  viewerCanvas.id = 'viewerCanvas';
  const bodyForViewer = document.querySelector('body');
  bodyForViewer.appendChild(viewerCanvas);
  viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
};

google.books.setOnLoadCallback(initialize);

const bookNotLoaded = () => {
  const trialWarningMsg = document.querySelector('.warningMsg');
  if (trialWarningMsg === null) {
    const fillMsg = document.createElement('div');
    fillMsg.className = 'warningMsg';
    const fillTextMsg = document.createTextNode('Unable to load viewer');
    fillMsg.appendChild(fillTextMsg);
    const contentModal = document.querySelector('.msg-banner');
    contentModal.appendChild(fillMsg);
  }
};
  
  const bookLoaded = () => {
  wasCalled = true;
  const warningMsg = document.querySelector('.warningMsg');
  if (warningMsg !== null) {
      warningMsg.parentNode.removeChild(warningMsg);
    }
  const viewerCanvas = document.getElementById('viewerCanvas');
  viewerCanvas.style.display = 'block';
  overlay.classList.add('active');
  };

const loadPage = async isbn => {
  try {
    wasCalled = false;
    // The second parameter viewer.load() will be activated only if the book is not found using the isbn number.
    // If it is found but fails to load the viewer, bookNotLoaded will not be activated.
    await viewer.load('ISBN:' + isbn, bookNotLoaded, bookLoaded);
    await new Promise(r => setTimeout(r, 1500));
    if(!wasCalled) bookNotLoaded();
  } catch(e) {
    console.log(e);
    bookNotLoaded();
  }
};

readBtns.forEach(btn => {
  btn.addEventListener('click', event => {
    let title = event.path[2].querySelector('.title-ex').textContent;
    // Pass the link to the Google Books API with a key replacing MY_KEY
    let gbUri = 'https://www.googleapis.com/books/v1/volumes?key=MY_KEY&cx=017576662512468239146:omuauf_lfve&q=' + title;
    fetch(gbUri).then(response => response.json()).then(response => {
      // Browse through various types of book identifiers for 'ISBN_13' or 'ISBN_10' in order to load the viewer.
      let isbn, idType;
      for (let i = 0; i < response.items.length; i++) {
        idType = response.items[i].volumeInfo.industryIdentifiers[0].type;
        if (idType === 'ISBN_13' || idType === 'ISBN_10'){
          isbn = response.items[i].volumeInfo.industryIdentifiers[0].identifier;
          break;
        }
      }
      loadPage(isbn);
    });
  });
});

// Opening and closing the overlay
overlay.addEventListener('click', () => {
  const viewerCanvas = document.getElementById('viewerCanvas');
  viewerCanvas.style.display = 'none';
  overlay.classList.remove('active');
});