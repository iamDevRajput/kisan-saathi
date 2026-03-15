import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix default marker icon (Leaflet webpack issue)
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

// Custom colored icons
const createIcon = (color, size = 32) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="${size}" height="${Math.round(size*4/3)}">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20S24 21 24 12C24 5.4 18.6 0 12 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>`
  return L.divIcon({
    html:      `<div style="display:inline-flex">${svg}</div>`,
    className: '',
    iconSize:  [size, Math.round(size * 4 / 3)],
    iconAnchor:[size / 2, Math.round(size * 4 / 3)],
    popupAnchor:[0, -Math.round(size * 4 / 3)],
  })
}

const greenIcon  = createIcon('#1B5E20')
const goldIcon   = createIcon('#F59E0B', 36)
const blueIcon   = createIcon('#1E40AF')

function RecenterMap({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.setView(center, map.getZoom())
  }, [center])
  return null
}

export default function MandiMap({ mandis = [], userLocation, commodity, onMandiClick }) {
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [28.9845, 77.7064] // default: Meerut

  return (
    <MapContainer
      center={center}
      zoom={9}
      style={{ width: '100%', height: '100%', minHeight: 460 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap center={center} />

      {/* User location */}
      {userLocation && (
        <>
          <Marker position={[userLocation.lat, userLocation.lng]} icon={blueIcon}>
            <Popup>📍 आपकी लोकेशन</Popup>
          </Marker>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={50000}
            pathOptions={{ color: '#1B5E20', fillColor: '#1B5E20', fillOpacity: 0.04, weight: 1.5, dashArray: '6' }}
          />
        </>
      )}

      {/* Mandi markers */}
      {mandis.map(m => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={m.isBestPrice ? goldIcon : greenIcon}
          eventHandlers={{ click: () => onMandiClick?.(m) }}
        >
          <Popup>
            <div className="min-w-[180px]">
              <div className="font-bold text-sm text-gray-900 mb-1">
                {m.isBestPrice ? '🏆 ' : ''}{m.nameHindi}
              </div>
              <div className="text-xs text-gray-500 mb-2">{m.distance} km · {m.driveTime}</div>
              {m.todayPrice && (
                <div className="text-base font-bold text-[#1B5E20] mb-1">
                  ₹{m.todayPrice?.toLocaleString('en-IN')}/क्विंटल
                </div>
              )}
              {m.arrivals > 0 && (
                <div className="text-xs text-gray-500 mb-2">आवक: {m.arrivals} क्विंटल</div>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
                target="_blank" rel="noreferrer"
                className="inline-block w-full text-center py-1.5 bg-[#1B5E20] text-white text-xs rounded-lg font-semibold no-underline hover:bg-[#2E7D32]"
              >
                📍 रास्ता देखें
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
