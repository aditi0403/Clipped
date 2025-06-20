const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const upload = multer();
const app = express();

app.use(express.static('public'));

app.post('/api/remove-bg', upload.single('file'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('data', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch('https://hf.space/embed/akhaliq/U-2-Net/api/predict/', {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    res.send(result);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Failed to fetch background removal");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
