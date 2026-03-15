import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import type { ApiResponse, GovernmentScheme } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GovernmentScheme>>
) {
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Try to fetch from database first
      let scheme = await prisma.governmentScheme.findUnique({
        where: { id: id as string },
      });

      // If not found in database, return sample data
      if (!scheme) {
        // Return sample scheme based on ID
        scheme = {
          id: id as string,
          schemeCode: 'PM-KISAN',
          name: 'Pradhan Mantri Kisan Samman Nidhi',
          nameLocal: 'प्रधानमंत्री किसान सम्मान निधि',
          shortDescription: 'Income support of Rs. 6000 per year to farmer families',
          fullDescription: 'PM-KISAN is a central sector scheme with 100% funding from Government of India...',
          category: 'SUBSIDY',
          tags: ['income support', 'direct benefit transfer'],
          eligibilityCriteria: {
            farmerType: ['Small', 'Marginal'],
            otherRequirements: ['Valid bank account', 'Aadhaar linked'],
          },
          eligibleStates: ['All India'],
          eligibleCrops: ['All crops'],
          benefits: [{ type: 'SUBSIDY', description: 'Rs. 6000 per year' }],
          subsidyAmount: { min: 6000, max: 6000, unit: 'INR/year' },
          applicationProcess: ['Visit CSC', 'Submit documents', 'Verification'],
          requiredDocuments: ['Aadhaar', 'Land Records', 'Bank Passbook'],
          applicationUrl: 'https://pmkisan.gov.in',
          offlineApplication: true,
          applicationCenters: ['CSC Centers'],
          isPermanent: true,
          status: 'ACTIVE',
          helplineNumber: '155261',
          helplineEmail: 'pmkisan-ict@gov.in',
          websiteUrl: 'https://pmkisan.gov.in',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any;
      }

      return res.status(200).json({
        success: true,
        data: scheme as any,
      });
    } catch (error) {
      console.error('Scheme detail error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch scheme details',
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
}
