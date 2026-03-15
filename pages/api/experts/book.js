// pages/api/experts/book.js
import prisma from '../../../src/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { expertId, date, timeSlot, duration, type, topic, cropConcern, amount, userId = 'user-mock' } = req.body;

    // 1. Check if slot already booked
    const existing = await prisma.expertBooking.findFirst({
      where: {
        expertId,
        date: new Date(date),
        timeSlot,
        status: { notIn: ['CANCELLED'] }
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Slot already booked' });
    }

    // 2. Create Booking
    const booking = await prisma.expertBooking.create({
      data: {
        expertId,
        userId,
        date: new Date(date),
        timeSlot,
        duration: parseInt(duration),
        type,
        topic,
        cropConcern,
        amount: parseInt(amount),
        status: amount > 0 ? 'PENDING' : 'CONFIRMED',
        paymentStatus: amount > 0 ? 'PENDING' : 'PAID',
        meetingLink: `https://meet.kisansaathi.in/${Math.random().toString(36).substring(7)}`
      }
    });

    // 3. Mock payment processing if required
    if (amount > 0) {
      // In a real app we would create an order in Razorpay/Stripe here
      // For mock, we immediately simulate success
      await prisma.expertBooking.update({
        where: { id: booking.id },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentId: `pay_${Math.random().toString(36).substring(2)}`
        }
      });
      booking.status = 'CONFIRMED';
      booking.paymentStatus = 'PAID';
    }

    // Increment expert session count (optimistic for confirmed)
    if (booking.status === 'CONFIRMED') {
      await prisma.expert.update({
        where: { id: expertId },
        data: { totalSessions: { increment: 1 } }
      });
    }

    return res.status(200).json({ success: true, data: booking });

  } catch (error) {
    console.error('[API Expert Booking] Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
