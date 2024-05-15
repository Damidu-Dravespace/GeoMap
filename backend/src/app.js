const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const geojsonRoutes = require('./routes/geojson');
const postgres = require('postgres');


dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

// Routes
app.use('/api', geojsonRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


module.exports = app;
