import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Navigation, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 200px)',
  borderRadius: '1.5rem',
};

const center = {
  lat: 28.6139,
  lng: 77.2090, // Default to New Delhi
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b9" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
};

const LiveTracking = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const { list: drivers } = useSelector((state) => state.drivers);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const onlineDrivers = drivers.filter(d => d.status === 'online' && d.location);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Live Tracking</h2>
          <p className="text-slate-400">Monitor active vehicles and drivers in real-time.</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="status-online"></div>
            <span className="text-sm font-medium text-slate-300">{onlineDrivers.length} Online Drivers</span>
          </div>
        </div>
      </header>

      <div className="relative glass-panel overflow-hidden border-slate-800 shadow-2xl">
        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center h-[600px] bg-slate-900/50">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Initializing Map System...</p>
          </div>
        ) : (
          <>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={mapOptions}
            >
              {onlineDrivers.map((driver) => (
                <Marker
                  key={driver._id}
                  position={{
                    lat: driver.location.latitude,
                    lng: driver.location.longitude
                  }}
                  icon={{
                    path: "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
                    fillColor: "#3b82f6",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                    scale: 1.5,
                    anchor: new window.google.maps.Point(12, 12),
                  }}
                  onClick={() => setSelectedDriver(driver)}
                />
              ))}

              {selectedDriver && (
                <InfoWindow
                  position={{
                    lat: selectedDriver.location.latitude,
                    lng: selectedDriver.location.longitude
                  }}
                  onCloseClick={() => setSelectedDriver(null)}
                >
                  <div className="p-2 text-slate-900">
                    <h4 className="font-bold text-sm">{selectedDriver.name}</h4>
                    <p className="text-xs">{selectedDriver.phone}</p>
                    <p className="text-[10px] mt-1 text-slate-500">Last updated: Just now</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>

            {/* Floating Driver Panel */}
            <div className="absolute top-4 right-4 w-72 max-h-[80%] overflow-auto">
              <div className="space-y-3">
                {onlineDrivers.map(driver => (
                  <motion.div 
                    key={driver._id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedDriver?._id === driver._id 
                        ? 'bg-primary border-primary shadow-lg shadow-primary/20' 
                        : 'bg-slate-900/80 backdrop-blur-md border-slate-800'
                    }`}
                    onClick={() => {
                      setSelectedDriver(driver);
                      map?.panTo({
                        lat: driver.location.latitude,
                        lng: driver.location.longitude
                      });
                      map?.setZoom(15);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        selectedDriver?._id === driver._id ? 'bg-white text-primary' : 'bg-slate-800 text-white'
                      }`}>
                        {driver.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${
                          selectedDriver?._id === driver._id ? 'text-white' : 'text-slate-200'
                        }`}>
                          {driver.name}
                        </p>
                        <p className={`text-[10px] ${
                          selectedDriver?._id === driver._id ? 'text-white/70' : 'text-slate-500'
                        }`}>
                          {driver.vehicleType || 'Standard'}
                        </p>
                      </div>
                      <Navigation size={14} className={selectedDriver?._id === driver._id ? 'text-white' : 'text-primary'} />
                    </div>
                  </motion.div>
                ))}
                {onlineDrivers.length === 0 && (
                  <div className="p-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl text-center">
                    <p className="text-sm text-slate-400">No online drivers</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveTracking;
