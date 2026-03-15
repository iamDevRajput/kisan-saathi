// pages/api/experts/review.js
import prisma from '../../../src/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { bookingId, rating, reviewText, reviewTextHindi, userId = 'user-mock' } = req.body;

    // 1. Check if booking exists and belongs to user
    const booking = await prisma.expertBooking.findFirst({
      where: {
        id: bookingId,
        userId,
        status: 'COMPLETED'
      }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Eligible booking not found' });
    }

    // 2. Create the review
    const review = await prisma.expertReview.create({
      data: {
        bookingId,
        expertId: booking.expertId,
        userId,
        rating: parseInt(rating),
        review: reviewText,
        reviewHindi: reviewTextHindi
      }
    });

    // 3. Update the expert's average rating
    const agg = await prisma.expertReview.aggregate({
      where: { expertId: booking.expertId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await prisma.expert.update({
      where: { id: booking.expertId },
      data: {
        rating: agg._avg.rating || 0,
        ratingCount: agg._count.rating || 0
      }
    });

    return res.status(200).json({ success: true, data: review });

  } catch (error) {
    console.error('[API Expert Review] Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
