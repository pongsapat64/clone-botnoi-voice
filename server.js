const express = require('express');
    const request = require('request');
    const bodyParser = require('body-parser');
    const path = require('path');
    require('dotenv').config({ path: path.join(__dirname, '.env.local') });
    const app = express();
    const port = 3000;
    
    app.use(bodyParser.json());
    app.use(express.static(__dirname));
    
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'index.html'));
    });
    
    app.post('/generate', (req, res) => {
      const { text, speaker, volume } = req.body;
      const options = {
        'method': 'POST',
        'url' : "https://api-voice.botnoi.ai/openapi/v1/generate_audio",
        body: JSON.stringify({
          "text": text,
          "speaker": speaker,
          "volume": volume,
          "speed": 1,
          "type_media":"m4a",
          "save_file": "true",
          "language": "th"
        }),
        headers : {
          'Botnoi-Token': process.env.BOTNOI_TOKEN,
          'Content-Type': 'application/json'
        }
      };
    
      request(options, function (error, response) {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Failed to generate audio' });
        }
        try {
          const responseBody = JSON.parse(response.body);
          if (responseBody && responseBody.audio_url) {
            res.json({ audioUrl: responseBody.audio_url });
          } else {
             res.status(500).json({ error: 'Invalid response from API' });
          }
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          res.status(500).json({ error: 'Error parsing API response' });
        }
      });
    });
    
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
