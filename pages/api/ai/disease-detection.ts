import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import type { ApiResponse, DiseaseDetectionResult, TreatmentOption } from '@/types';

// Disease database with detection patterns
const diseaseDatabase: Record<string, {
  scientificName: string;
  symptoms: string[];
  causes: string[];
  organicTreatments: TreatmentOption[];
  chemicalTreatments: TreatmentOption[];
  preventiveMeasures: string[];
}> = {
  'rice_blast': {
    scientificName: 'Magnaporthe oryzae',
    symptoms: ['Diamond-shaped lesions on leaves', 'Gray centers with brown margins', 'Neck rot in severe cases', 'White to gray-green lesions'],
    causes: ['Fungal infection', 'High humidity', 'Temperature 24-28°C', 'Nitrogen excess'],
    organicTreatments: [
      {
        name: 'Neem Oil Spray',
        description: 'Mix 5ml neem oil with 1 liter water and spray',
        dosage: '5ml/L',
        frequency: 'Every 7 days',
        duration: '3-4 weeks',
        effectiveness: 0.75,
        cost: 'LOW',
      },
      {
        name: 'Trichoderma viride',
        description: 'Biological fungicide application',
        dosage: '10g/L',
        frequency: 'Every 10 days',
        duration: '4 weeks',
        effectiveness: 0.80,
        cost: 'MEDIUM',
      },
    ],
    chemicalTreatments: [
      {
        name: 'Carbendazim 50% WP',
        description: 'Systemic fungicide for blast control',
        dosage: '1g/L',
        frequency: 'Every 15 days',
        duration: '2-3 applications',
        effectiveness: 0.90,
        cost: 'MEDIUM',
      },
      {
        name: 'Tricyclazole 75% WP',
        description: 'Specific for rice blast control',
        dosage: '1g/L',
        frequency: 'At disease onset',
        duration: '2 applications',
        effectiveness: 0.92,
        cost: 'MEDIUM',
      },
    ],
    preventiveMeasures: [
      'Use resistant varieties like IR64, MTU1010',
      'Avoid excess nitrogen application',
      'Maintain proper spacing',
      'Ensure good drainage',
      'Early planting to avoid peak disease period',
    ],
  },
  'cotton_bollworm': {
    scientificName: 'Helicoverpa armigera',
    symptoms: ['Holes in bolls', 'Damaged squares and flowers', 'Frass near damaged parts', 'Premature boll shedding'],
    causes: ['Moth infestation', 'Warm weather', 'Monocropping', 'Lack of natural predators'],
    organicTreatments: [
      {
        name: 'BT Spray (Bacillus thuringiensis)',
        description: 'Biological insecticide specific for bollworm',
        dosage: '2g/L',
        frequency: 'Every 7-10 days',
        duration: 'Until control achieved',
        effectiveness: 0.85,
        cost: 'MEDIUM',
      },
      {
        name: 'Neem Seed Kernel Extract',
        description: '5% NSKE spray',
        dosage: '50g/L',
        frequency: 'Every 5-7 days',
        duration: '3-4 weeks',
        effectiveness: 0.70,
        cost: 'LOW',
      },
    ],
    chemicalTreatments: [
      {
        name: 'Spinosad 45% SC',
        description: 'Biological origin insecticide',
        dosage: '0.3ml/L',
        frequency: 'At egg laying peak',
        duration: '2-3 applications',
        effectiveness: 0.88,
        cost: 'HIGH',
      },
      {
        name: 'Chlorantraniliprole 18.5% SC',
        description: 'Anthranilic diamide insecticide',
        dosage: '0.4ml/L',
        frequency: 'Every 15 days',
        duration: '2-3 applications',
        effectiveness: 0.90,
        cost: 'HIGH',
      },
    ],
    preventiveMeasures: [
      'Install pheromone traps (5/acre)',
      'Grow trap crops like marigold',
      'Remove and destroy infested bolls',
      'Maintain field sanitation',
      'Use resistant Bt cotton varieties',
    ],
  },
  'tomato_early_blight': {
    scientificName: 'Alternaria solani',
    symptoms: ['Dark brown spots with concentric rings', 'Yellowing of older leaves', 'Stem lesions near soil line', 'Fruit rot in severe cases'],
    causes: ['Fungal pathogen', 'Warm humid conditions', 'Plant stress', 'Poor air circulation'],
    organicTreatments: [
      {
        name: 'Copper Fungicide (Organic)',
        description: 'Bordeaux mixture 1%',
        dosage: '10g/L',
        frequency: 'Every 10 days',
        duration: '3-4 weeks',
        effectiveness: 0.75,
        cost: 'LOW',
      },
      {
        name: 'Pseudomonas fluorescens',
        description: 'Biocontrol agent',
        dosage: '5g/L',
        frequency: 'Every 7 days',
        duration: '4 weeks',
        effectiveness: 0.78,
        cost: 'MEDIUM',
      },
    ],
    chemicalTreatments: [
      {
        name: 'Mancozeb 75% WP',
        description: 'Broad spectrum fungicide',
        dosage: '2.5g/L',
        frequency: 'Every 7-10 days',
        duration: '3-4 applications',
        effectiveness: 0.85,
        cost: 'MEDIUM',
      },
      {
        name: 'Azoxystrobin 23% SC',
        description: 'Systemic fungicide',
        dosage: '1ml/L',
        frequency: 'Every 10 days',
        duration: '3 applications',
        effectiveness: 0.88,
        cost: 'HIGH',
      },
    ],
    preventiveMeasures: [
      'Rotate crops (3-year cycle)',
      'Remove and destroy infected plant debris',
      'Avoid overhead irrigation',
      'Maintain proper plant spacing',
      'Mulch to prevent soil splash',
    ],
  },
  'wheat_rust': {
    scientificName: 'Puccinia striiformis',
    symptoms: ['Yellow-orange pustules on leaves', 'Striped appearance', 'Premature leaf death', 'Reduced grain size'],
    causes: ['Fungal infection', 'Cool moist weather', 'Wind dispersal of spores', 'Susceptible varieties'],
    organicTreatments: [
      {
        name: 'Sulfur 80% WP',
        description: 'Organic fungicide',
        dosage: '3g/L',
        frequency: 'Every 10 days',
        duration: '3 weeks',
        effectiveness: 0.70,
        cost: 'LOW',
      },
    ],
    chemicalTreatments: [
      {
        name: 'Propiconazole 25% EC',
        description: 'Systemic fungicide',
        dosage: '1ml/L',
        frequency: 'At first appearance',
        duration: '2 applications',
        effectiveness: 0.92,
        cost: 'MEDIUM',
      },
      {
        name: 'Tebuconazole 25.9% EC',
        description: 'Triazole fungicide',
        dosage: '1ml/L',
        frequency: 'Every 15 days',
        duration: '2 applications',
        effectiveness: 0.90,
        cost: 'MEDIUM',
      },
    ],
    preventiveMeasures: [
      'Plant resistant varieties like HD2967, DBW187',
      'Early sowing to avoid disease peak',
      'Monitor fields regularly',
      'Apply preventive spray if forecast favorable',
      'Destroy volunteer wheat plants',
    ],
  },
};

