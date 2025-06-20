const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { execFile } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

app.post('/api/remove-bg', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = `${inputPath}_output.png`;

    // Call the rembg CLI using child_process
    execFile('rembg', ['i', inputPath, outputPath], (error) => {
      if (error) {
        console.error('rembg error:', error);
        return res.status(500).send('Background removal failed.');
      }

      // Send the processed image back
      res.sendFile(path.resolve(outputPath), () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    });
  } catch (err) {
    console.error('Error removing background:', err);
    res.status(500).send('Error processing image');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
