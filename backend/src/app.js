const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/images/');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS, PUT'
  );
  res.setHeader('Access-Control-Allow-Headers', ' Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    'mongodb+srv://hyouka:leaf2201@cluster0.umlap.mongodb.net/messages?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(8080, () => {
      console.log('Server is running on port 8080');
    });
  })
  .catch((err) => {
    console.log(err);
  });
