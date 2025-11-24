import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Map({ location, coordinates }) {
      // Default to some coordinates if not provided (e.g., India center)
      const position = coordinates && coordinates.length === 2 ? [coordinates[1], coordinates[0]] : [20.5937, 78.9629];

      return (
            <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg z-0">
                  <MapContainer center={position} zoom={9} scrollWheelZoom={false} className="h-full w-full">
                        <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                              <Popup>
                                    {location}
                              </Popup>
                        </Marker>
                  </MapContainer>
            </div>
      );
}

export default Map;
