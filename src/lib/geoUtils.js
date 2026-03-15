// Haversine distance formula — exact GPS distance between two points
export function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // distance in km
}

// Driving time estimate on rural roads (~40 km/h avg)
export function getDriveTime(distanceKm) {
  if (!distanceKm || distanceKm <= 0) return '—'
  const minutes = Math.round((distanceKm / 40) * 60)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rem   = minutes % 60
  return rem > 0 ? `${hours}h ${rem}m` : `${hours} hr`
}

// Find the mandi with the best price for a commodity
export function getBestMandi(mandis, commodity) {
  if (!mandis || mandis.length === 0) return null
  return mandis.reduce((best, m) => {
    const mPrice    = m.todayPrice || 0
    const bestPrice = best.todayPrice || 0
    return mPrice > bestPrice ? m : best
  })
}

// Check if a mandi is currently open
export function isMandiOpen(openTime) {
  const now   = new Date()
  const hour  = now.getHours()
  // Default mandi hours: 6 AM - 2 PM
  return hour >= 6 && hour < 14
}

// Sort mandis: by price desc if commodity selected, else by distance asc
export function sortMandis(mandis, sortBy = 'distance') {
  return [...mandis].sort((a, b) => {
    if (sortBy === 'price')    return (b.todayPrice || 0)  - (a.todayPrice || 0)
    if (sortBy === 'arrivals') return (b.arrivals || 0)    - (a.arrivals || 0)
    return (a.distance || 0) - (b.distance || 0) // default: closest first
  })
}

// Format price with Indian number formatting
export function formatPrice(price) {
  if (!price) return '—'
  return `₹${price.toLocaleString('en-IN')}`
}

// Calculate "you save X vs nearest mandi" text
export function savingsVsNearest(bestPrice, nearestPrice) {
  if (!bestPrice || !nearestPrice || bestPrice <= nearestPrice) return null
  const diff = bestPrice - nearestPrice
  return `₹${Math.round(diff).toLocaleString('en-IN')} ज़्यादा मिलेगा`
}
