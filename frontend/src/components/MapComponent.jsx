// src/components/Map.js
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Polyline, useMapEvents, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EventHandler = ({ addType, markers, setMarkers, polygons, setPolygons, polylines, setPolylines, currentPolygon, setCurrentPolygon, currentPolyline, setCurrentPolyline, sendDataToServer }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (addType === 'marker') {
        setMarkers([...markers, [lat, lng]]);
        sendDataToServer({ type: 'Point', coordinates: [lat, lng] });
      } else if (addType === 'polygon') {
        setCurrentPolygon([...currentPolygon, [lat, lng]]);
      } else if (addType === 'polyline') {
        setCurrentPolyline([...currentPolyline, [lat, lng]]);
      }
    },
    contextmenu() {
      if (addType === 'polygon' && currentPolygon.length > 0) {
        setPolygons([...polygons, currentPolygon]);
        sendDataToServer({ type: 'Polygon', coordinates: [currentPolygon] });
        setCurrentPolygon([]);
      } else if (addType === 'polyline' && currentPolyline.length > 0) {
        setPolylines([...polylines, currentPolyline]);
        sendDataToServer({ type: 'LineString', coordinates: currentPolyline });
        setCurrentPolyline([]);
      }
    }
  });
  return null;
};

const MapComponent = () => {
  const [addType, setAddType] = useState('marker');
  const [markers, setMarkers] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [polylines, setPolylines] = useState([]);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [currentPolyline, setCurrentPolyline] = useState([]);

  const sendDataToServer = (geojson) => {
    axios.post('http://localhost:5173/api/save-geojson', geojson)
      .then(response => console.log(response.data))
      .catch(error => console.error('There was an error send data to database!', error));
  };

  return (
    <div>
      <div style={{ position: 'absolute', top: 20, left: 60, zIndex: 1000 }}>
        <select onChange={(e) => setAddType(e.target.value)} value={addType}>
          <option value="marker">Marker</option>
          <option value="polygon">Polygon</option>
          <option value="polyline">Polyline</option>
        </select>
      </div>
      <div style={{ position: 'absolute', top: 20, left: 150, height:40,alignContent:'center',zIndex: 1000, backgroundColor: 'white', padding: '2px', borderRadius: '10px' }}>
        <p><strong>Selected Tool:</strong> {addType.charAt(0).toUpperCase() + addType.slice(1)}</p>
      </div>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <EventHandler
          addType={addType}
          markers={markers}
          setMarkers={setMarkers}
          polygons={polygons}
          setPolygons={setPolygons}
          polylines={polylines}
          setPolylines={setPolylines}
          currentPolygon={currentPolygon}
          setCurrentPolygon={setCurrentPolygon}
          currentPolyline={currentPolyline}
          setCurrentPolyline={setCurrentPolyline}
          sendDataToServer={sendDataToServer}
        />
        {markers.map((position, idx) => (
          <Marker key={`marker-${idx}`} position={position}>
            <Tooltip>{`Marker ${idx + 1}`}</Tooltip>
          </Marker>
        ))}
        {polygons.map((polygon, idx) => (
          <Polygon key={`polygon-${idx}`} positions={polygon}>
            <Tooltip>{`Polygon ${idx + 1}`}</Tooltip>
          </Polygon>
        ))}
        {polylines.map((polyline, idx) => (
          <Polyline key={`polyline-${idx}`} positions={polyline}>
            <Tooltip>{`Polyline ${idx + 1}`}</Tooltip>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
