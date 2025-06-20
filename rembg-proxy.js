const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');

const router = express.Router();
const upload = multer();

router.post('/api/remove-bg', upload.single('file'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch('https://YOUR-REMBG-API.onrender.com/remove-bg', {
      method: 'POST',
      body: form,
    });

    const result = await response.buffer();
    res.set('Content-Type', 'image/png');
    res.send(result);
  } catch (err) {
    console.error('rembg error:', err);
    res.status(500).send('Background removal failed.');
  }
});

module.exports = router;
