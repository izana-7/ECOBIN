import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { CheckCircle2, AlertTriangle, XCircle, Map } from 'lucide-react';

const { BaseLayer } = LayersControl;

// Custom Marker Icons for Leaflet Bins
const createBinIcon = (status) => {
  let color = '#10b981'; // Green (Available)
  if (status === 'Nearly Full') color = '#f59e0b'; // Amber
  if (status === 'Full') color = '#ef4444'; // Red

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <circle cx="12" cy="12" r="11" fill="#0f172a" stroke="${color}" stroke-width="2.5"/>
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-bin-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

export default function CampusMap({ bins = [], selectedBin = null, onSelectBin }) {
  // Center map on Pune City, Maharashtra (COEP / Shivajinagar Area)
  const puneCenter = [18.5204, 73.8567];

  // Optional custom map provider keys/tokens (if provided in .env)
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const customMapKey = import.meta.env.VITE_MAP_API_KEY || import.meta.env.VITE_MAPBOX_TOKEN;
  const providerLabel = googleMapsApiKey
    ? 'Google Maps (API Key Configured) + OSM/Esri'
    : customMapKey
      ? 'Custom Map Token + Google/OSM/Esri Layers'
      : 'Google Maps + OpenStreetMap + Esri (Zero-Config)';

  return (
    <div className="w-full h-[480px] rounded-3xl overflow-hidden border border-slate-800 relative shadow-2xl space-y-2">
      
      {/* Map Provider Status Header */}
      <div className="absolute top-3 left-3 z-[1000] glass-panel px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] font-bold text-slate-200 flex items-center gap-2 shadow-lg max-w-[85%]">
        <Map className="w-3.5 h-3.5 text-eco-400 shrink-0" />
        <span className="truncate">Map Providers: {providerLabel}</span>
        {(googleMapsApiKey || customMapKey) && <span className="w-2 h-2 rounded-full bg-eco-400 animate-pulse shrink-0" />}
      </div>

      <MapContainer
        center={puneCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <LayersControl position="topright">
          
          {/* OpenStreetMap-based streets (default) */}
          <BaseLayer checked name="Pune Streets (OpenStreetMap)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          <BaseLayer name="Pune Streets (Voyager)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </BaseLayer>

          {/* Google Maps layers (tile-based views, no API key required) */}
          <BaseLayer name="Google Maps (Streets)">
            <TileLayer
              attribution='Map data &copy; Google'
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </BaseLayer>

          <BaseLayer name="Google Maps (Satellite)">
            <TileLayer
              attribution='Imagery &copy; Google'
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </BaseLayer>

          <BaseLayer name="Google Maps (Hybrid)">
            <TileLayer
              attribution='Imagery &copy; Google'
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </BaseLayer>

          <BaseLayer name="Google Maps (Terrain)">
            <TileLayer
              attribution='Map data &copy; Google'
              url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </BaseLayer>

          {/* Dark Mode Map */}
          <BaseLayer name="Dark Eco Map">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </BaseLayer>

          {/* Satellite Hybrid Layer */}
          <BaseLayer name="Esri Satellite (Hybrid)">
            <TileLayer
              attribution='Tiles &copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>

        </LayersControl>

        {bins.map((bin) => {
          const lat = bin.latitude || 18.5204;
          const lng = bin.longitude || 73.8567;
          const icon = createBinIcon(bin.status);

          return (
            <Marker
              key={bin._id || bin.binId}
              position={[lat, lng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectBin && onSelectBin(bin)
              }}
            >
              <Popup>
                <div className="p-1.5 min-w-[220px]">
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-700">
                    <span className="font-extrabold text-sm text-white">{bin.binId}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      bin.status === 'Available' ? 'bg-eco-500/20 text-eco-400 border border-eco-500/30' :
                      bin.status === 'Nearly Full' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {bin.status === 'Available' && <CheckCircle2 className="w-3 h-3 inline" />}
                      {bin.status === 'Nearly Full' && <AlertTriangle className="w-3 h-3 inline" />}
                      {bin.status === 'Full' && <XCircle className="w-3 h-3 inline" />}
                      {bin.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200 mb-2">{bin.location}</p>

                  <div className="mb-2">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Fill Level</span>
                      <span className="font-bold text-white">{bin.fillLevel}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          bin.fillLevel >= 90 ? 'bg-rose-500' :
                          bin.fillLevel >= 65 ? 'bg-amber-500' : 'bg-eco-500'
                        }`}
                        style={{ width: `${bin.fillLevel}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <span className="text-[10px] text-slate-400 block mb-1">Accepted Waste:</span>
                    <div className="flex flex-wrap gap-1">
                      {bin.acceptedWasteTypes?.map((t, idx) => (
                        <span key={idx} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
