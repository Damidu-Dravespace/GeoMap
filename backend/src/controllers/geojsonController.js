
const pool = require('../config/db');

const saveGeoJSON = async (req, res) => {
  const geojson = req.body;

  try {
    let query = '';
    let values = [];

    if (geojson.type === 'Point') {
      query = 'INSERT INTO geodata (geom) VALUES (ST_SetSRID(ST_GeomFromGeoJSON($1), 4326)) RETURNING *';
      values = [JSON.stringify(geojson)];
    } else if (geojson.type === 'Polygon' || geojson.type === 'LineString') {
      query = 'INSERT INTO geodata (geom) VALUES (ST_SetSRID(ST_GeomFromGeoJSON($1), 4326)) RETURNING *';
      values = [JSON.stringify(geojson)];
    } else {
      return res.status(400).send({ error: 'Invalid GeoJSON type' });
    }

    const result = await pool.query(query, values);
    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Database error' });
  }
};

module.exports = {
  saveGeoJSON,
};