// Simulated AI detection function
async function detectDisease(imageBase64: string, cropName?: string): Promise<{
  diseaseKey: string;
  confidence: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  affectedArea: number;
}> {
  // In production, this would call an actual ML model
  // For demo, we'll simulate based on image hash
  const hash = imageBase64.slice(0, 50);
  const hashSum = hash.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const diseases = Object.keys(diseaseDatabase);
  const selectedDisease = diseases[hashSum % diseases.length];
  
  // Simulate confidence based on image quality indicators
  const confidence = 0.75 + (hashSum % 20) / 100;
  
  // Determine severity
  const severities: ('LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL')[] = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'];
  const severity = severities[hashSum % 4];
  
  // Estimate affected area
  const affectedArea = 10 + (hashSum % 60);
  
  return {
    diseaseKey: selectedDisease,
    confidence: Math.min(0.98, confidence),
    severity,
    affectedArea,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<DiseaseDetectionResult>>
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
    const { imageBase64, cropId, cropName, symptoms } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Image is required',
      });
    }

    // Perform AI detection
    const detection = await detectDisease(imageBase64, cropName);
    const diseaseInfo = diseaseDatabase[detection.diseaseKey];

    if (!diseaseInfo) {
      return res.status(500).json({
        success: false,
        error: 'Disease detection failed',
      });
    }

    // Save detection to database
    const savedDetection = await prisma.diseaseDetection.create({
      data: {
        userId: session.user.id,
        cropId: cropId || null,
        imageUrl: 'data:image/jpeg;base64,' + imageBase64.slice(0, 100) + '...', // Truncated for storage
        imageHash: imageBase64.slice(0, 64),
        diseaseName: detection.diseaseKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        scientificName: diseaseInfo.scientificName,
        confidence: detection.confidence,
        severity: detection.severity,
        affectedArea: detection.affectedArea,
        symptoms: diseaseInfo.symptoms,
        causes: diseaseInfo.causes,
        organicTreatments: diseaseInfo.organicTreatments as any,
        chemicalTreatments: diseaseInfo.chemicalTreatments as any,
        preventiveMeasures: diseaseInfo.preventiveMeasures,
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        activityType: 'DISEASE_DETECTION',
        description: `Detected ${savedDetection.diseaseName} with ${Math.round(detection.confidence * 100)}% confidence`,
        metadata: {
          detectionId: savedDetection.id,
          diseaseName: savedDetection.diseaseName,
          confidence: detection.confidence,
          severity: detection.severity,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        id: savedDetection.id,
        diseaseName: savedDetection.diseaseName,
        scientificName: savedDetection.scientificName,
        confidence: detection.confidence,
        severity: detection.severity,
        affectedArea: detection.affectedArea,
        symptoms: diseaseInfo.symptoms,
        causes: diseaseInfo.causes,
        organicTreatments: diseaseInfo.organicTreatments,
        chemicalTreatments: diseaseInfo.chemicalTreatments,
        preventiveMeasures: diseaseInfo.preventiveMeasures,
      },
      message: 'Disease detected successfully',
    });
  } catch (error) {
    console.error('Disease detection error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to detect disease',
    });
  }
}
