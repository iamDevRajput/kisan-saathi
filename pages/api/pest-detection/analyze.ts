import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { analyzeImageWithAI, parseAIJsonResponse, PROMPTS } from '../../../lib/anthropic';
import { successResponse, errors } from '../../../lib/apiResponse';
import { pestDetectionAnalyzeSchema } from '../../../lib/validators';

interface DetectionResult {
  diseaseName: string;
  diseaseNameHindi: string;
  scientificName: string;
  severity: number;
  affectedArea: number;
  confidence: number;
  symptoms: string[];
  causes: string[];
  organicTreatment: {
    name: string;
    application: string;
    frequency: string;
    cost: string;
  };
  chemicalTreatment: {
    name: string;
    dosage: string;
    application: string;
    precautions: string[];
  };
  preventiveMeasures: string[];
  estimatedLoss: string;
  urgency: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return errors.methodNotAllowed(res, ['POST']);
  }

  try {
    const validationResult = pestDetectionAnalyzeSchema.safeParse(req.body);
    if (!validationResult.success) {
      return errors.validationError(res, validationResult.error.errors);
    }

    const { imageUrl, cropName, cropId } = validationResult.data;
    const userId = req.body.userId || 'anonymous';

    const analysisPrompt = `Analyze this crop image and identify any pests, diseases, or health issues.
${cropName ? `The crop is: ${cropName}` : ''}

Provide your analysis in the following JSON format:
{
  "diseaseName": "Name of pest/disease in English",
  "diseaseNameHindi": "Name in Hindi",
  "scientificName": "Scientific name",
  "severity": 0-10 scale (10 being most severe),
  "affectedArea": percentage of visible plant affected,
  "confidence": your confidence level 0-100%,
  "symptoms": ["symptom1", "symptom2"],
  "causes": ["cause1", "cause2"],
  "organicTreatment": {
    "name": "Treatment name",
    "application": "How to apply",
    "frequency": "How often",
    "cost": "Approximate cost"
  },
  "chemicalTreatment": {
    "name": "Chemical name",
    "dosage": "Recommended dosage per liter/acre",
    "application": "Application method",
    "precautions": ["precaution1", "precaution2"]
  },
  "preventiveMeasures": ["measure1", "measure2"],
  "estimatedLoss": "Estimated yield loss if untreated",
  "urgency": "CRITICAL/HIGH/MEDIUM/LOW"
}

If the plant appears healthy, set severity to 0 and diseaseName to "Healthy Plant".
Return ONLY valid JSON.`;

    const aiResponse = await analyzeImageWithAI(imageUrl, analysisPrompt);
    const detection = parseAIJsonResponse<DetectionResult>(aiResponse);

    const savedDetection = await prisma.diseaseDetection.create({
      data: {
        userId,
        cropId,
        cropName: cropName || 'Unknown',
        imageUrl,
        diseaseName: detection.diseaseName,
        scientificName: detection.scientificName,
        confidence: detection.confidence / 100,
        severity: detection.severity,
        affectedArea: detection.affectedArea,
        symptoms: detection.symptoms,
        causes: detection.causes,
        treatmentPlan: detection,
        organicTreatments: [detection.organicTreatment],
        chemicalTreatments: [detection.chemicalTreatment],
        preventiveMeasures: detection.preventiveMeasures,
        estimatedLoss: detection.estimatedLoss,
        status: detection.severity > 0 ? 'DETECTED' : 'RESOLVED',
      },
    });

    return successResponse(res, {
      id: savedDetection.id,
      detection: {
        ...detection,
        confidence: detection.confidence,
      },
      createdAt: savedDetection.createdAt,
    }, detection.severity > 0 ? 'Disease/pest detected' : 'Plant appears healthy', 201);

  } catch (error) {
    console.error('Pest detection error:', error);
    return errors.serverError(res, error as Error);
  }
}
