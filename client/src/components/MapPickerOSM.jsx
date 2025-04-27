import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, onPositionChange }) => {
  const [markerPosition, setMarkerPosition] = useState(position);
  
  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setMarkerPosition(newPos);
      onPositionChange(newPos);
    },
  });

  return markerPosition ? <Marker position={markerPosition} /> : null;
};

const MapPickerOSM = ({ 
  defaultCenter = { lat: 20.5937, lng: 78.9629 }, 
  defaultZoom = 5, 
  onLocationChange, 
  height = "400px" 
}) => {
  const [position, setPosition] = useState([defaultCenter.lat, defaultCenter.lng]);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePositionChange = async (newPosition) => {
    setPosition(newPosition);
    setIsLoading(true);
    
    try {
      // Use Nominatim API for reverse geocoding (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition[0]}&lon=${newPosition[1]}&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        const formattedAddress = data.display_name || "Unknown location";
        setAddress(formattedAddress);
        
        // Call the parent callback with location data
        if (onLocationChange) {
          onLocationChange({
            lat: newPosition[0],
            lng: newPosition[1],
            address: formattedAddress
          });
        }
      } else {
        // Fallback if API fails
        setAddress("Location selected");
        if (onLocationChange) {
          onLocationChange({
            lat: newPosition[0],
            lng: newPosition[1],
            address: "Location selected"
          });
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Location selected");
      if (onLocationChange) {
        onLocationChange({
          lat: newPosition[0],
          lng: newPosition[1],
          address: "Location selected"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const location = data[0];
          const newPos = [parseFloat(location.lat), parseFloat(location.lon)];
          setPosition(newPos);
          setAddress(location.display_name || searchQuery);
          
          if (onLocationChange) {
            onLocationChange({
              lat: newPos[0],
              lng: newPos[1],
              address: location.display_name || searchQuery
            });
          }
        }
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search for a location..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e.target.value);
              }
            }}
          />
          <button
            onClick={(e) => handleSearch(e.target.previousSibling.value)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
      
      <div 
        className="relative border border-gray-300 rounded-lg overflow-hidden"
        style={{ height }}
      >
        <MapContainer
          center={position}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            onPositionChange={handlePositionChange}
          />
        </MapContainer>
        
        {isLoading && (
          <div className="absolute top-2 left-2 bg-white bg-opacity-90 p-2 rounded shadow">
            <div className="text-sm">Loading location data...</div>
          </div>
        )}
        
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 p-2 rounded shadow max-w-xs">
          <div className="text-xs text-gray-600 mb-1">Click on the map to select location</div>
          {address && (
            <div className="text-sm font-medium text-gray-800 truncate">
              {address}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPickerOSM;