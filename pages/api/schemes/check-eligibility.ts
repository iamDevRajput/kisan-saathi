import type { NextApiRequest, NextApiResponse } from 'next';
import { successResponse, errors } from '../../../lib/apiResponse';
import { checkEligibilitySchema } from '../../../lib/validators';

interface EligibilityResult {
  schemeId: string;
  schemeName: string;
  status: 'ELIGIBLE' | 'PARTIAL' | 'INELIGIBLE';
  score: number;
  reasons: string[];
  missingDocs?: string[];
}

const SCHEMES_CRITERIA = [
  {
    id: 'pm-kisan',
    name: 'PM Kisan Samman Nidhi',
    check: (data: any) => {
      if (!data.landArea || data.landArea <= 0) return { eligible: false, reason: 'Land ownership required' };
      return { eligible: true, reason: '' };
    },
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    check: (data: any) => {
      if (!data.landArea || data.landArea <= 0) return { eligible: false, reason: 'Land ownership required' };
      return { eligible: true, reason: '' };
    },
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card',
    check: (data: any) => {
      if (!data.landArea || data.landArea <= 0) return { eligible: false, reason: 'Land ownership required' };
      if (data.hasKCC) return { eligible: false, reason: 'Already have KCC' };
      return { eligible: true, reason: '' };
    },
  },
  {
    id: 'pmksy',
    name: 'PM Krishi Sinchayee Yojana',
    check: (data: any) => {
      if (!data.landArea || data.landArea <= 0) return { eligible: false, reason: 'Land ownership required' };
      return { eligible: true, reason: '' };
    },
  },
  {
    id: 'pm-kusum',
    name: 'PM-KUSUM (Solar Pump)',
    check: (data: any) => {
      if (!data.landArea || data.landArea <= 0) return { eligible: false, reason: 'Land ownership required' };
      return { eligible: true, reason: '' };
    },
  },
  {
    id: 'up-kisan-uday',
    name: 'UP Kisan Uday Yojana',
    check: (data: any) => {
      if (data.state !== 'UP') return { eligible: false, reason: 'UP residents only' };
      if (!data.landArea || data.landArea <= 0) return { eligible: false, reason: 'Land ownership required' };
      return { eligible: true, reason: '' };
    },
  },
  {
    id: 'krishak-durghatna',
    name: 'Mukhyamantri Krishak Durghatna Kalyan Yojana',
    check: (data: any) => {
      if (data.state !== 'UP') return { eligible: false, reason: 'UP residents only' };
      if (!data.landArea || data.landArea <= 0) return { eligible: false, reason: 'Land ownership required' };
      return { eligible: true, reason: '' };
    },
  },
  {
    id: 'pmay-g',
    name: 'PM Awas Yojana (Gramin)',
    check: (data: any) => {
      if (data.annualIncome && data.annualIncome > 200000) return { eligible: false, reason: 'Income exceeds BPL limit' };
      return { eligible: true, reason: '' };
    },
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return errors.methodNotAllowed(res, ['POST']);
  }

  try {
    const validationResult = checkEligibilitySchema.safeParse(req.body);
    if (!validationResult.success) {
      return errors.validationError(res, validationResult.error.errors);
    }

    const userData = validationResult.data;
    const results: EligibilityResult[] = [];

    for (const scheme of SCHEMES_CRITERIA) {
      const checkResult = scheme.check(userData);
      results.push({
        schemeId: scheme.id,
        schemeName: scheme.name,
        status: checkResult.eligible ? 'ELIGIBLE' : 'INELIGIBLE',
        score: checkResult.eligible ? 100 : 0,
        reasons: checkResult.reason ? [checkResult.reason] : [],
      });
    }

    const eligible = results.filter(r => r.status === 'ELIGIBLE');
    const ineligible = results.filter(r => r.status === 'INELIGIBLE');

    return successResponse(res, {
      summary: {
        totalSchemes: results.length,
        eligible: eligible.length,
        ineligible: ineligible.length,
      },
      eligible,
      ineligible,
      recommendations: eligible.slice(0, 5).map(e => ({
        scheme: e.schemeName,
        action: 'Apply now',
      })),
    });

  } catch (error) {
    console.error('Eligibility check error:', error);
    return errors.serverError(res, error as Error);
  }
}
