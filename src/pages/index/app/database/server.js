const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3001;

app.get('/LSOAR.json', async (req, res) => {
  res.sendFile(path.join(__dirname, 'LSOAR.json'));
});

app.get('/:directory/:filename', async (req, res) => {
  try {
    const directoryPath = path.join(__dirname, req.params.directory);
    const filePath = path.join(directoryPath, req.params.filename);

    if (filePath.endsWith('.json')) {
      const content = await fs.readFile(filePath, 'utf8');
      try {
        const article = JSON.parse(content);
        res.json(article);
      } catch (error) {
        console.error(`Error parsing ${req.params.filename}: ${error}`);
        res.status(500).send('Error in parsing JSON file');
      }
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    res.status(500).send('Error in fetching file');
  }
});




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
