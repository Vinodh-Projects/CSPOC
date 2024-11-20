const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const uploadFileHandler = require('./upload');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    const result = await uploadFileHandler(req.file.path);
    res.json({ message: 'Entries created successfully!', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating entries in Contentstack.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
