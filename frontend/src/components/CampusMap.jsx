import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { CheckCircle2, AlertTriangle, XCircle, Map, Layers } from 'lucide-react';

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

  // Optional custom API token for Mapbox / Google Maps if provided in .env
  const customMapKey = import.meta.env.VITE_MAP_API_KEY || import.meta.env.VITE_MAPBOX_TOKEN;

  return (
    <div className="w-full h-[480px] rounded-3xl overflow-hidden border border-slate-800 relative shadow-2xl space-y-2">
      
      {/* Map API Status Header */}
      <div className="absolute top-3 left-3 z-[1000] glass-panel px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] font-bold text-slate-200 flex items-center gap-2 shadow-lg">
        <Map className="w-3.5 h-3.5 text-eco-400" />
        <span>Map Provider: {customMapKey ? 'Custom Map API Active' : 'OpenStreetMap Pune (Zero-Config)'}</span>
        {customMapKey && <span className="w-2 h-2 rounded-full bg-eco-400 animate-pulse" />}
      </div>

      <MapContainer
        center={puneCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <LayersControl position="topright">
          
          {/* Default CartoDB Voyager Streets */}
          <BaseLayer checked name="Pune Streets (Voyager)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
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
          <BaseLayer name="Satellite Hybrid View">
            <TileLayer
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
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
