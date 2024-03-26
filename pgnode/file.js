const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());

app.get('/download', (req, res) => {
  // Example to send a file located in a directory named 'public'
  const filePath = path.join(__dirname,  'test.txt');
  res.download(filePath); // Set the correct path and filename
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
