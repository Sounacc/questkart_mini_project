const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  console.log('File uploaded successfully');
  res.send('File uploaded successfully');
});

// Serve static files from the 'uploads' directory
app.use('/file', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
