const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');

const router = express.Router();
const upload = multer();

router.post('/api/remove-bg', upload.single('file'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch('https://rembg-api.onrender.com/remove-bg', {
      method: 'POST',
      body: formData,
    });

    const blob = await response.buffer();
    res.set('Content-Type', 'image/png');
    res.send(blob);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).send('Failed to remove background.');
  }
});

module.exports = router;
