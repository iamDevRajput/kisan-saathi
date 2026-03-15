import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { generateAICompletion, parseAIJsonResponse, PROMPTS } from '../../../lib/anthropic';
import { successResponse, errors } from '../../../lib/apiResponse';
import { generateAdvisorySchema } from '../../../lib/validators';

interface AdvisoryOutput {
  summary: string;
  immediateActions: string[];
  fertilizerSchedule: Array<{ week: number; fertilizer: string; quantity: string; method: string }>;
  irrigationAdvice: string;
  pestRisks: Array<{ pest: string; risk: string; prevention: string }>;
  harvestTimeline: string;
  estimatedYield: string;
  costSaving: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
  mr: 'Marathi',
  gu: 'Gujarati',
  bn: 'Bengali',
  te: 'Telugu',
  ta: 'Tamil',
  kn: 'Kannada',
  ml: 'Malayalam',
  or: 'Odia',
  ur: 'Urdu',
};

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return 'Kharif';
  if (month >= 11 || month <= 3) return 'Rabi';
  return 'Zaid';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return errors.methodNotAllowed(res, ['POST']);
  }

  try {
    const validationResult = generateAdvisorySchema.safeParse(req.body);
    if (!validationResult.success) {
      return errors.validationError(res, validationResult.error.errors);
    }

    const { cropName, stage, location, soilData, weatherData, language } = validationResult.data;
    const userId = req.body.userId || 'anonymous';
    const season = getCurrentSeason();
    const languageName = LANGUAGE_NAMES[language] || 'Hindi';

    const prompt = `You are an expert Indian agricultural scientist. Given the following information:

Crop: ${cropName}
Growth Stage: ${stage}
Location: ${location}
Season: ${season}
Soil Data: ${soilData ? JSON.stringify(soilData) : 'Not provided'}
Weather Data: ${weatherData ? JSON.stringify(weatherData) : 'Not provided'}

Generate a detailed agricultural advisory in JSON format with the following structure:
{
  "summary": "Brief 2-3 sentence summary of the advisory",
  "immediateActions": ["Action 1", "Action 2", "Action 3"],
  "fertilizerSchedule": [
    {"week": 1, "fertilizer": "Name", "quantity": "Amount per acre", "method": "Application method"}
  ],
  "irrigationAdvice": "Detailed irrigation advice",
  "pestRisks": [
    {"pest": "Pest name", "risk": "High/Medium/Low", "prevention": "Prevention method"}
  ],
  "harvestTimeline": "Expected harvest time and preparation",
  "estimatedYield": "Expected yield per acre",
  "costSaving": "Cost-saving tips",
  "urgency": "CRITICAL/HIGH/MEDIUM/LOW based on immediate needs"
}

IMPORTANT: Respond ONLY in ${languageName}. Keep language simple for farmers. Return valid JSON only.`;

    const aiResponse = await generateAICompletion(PROMPTS.CROP_ADVISORY, prompt);
    const advisory = parseAIJsonResponse<AdvisoryOutput>(aiResponse);

    const savedAdvisory = await prisma.cropAdvisory.create({
      data: {
        userId,
        cropName,
        stage,
        location,
        soilData: soilData || {},
        weatherData: weatherData || {},
        advisory,
        summary: advisory.summary,
        immediateActions: advisory.immediateActions,
        urgency: advisory.urgency,
        language,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return successResponse(res, {
      id: savedAdvisory.id,
      advisory,
      createdAt: savedAdvisory.createdAt,
      validUntil: savedAdvisory.validUntil,
    }, 'Advisory generated successfully', 201);

  } catch (error) {
    console.error('Advisory generation error:', error);
    return errors.serverError(res, error as Error);
  }
}
