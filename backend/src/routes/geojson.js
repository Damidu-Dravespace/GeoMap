
const express = require('express');
const router = express.Router();
const geojsonController = require('../controllers/geojsonController');

router.post('/save-geojson', geojsonController.saveGeoJSON);

module.exports = router;
