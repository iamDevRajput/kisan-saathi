// pages/api/experts/available-slots.js
import prisma from '../../../src/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { expertId, date } = req.query;

    if (!expertId || !date) {
      return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    const expert = await prisma.expert.findUnique({
      where: { id: expertId },
      select: { availability: true }
    });

    if (!expert) return res.status(404).json({ success: false, message: 'Expert not found' });

    // Assuming date is 'YYYY-MM-DD'
    const dateObj = new Date(date);
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dateObj.getDay()];

    const daySlots = expert.availability[dayName] || [];

    // Find booked slots for this date
    const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));

    const bookedSlots = await prisma.expertBooking.findMany({
      where: {
        expertId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: { notIn: ['CANCELLED'] }
      },
      select: { timeSlot: true }
    });

    const bookedTimeSlots = bookedSlots.map(b => b.timeSlot);
    const availableSlots = daySlots.filter(slot => !bookedTimeSlots.includes(slot));

    return res.status(200).json({ success: true, data: availableSlots });

  } catch (error) {
    console.error('[API Available Slots] Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
