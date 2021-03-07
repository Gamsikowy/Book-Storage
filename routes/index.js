const express = require('express')
const router = express.Router()
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
// const crypto = require('crypto');
const multer = require('multer');
const Book = require('../models/book');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];
const uploadPath = path.join('public', Book.coverImageBasePath);
const ObjectId = require('mongodb').ObjectID;

// Setting mongoose
const db = mongoose.connection;
mongoose.set('useFindAndModify', false);

// Docs counting variables and confirm mes
let docsQuantity, docsNewQuantity, conf;

// Setting multer
const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
  storage: storage,
  // limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    cb(null, imageMimeTypes.includes(file.mimetype))
  }
});

// Loads index
router.get('/', (req, res) => res.render('index'));

// Loads add
router.get('/add', (req, res) => res.render('add'));

// Redirect add
router.post('/add', (req, res) => res.redirect('add'));

// Loads imgs with desc
router.get('/library', (req, res) => {
  let cursor = db.collection('covers').find({});

  cursor.toArray( async (err, books) => {
    if (!books || books.length === 0) {
      res.render('add', { msg: 'There is no books in library' });
    } else {
      conf = '';
      docsNewQuantity = await db.collection('covers').estimatedDocumentCount();
  
      if (docsNewQuantity > docsQuantity) conf = 'Book has been added correctly';
      res.render('library', { books: books, conf: conf });
    }
  });
});

// Uploads img
router.post('/library', upload.single('myCover'), async (req, res) => {
  let coverName;

   if (!req.file) {
      if (req.body.hiddenImgInput) {
        coverName = req.body.hiddenImgInput;
      } else {
      res.render('add', { msg: 'You have to load the cover' });
      }
    } else {
      coverName = req.file.filename;
    }
  if (!req.body.title) {
    res.render('add', { msg: 'You have to fill the cover' });
  } else if (!req.body.author) {
    res.render('add', { msg: 'You forgot to provide the author of the book' });
  } else if (!req.body.numberOfPages) {
    res.render('add', { msg: 'You forgot to enter the number of pages of the book' });
  } else if (!req.body.rate) {
    res.render('add', { msg: 'You forgot to rate the books' });
  }

  docsQuantity = await db.collection('covers').estimatedDocumentCount();

  // An alternative way of encrypting file names
  // const fileName = await new Promise((resolve, reject) => {
  //   crypto.randomBytes(16, (err, buf) => {
  //       if (err) console.log(err);
  //       resolve(buf.toString('hex') + path.extname(req.file.originalname));
  //   });
  // });

    const book = new Book({
      title: req.body.title,
      subtitle: req.body.subtitle,
      authorDetails: req.body.author,
      genreOfBook: req.body.genre,
      numberOfPages: req.body.numberOfPages,
      rate: req.body.rate,
      coverImageName: coverName
    });

    db.collection('covers').insertOne(book, (err, response) => {
        if (err) { 
          console.log(err);
          res.redirect('add', { msg: 'An error occurred while trying to save data to the database.' }); 
        } else {
          res.redirect('library');
        }
      });
});

// Sorting management
router.post('/sort', (req, res) => {
  let cursor = db.collection('covers').find({});

  if (req.body.sort === 'page-up'){
    cursor.sort({ numberOfPages: -1 }).toArray((err, books) => {
        if (!books || books.length === 0) {
          res.render('add', { msg: 'There is no books in library' });
        } else {
          res.render('library', { books: books, conf: conf });
        }
      });
  } else if (req.body.sort === 'page-down') {
    cursor.sort({ numberOfPages: 1 }).toArray((err, books) => {
        if (!books || books.length === 0) {
          res.render('add', { msg: 'There is no books in library' });
        } else {
          res.render('library', { books: books, conf: conf });
        }
      });
  } else if (req.body.sort === 'rate-up') {
    cursor.sort({ rate: -1 }).toArray((err, books) => {
        if (!books || books.length === 0) {
          res.render('add', { msg: 'There is no books in library' });
        } else {
          res.render('library', { books: books, conf: conf });
        }
      });
  } else if (req.body.sort === 'rate-down') {
    cursor.sort({ rate: 1 }).toArray((err, books) => {
        if (!books || books.length === 0) {
          res.render('add', { msg: 'There is no books in library' });
        } else {
          res.render('library', { books: books, conf: conf });
        }
      });
  }
});

// Delete doc
router.delete('/delete/:id', async (req, res) => {
  const bookToRemoveId = mongoose.Types.ObjectId(req.params.id);

  db.collection('covers').findOne({ _id: bookToRemoveId }, (err, doc) => {
    const docCovImgName = doc.coverImageName;
    db.collection('covers').deleteOne({ _id: doc._id }, error => {
      if (error) return console.log(error);
      fs.unlink(path.join('public/uploads/bookCovers/', docCovImgName), er => {
        if (er) console.log(er);
    });
    res.redirect('/library');
    });
  });
});

module.exports = router;
