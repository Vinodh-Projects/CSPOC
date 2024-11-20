const fs = require('fs');
const axios = require('axios');
const xlsx = require('xlsx');
require('dotenv').config();

const CONTENTSTACK_BASE_URL = process.env.CONTENTSTACK_BASE_URL;
const CONTENTSTACK_API_KEY = process.env.CONTENTSTACK_API_KEY;
const CONTENTSTACK_AUTH_TOKEN = process.env.CONTENTSTACK_AUTH_TOKEN;
const CONTENTSTACK_CONTENT_TYPE_UID = process.env.CONTENTSTACK_CONTENT_TYPE_UID;

// Function to read Excel and create entries in Contentstack
async function uploadFileHandler(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  const results = [];
  for (let row of data) {
    const entry = {
      entry: {
        plucode: row.Plucode,
        pluname: row.Pluname,
        desc: row.Desc,
        price: row.Price,
      },
    };

    try {
      const response = await axios.post(
        `${CONTENTSTACK_BASE_URL}/content_types/${CONTENTSTACK_CONTENT_TYPE_UID}/entries`,
        entry,
        {
          headers: {
            api_key: CONTENTSTACK_API_KEY,
            authorization: CONTENTSTACK_AUTH_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      );
      results.push(response.data);
    } catch (error) {
      console.error(`Error creating entry for ${row.Pluname}:`, error.message);
    }
  }

  fs.unlinkSync(filePath); // Delete file after processing
  return results;
}

module.exports = uploadFileHandler;
