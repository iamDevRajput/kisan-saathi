import Anthropic from '@anthropic-ai/sdk';

// Singleton Anthropic client
const globalForAnthropic = globalThis as unknown as {
  anthropic: Anthropic | undefined;
};

export const anthropic =
  globalForAnthropic.anthropic ??
  new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForAnthropic.anthropic = anthropic;
}

// AI model to use
export const AI_MODEL = 'claude-sonnet-4-20250514';

// Helper function to generate AI completion
export async function generateAICompletion(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 4096
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    return textContent?.type === 'text' ? textContent.text : '';
  } catch (error) {
    console.error('Anthropic API Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

// Helper function for vision analysis
export async function analyzeImageWithAI(
  imageUrl: string,
  analysisPrompt: string,
  maxTokens: number = 4096
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: imageUrl,
              },
            },
            {
              type: 'text',
              text: analysisPrompt,
            },
          ],
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    return textContent?.type === 'text' ? textContent.text : '';
  } catch (error) {
    console.error('Anthropic Vision API Error:', error);
    throw new Error('Failed to analyze image');
  }
}

// Parse JSON from AI response
export function parseAIJsonResponse<T>(response: string): T {
  // Try to extract JSON from the response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]) as T;
    } catch (e) {
      console.error('Failed to parse AI JSON response:', e);
      throw new Error('Invalid JSON in AI response');
    }
  }
  throw new Error('No JSON found in AI response');
}

// Agricultural prompts
export const PROMPTS = {
  CROP_ADVISORY: `You are an expert Indian agricultural scientist with deep knowledge of Indian farming practices, soil types, and climate conditions. You provide practical, actionable advice in simple language that farmers can easily understand and implement.`,

  PEST_DETECTION: `You are an expert agricultural pathologist specializing in Indian crops. Analyze crop images to identify pests, diseases, and health issues. Provide accurate diagnosis with confidence scores and practical treatment recommendations including both organic and chemical options with proper dosages.`,

  WEATHER_ADVISORY: `You are an agricultural meteorologist specializing in Indian farming. Based on weather forecasts, provide specific daily farming recommendations, irrigation schedules, and harvest timing advice for different crops.`,

  MARKET_FORECAST: `You are an agricultural economist specializing in Indian commodity markets. Analyze price trends and market conditions to provide accurate price predictions with reasoning.`,

  SCHEME_GUIDE: `You are a government scheme expert helping Indian farmers. Explain schemes in simple Hindi/English, list exact documents needed, offices to visit, and step-by-step online/offline application process.`,

  TRANSLATION: `You are a translator specializing in Indian agricultural terminology. Translate the given text accurately while keeping technical farming terms understandable for farmers. Maintain the meaning and context.`,
};
