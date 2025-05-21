// scripts/init-contentstack.js
const axios = require('axios');
require('dotenv').config( { path: '.env.local' } );
console.log("✅ Loaded env:");
console.log("CS_API_KEY =", process.env.CS_API_KEY);
console.log("CS_MANAGEMENT_TOKEN =", process.env.CS_MANAGEMENT_TOKEN ? 'Present' : 'Missing');
console.log("CS_REGION =", process.env.CS_REGION);

const API_KEY = process.env.CS_API_KEY;
const MGMT_TOKEN = process.env.CS_MANAGEMENT_TOKEN;
const REGION = process.env.CS_REGION || 'us';

const BASE_URL = {
  us: 'https://api.contentstack.io',
  eu: 'https://eu-api.contentstack.com',
  azure: 'https://azure-api.contentstack.com',
}[REGION];

const headers = {
  api_key: API_KEY,
  authorization: MGMT_TOKEN,
  'Content-Type': 'application/json',
};

async function createContentType() {
  const url = `${BASE_URL}/v3/content_types`;
  const data = {
    content_type: {
      title: "Test Page",
      uid: "test_page",
      schema: [
        {
          display_name: "Title",
          uid: "title",
          data_type: "text",
          field_metadata: {
            _default: true,
            mandatory: true
          }
        },
        {
          display_name: "Body",
          uid: "body",
          data_type: "text",
        }
      ]
    }
  };

  try {
    const res = await axios.post(url, data, { headers });
    console.log("✅ Created content type:", res.data.content_type.uid);
  } catch (err) {
    console.error("❌ Error creating content type:", err.response?.data || err.message);
  }
}

async function createEntry() {
  const url = `${BASE_URL}/v3/content_types/test_page/entries`;
  const data = {
    entry: {
      title: "Welcome to Launch!",
      body: "This content was created at build time."
    }
  };

  try {
    const res = await axios.post(url, data, { headers });
    console.log("✅ Created entry:", res.data.entry.uid);
  } catch (err) {
    console.error("❌ Error creating entry:", err.response?.data || err.message);
  }
}

async function run() {
  await createContentType();
  await createEntry();
}

run();
