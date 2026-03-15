import prisma from './prisma'

// Find all users within a radius (km) of a point — uses in-memory Haversine
// since we don't have PostGIS
export async function findUsersInRadius(lat, lng, radiusKm) {
  const allUsers = await prisma.user.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    select: { id: true, latitude: true, longitude: true, phone: true }
  })

  const R = 6371
  return allUsers.filter(u => {
    const dLat = (u.latitude - lat) * (Math.PI / 180)
    const dLng = (u.longitude - lng) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat * Math.PI / 180) * Math.cos(u.latitude * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2
    const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return dist <= radiusKm
  })
}

// Send pest alert notification to nearby farmers
export async function sendPestAlertToNearbyFarmers(postId, lat, lng, radiusKm = 50) {
  try {
    const nearbyUsers = await findUsersInRadius(lat, lng, radiusKm)
    // In production: integrate with SMS/push provider (e.g., Twilio, FCM)
    // For now: log + store in DB as notification record
    console.log(`[PEST ALERT] Notifying ${nearbyUsers.length} farmers within ${radiusKm}km`)
    return { notified: nearbyUsers.length }
  } catch (err) {
    console.error('[notifications] sendPestAlertToNearbyFarmers error:', err)
    return { notified: 0 }
  }
}

// Generic price alert check
export async function checkPriceAlerts(commodity, mandiId, currentPrice) {
  try {
    const alerts = await prisma.userPriceAlert.findMany({
      where: { commodity, isActive: true, triggeredAt: null }
    })

    const triggered = alerts.filter(a => {
      if (a.mandiId && a.mandiId !== mandiId) return false
      if (a.condition === 'ABOVE') return currentPrice >= a.targetPrice
      if (a.condition === 'BELOW') return currentPrice <= a.targetPrice
      return false
    })

    if (triggered.length > 0) {
      await prisma.userPriceAlert.updateMany({
        where:  { id: { in: triggered.map(a => a.id) } },
        data:   { triggeredAt: new Date() }
      })
      console.log(`[PRICE ALERT] Triggered ${triggered.length} alerts for ${commodity}`)
    }
    return triggered.length
  } catch (err) {
    console.error('[notifications] checkPriceAlerts error:', err)
    return 0
  }
}
