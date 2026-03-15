import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/utils/api';
import { validateCropRecommendation } from '@/utils/validators';
import type { ApiResponse, CropRecommendationResponse, CropRecommendation } from '@/types';

// AI Crop Recommendation Engine
async function generateCropRecommendations(
  soilType: string,
  climate: string,
  season: string,
  soilPh?: number,
  rainfall?: number,
  temperature?: number,
  humidity?: number
): Promise<CropRecommendation[]> {
  // Crop database with suitability scores
  const cropDatabase: Record<string, CropRecommendation[]> = {
    // Alluvial soil + Tropical + Kharif
    'ALLUVIAL-TROPICAL-KHARIF': [
      {
        cropName: 'Rice',
        confidence: 0.95,
        expectedYield: { min: 25, max: 40, unit: 'quintals/acre' },
        marketDemand: 'HIGH',
        profitability: 'HIGH',
        waterRequirement: 'HIGH',
        growingPeriod: 120,
        reasons: ['Ideal for alluvial soil', 'High water retention', 'Strong market demand', 'Government MSP support'],
      },
      {
        cropName: 'Sugarcane',
        confidence: 0.88,
        expectedYield: { min: 300, max: 400, unit: 'quintals/acre' },
        marketDemand: 'HIGH',
        profitability: 'HIGH',
        waterRequirement: 'HIGH',
        growingPeriod: 300,
        reasons: ['Deep root system suitable for alluvial soil', 'High returns', 'Processing industry demand'],
      },
      {
        cropName: 'Maize',
        confidence: 0.82,
        expectedYield: { min: 20, max: 30, unit: 'quintals/acre' },
        marketDemand: 'HIGH',
        profitability: 'MEDIUM',
        waterRequirement: 'MEDIUM',
        growingPeriod: 90,
        reasons: ['Versatile crop', 'Good for fodder and grain', 'Growing poultry feed demand'],
      },
    ],
    // Black soil + Tropical + Kharif
    'BLACK-TROPICAL-KHARIF': [
      {
        cropName: 'Cotton',
        confidence: 0.94,
        expectedYield: { min: 8, max: 15, unit: 'quintals/acre' },
        marketDemand: 'HIGH',
        profitability: 'HIGH',
        waterRequirement: 'MEDIUM',
        growingPeriod: 150,
        reasons: ['Black soil retains moisture well', 'High fiber quality', 'Export potential', 'Textile industry demand'],
      },
      {
        cropName: 'Soybean',
        confidence: 0.87,
        expectedYield: { min: 12, max: 18, unit: 'quintals/acre' },
        marketDemand: 'HIGH',
        profitability: 'MEDIUM',
        waterRequirement: 'MEDIUM',
        growingPeriod: 100,
        reasons: ['Nitrogen-fixing crop', 'Oil extraction industry', 'Protein-rich feed'],
      },
      {
        cropName: 'Turmeric',
        confidence: 0.79,
        expectedYield: { min: 80, max: 120, unit: 'quintals/acre' },
        marketDemand: 'HIGH',
        profitability: 'HIGH',
        waterRequirement: 'MEDIUM',
        growingPeriod: 270,
        reasons: ['High-value spice', 'Export demand', 'Medicinal properties'],
      },
    ],
    // Alluvial soil + Subtropical + Rabi
    'ALLUVIAL-SUBTROPICAL-RABI': [
      {
        cropName: 'Wheat',
        confidence: 0.96,
        expectedYield: { min: 18, max: 25, unit: 'quintals/acre' },
        marketDemand: 'HIGH',
        profitability: 'MEDIUM',
        waterRequirement: 'MEDIUM',
        growingPeriod: 140,
        reasons: ['Staple food crop', 'Government MSP', 'Strong market', 'Suitable for cool season'],
      },
      {
        cropName: 'Mustard',
        confidence: 0.85,
        expectedYield: { min: 8, max: 12, unit: 'quintals/acre' },
        marketDemand: 'HIGH',
        profitability: 'MEDIUM',
        waterRequirement: 'LOW',
        growingPeriod: 110,
        reasons: ['Oilseed crop', 'Low water requirement', 'Beekeeping compatibility'],
      },
      {
        cropName: 'Chickpea',
        confidence: 0.81,
        expectedYield: { min: 10, max: 15, unit: 'quintals/acre' },
        marketDemand: 'HIGH',
        profitability: 'MEDIUM',
        waterRequirement: 'LOW',
        growingPeriod: 100,
        reasons: ['Protein-rich pulse', 'Nitrogen fixation', 'Low input costs'],
      },
    ],
    // Red soil + Tropical + Kharif
    'RED-TROPICAL-KHARIF': [
      {
        cropName: 'Groundnut',
        confidence: 0.91,
        expectedYield: { min: 12, max: 20, unit: 'quintals/acre' },
        marketDemand: 'HIGH',
        profitability: 'HIGH',
        waterRequirement: 'LOW',
        growingPeriod: 105,
        reasons: ['Well-drained soil preferred', 'Oil extraction', 'Export quality potential'],
      },
      {
        cropName: 'Millets',
        confidence: 0.86,
        expectedYield: { min: 8, max: 15, unit: 'quintals/acre' },
        marketDemand: 'MEDIUM',
        profitability: 'MEDIUM',
        waterRequirement: 'LOW',
        growingPeriod: 75,
        reasons: ['Drought tolerant', 'Nutrient-rich', 'Growing health food market'],
      },
      {
        cropName: 'Pigeon Pea',
        confidence: 0.78,
        expectedYield: { min: 6, max: 10, unit: 'quintals/acre' },
        marketDemand: 'HIGH',
        profitability: 'MEDIUM',
        waterRequirement: 'LOW',
        growingPeriod: 180,
        reasons: ['Deep root system', 'Protein-rich dal', 'Intercropping compatible'],
      },
    ],
    // Default fallback
    'DEFAULT': [
      {
        cropName: 'Mixed Vegetables',
        confidence: 0.70,
        expectedYield: { min: 100, max: 200, unit: 'quintals/acre' },
        marketDemand: 'HIGH',
        profitability: 'HIGH',
        waterRequirement: 'MEDIUM',
        growingPeriod: 60,
        reasons: ['Quick returns', 'Local market demand', 'Diversification'],
      },
      {
        cropName: 'Fodder Crops',
        confidence: 0.65,
        expectedYield: { min: 200, max: 300, unit: 'quintals/acre' },
        marketDemand: 'MEDIUM',
        profitability: 'MEDIUM',
        waterRequirement: 'MEDIUM',
        growingPeriod: 45,
        reasons: ['Livestock feed', 'Soil improvement', 'Quick growing'],
      },
    ],
  };

  // Get recommendations based on key
  const key = `${soilType}-${climate}-${season}`;
  let recommendations = cropDatabase[key] || cropDatabase['DEFAULT'];

  // Adjust based on additional parameters
  if (soilPh !== undefined) {
    recommendations = recommendations.map(crop => {
      let confidence = crop.confidence;
      if (soilPh < 5.5 || soilPh > 8.5) confidence *= 0.9;
      return { ...crop, confidence: Math.round(confidence * 100) / 100 };
    });
  }

  if (rainfall !== undefined) {
    recommendations = recommendations.map(crop => {
      let confidence = crop.confidence;
      if (crop.waterRequirement === 'HIGH' && rainfall < 1000) confidence *= 0.85;
      if (crop.waterRequirement === 'LOW' && rainfall > 1500) confidence *= 0.9;
      return { ...crop, confidence: Math.round(confidence * 100) / 100 };
    });
  }

  // Sort by confidence
  return recommendations.sort((a, b) => b.confidence - a.confidence);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CropRecommendationResponse>>
) {
  // Check authentication
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Please sign in.',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  try {
    // Validate request body
    const validation = validateCropRecommendation(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: { body: validation.errors },
      });
    }

    const { soilType, climate, season, soilPh, rainfall, temperature, humidity, farmId } = validation.data;

    // Generate AI recommendations
    const recommendations = await generateCropRecommendations(
      soilType,
      climate,
      season,
      soilPh,
      rainfall,
      temperature,
      humidity
    );

    // Save to database
    const savedRecommendation = await prisma.cropRecommendation.create({
      data: {
        userId: session.user.id,
        farmId: farmId || null,
        soilType,
        soilPh: soilPh || null,
        climate,
        season,
        rainfall: rainfall || null,
        temperature: temperature || null,
        humidity: humidity || null,
        recommendations: recommendations as any,
        topRecommendation: recommendations[0]?.cropName || '',
        confidenceScore: recommendations[0]?.confidence || 0,
        expectedYield: recommendations[0]?.expectedYield as any || null,
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        activityType: 'CROP_RECOMMENDATION',
        description: `Generated crop recommendation for ${soilType} soil, ${climate} climate, ${season} season`,
        metadata: {
          recommendationId: savedRecommendation.id,
          topCrop: recommendations[0]?.cropName,
          confidence: recommendations[0]?.confidence,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        id: savedRecommendation.id,
        recommendations,
        topRecommendation: recommendations[0]?.cropName || '',
        confidenceScore: recommendations[0]?.confidence || 0,
      },
      message: 'Crop recommendations generated successfully',
    });
  } catch (error) {
    console.error('Crop recommendation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate crop recommendations',
    });
  }
}
