import type { NextApiRequest, NextApiResponse } from 'next';
import { successResponse, errors } from '../../../lib/apiResponse';
import { generateAICompletion, PROMPTS } from '../../../lib/anthropic';
import { translateSchema } from '../../../lib/validators';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return errors.methodNotAllowed(res, ['POST']);
  }

  try {
    const validationResult = translateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return errors.validationError(res, validationResult.error.errors);
    }

    const { text, targetLanguage, sourceLanguage } = validationResult.data;
    const targetLangName = LANGUAGE_NAMES[targetLanguage];
    const sourceLangName = sourceLanguage ? LANGUAGE_NAMES[sourceLanguage] : 'Auto-detect';

    const prompt = `Translate the following agricultural text to ${targetLangName}.
Keep technical farming terms accurate and understandable for farmers.
Keep the translation simple and natural.
${sourceLanguage ? `Source language: ${sourceLangName}` : ''}

Text to translate:
${text}

Return ONLY the translated text, nothing else.`;

    const translatedText = await generateAICompletion(PROMPTS.TRANSLATION, prompt);

    return successResponse(res, {
      originalText: text,
      translatedText: translatedText.trim(),
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage,
      targetLanguageName: targetLangName,
    });

  } catch (error) {
    console.error('Translation error:', error);
    return errors.serverError(res, error as Error);
  }
}
