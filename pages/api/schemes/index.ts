import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import type { ApiResponse, GovernmentScheme, PaginatedResponse } from '@/types';

// Sample government schemes data
const schemesData: Partial<GovernmentScheme>[] = [
  {
    schemeCode: 'PM-KISAN',
    name: 'Pradhan Mantri Kisan Samman Nidhi',
    nameLocal: 'प्रधानमंत्री किसान सम्मान निधि',
    shortDescription: 'Income support of Rs. 6000 per year to farmer families',
    fullDescription: 'PM-KISAN is a central sector scheme with 100% funding from Government of India. Under the scheme, income support of Rs. 6000/- per year is provided to all farmer families across the country in three equal installments of Rs. 2000/- each every four months.',
    category: 'SUBSIDY',
    tags: ['income support', 'direct benefit transfer', 'small farmers'],
    eligibilityCriteria: {
      farmerType: ['Small', 'Marginal'],
      landOwnership: 'Own cultivable land',
      incomeRange: { min: 0, max: 0 }, // No income limit
      otherRequirements: ['Valid bank account', 'Aadhaar linked'],
    },
    eligibleStates: ['All India'],
    eligibleCrops: ['All crops'],
    benefits: [
      { type: 'SUBSIDY', description: 'Rs. 6000 per year direct cash transfer' },
    ],
    subsidyAmount: { min: 6000, max: 6000, unit: 'INR/year' },
    applicationProcess: [
      'Visit nearest Common Service Centre (CSC)',
      'Submit land documents and Aadhaar',
      'Bank account verification',
      'Online registration on PM-KISAN portal',
    ],
    requiredDocuments: ['Aadhaar Card', 'Land Records', 'Bank Passbook', 'Mobile Number'],
    applicationUrl: 'https://pmkisan.gov.in',
    offlineApplication: true,
    applicationCenters: ['CSC Centers', 'Agriculture Offices', 'Revenue Offices'],
    isPermanent: true,
    status: 'ACTIVE',
    helplineNumber: '155261',
    helplineEmail: 'pmkisan-ict@gov.in',
    websiteUrl: 'https://pmkisan.gov.in',
  },
  {
    schemeCode: 'PMFBY',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    nameLocal: 'प्रधानमंत्री फसल बीमा योजना',
    shortDescription: 'Comprehensive crop insurance against natural calamities',
    fullDescription: 'PMFBY provides comprehensive insurance cover against failure of the crop thus helping in stabilising the income of the farmers. The Scheme covers all Food & Oilseeds crops and Annual Commercial/Horticultural Crops.',
    category: 'INSURANCE',
    tags: ['crop insurance', 'risk protection', 'natural calamities'],
    eligibilityCriteria: {
      farmerType: ['All farmers'],
      landOwnership: 'Cultivating notified crops',
      otherRequirements: ['Bank account', 'Crop sown in notified area'],
    },
    eligibleStates: ['All India'],
    eligibleCrops: ['Food crops', 'Oilseeds', 'Annual Commercial crops'],
    benefits: [
      { type: 'INSURANCE', description: 'Comprehensive risk coverage for crops' },
      { type: 'SUBSIDY', description: 'Premium subsidy: 50% for farmers' },
    ],
    subsidyAmount: { min: 0, max: 0, unit: 'Premium subsidy' },
    applicationProcess: [
      'Contact bank where KCC/loan is availed',
      'Submit crop details and land records',
      'Pay subsidized premium',
      'Get insurance coverage certificate',
    ],
    requiredDocuments: ['Land Records', 'Bank Account', 'Crop Sowing Certificate', 'Aadhaar'],
    applicationUrl: 'https://pmfby.gov.in',
    offlineApplication: true,
    applicationCenters: ['Bank Branches', 'Insurance Companies', 'Agriculture Offices'],
    isPermanent: true,
    status: 'ACTIVE',
    helplineNumber: '1800-180-1551',
    helplineEmail: 'pmfby-support@gov.in',
    websiteUrl: 'https://pmfby.gov.in',
  },
  {
    schemeCode: 'KCC',
    name: 'Kisan Credit Card',
    nameLocal: 'किसान क्रेडिट कार्ड',
    shortDescription: 'Easy access to credit for agricultural needs',
    fullDescription: 'Kisan Credit Card scheme provides farmers with timely access to credit for their agricultural needs. It offers short-term credit for cultivation and post-harvest expenses, and consumption requirements.',
    category: 'LOAN',
    tags: ['credit', 'loan', 'working capital'],
    eligibilityCriteria: {
      farmerType: ['All farmers', 'Tenant farmers', 'Share croppers'],
      otherRequirements: ['Age 18-75 years', 'Not defaulter to any bank'],
    },
    eligibleStates: ['All India'],
    eligibleCrops: ['All crops'],
    benefits: [
      { type: 'LOAN', description: 'Short term credit up to Rs. 3 lakh' },
      { type: 'GRANT', description: 'Interest subvention at 2% per annum' },
    ],
    interestRate: 7,
    applicationProcess: [
      'Visit nearest bank branch',
      'Fill KCC application form',
      'Submit land documents',
      'Credit assessment and card issuance',
    ],
    requiredDocuments: ['Land Records', 'Identity Proof', 'Address Proof', 'Passport Photo', 'Bank Account'],
    offlineApplication: true,
    applicationCenters: ['Commercial Banks', 'Regional Rural Banks', 'Cooperative Banks'],
    isPermanent: true,
    status: 'ACTIVE',
    helplineNumber: '1800-11-22-11',
    websiteUrl: 'https://www.nabard.org',
  },
  {
    schemeCode: 'SMAM',
    name: 'Sub-Mission on Agricultural Mechanization',
    nameLocal: 'कृषि यांत्रीकरण पर उप-मिशन',
    shortDescription: 'Subsidy on agricultural machinery and equipment',
    fullDescription: 'SMAM aims to increase the reach of farm mechanization to small and marginal farmers and to the regions where farm power availability is low. It provides subsidy on various agricultural machines and equipment.',
    category: 'SUBSIDY',
    tags: ['machinery', 'equipment', 'mechanization'],
    eligibilityCriteria: {
      farmerType: ['Small', 'Marginal', 'SC/ST', 'Women'],
      otherRequirements: ['Own or lease land', 'Not availed subsidy in last 5 years for same machine'],
    },
    eligibleStates: ['All India'],
    eligibleCrops: ['All crops'],
    benefits: [
      { type: 'SUBSIDY', description: '40-50% subsidy on machinery' },
      { type: 'GRANT', description: 'Additional 10% for SC/ST/Women' },
    ],
    subsidyAmount: { min: 20000, max: 150000, unit: 'INR' },
    applicationProcess: [
      'Register on SMAM portal',
      'Select machinery from approved list',
      'Submit application to district agriculture office',
      'Verification and approval',
      'Purchase and claim subsidy',
    ],
    requiredDocuments: ['Aadhaar', 'Land Records', 'Caste Certificate (if applicable)', 'Quotation from dealer'],
    applicationUrl: 'https://farmmech.gov.in',
    offlineApplication: true,
    applicationCenters: ['District Agriculture Offices', 'Farm Machinery Manufacturers'],
    isPermanent: true,
    status: 'ACTIVE',
    helplineNumber: '011-25848122',
    websiteUrl: 'https://farmmech.gov.in',
  },
  {
    schemeCode: 'NFSM',
    name: 'National Food Security Mission',
    nameLocal: 'राष्ट्रीय खाद्य सुरक्षा मिशन',
    shortDescription: 'Increase production of rice, wheat, pulses and coarse cereals',
    fullDescription: 'NFSM aims to increase production of rice, wheat, pulses and coarse cereals through area expansion and productivity enhancement in a sustainable manner. It provides assistance for seeds, nutrients, and plant protection.',
    category: 'GRANT',
    tags: ['food security', 'seeds', 'productivity'],
    eligibilityCriteria: {
      farmerType: ['All farmers'],
      landOwnership: 'Cultivating notified crops',
    },
    eligibleStates: ['All States'],
    eligibleCrops: ['Rice', 'Wheat', 'Pulses', 'Coarse Cereals'],
    benefits: [
      { type: 'SUBSIDY', description: 'Assistance for certified seeds' },
      { type: 'SUBSIDY', description: 'Plant protection chemicals' },
      { type: 'GRANT', description: 'Farm machinery assistance' },
    ],
    subsidyAmount: { min: 1000, max: 50000, unit: 'INR' },
    applicationProcess: [
      'Contact District Agriculture Officer',
      'Submit crop plan and land details',
      'Verification by agriculture department',
      'Receive inputs/subsidy',
    ],
    requiredDocuments: ['Land Records', 'Identity Proof', 'Bank Account', 'Crop Details'],
    offlineApplication: true,
    applicationCenters: ['District Agriculture Offices', 'Block Development Offices'],
    isPermanent: true,
    status: 'ACTIVE',
    helplineNumber: '011-23384109',
    websiteUrl: 'https://nfsm.gov.in',
  },
  {
    schemeCode: 'MIDH',
    name: 'Mission for Integrated Development of Horticulture',
    nameLocal: 'बागवानी के समेकित विकास के लिए मिशन',
    shortDescription: 'Comprehensive development of horticulture sector',
    fullDescription: 'MIDH promotes holistic growth of horticulture sector including fruits, vegetables, spices, flowers, medicinal and aromatic plants. It provides assistance for nurseries, plantation, post-harvest management, and marketing.',
    category: 'GRANT',
    tags: ['horticulture', 'fruits', 'vegetables', 'plantation'],
    eligibilityCriteria: {
      farmerType: ['All farmers'],
      landOwnership: 'Suitable for horticultural crops',
    },
    eligibleStates: ['All States'],
    eligibleCrops: ['Fruits', 'Vegetables', 'Spices', 'Flowers', 'Medicinal Plants'],
    benefits: [
      { type: 'SUBSIDY', description: '50% subsidy on planting material' },
      { type: 'GRANT', description: 'Assistance for protected cultivation' },
      { type: 'SUBSIDY', description: 'Post-harvest infrastructure' },
    ],
    subsidyAmount: { min: 5000, max: 200000, unit: 'INR' },
    applicationProcess: [
      'Prepare Detailed Project Report (DPR)',
      'Submit to State Horticulture Mission',
      'Technical appraisal',
      'Approval and fund release',
    ],
    requiredDocuments: ['Land Records', 'Project Report', 'Bank Account', ' quotations'],
    offlineApplication: true,
    applicationCenters: ['State Horticulture Missions', 'District Horticulture Offices'],
    isPermanent: true,
    status: 'ACTIVE',
    helplineNumber: '011-23070373',
    websiteUrl: 'https://midh.gov.in',
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PaginatedResponse<GovernmentScheme>>>
) {
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { 
      category, 
      state, 
      search, 
      status = 'ACTIVE',
      page = '1', 
      limit = '10' 
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      status: status as any,
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { schemeCode: { contains: search as string, mode: 'insensitive' } },
        { shortDescription: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Fetch from database or use sample data
    let schemes = await prisma.governmentScheme.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });

    let total = await prisma.governmentScheme.count({ where });

    // If no data in database, use sample data
    if (schemes.length === 0) {
      let filteredData = schemesData.filter(s => {
        if (category && s.category !== category) return false;
        if (status && s.status !== status) return false;
        if (search) {
          const searchLower = (search as string).toLowerCase();
          return (
            s.name?.toLowerCase().includes(searchLower) ||
            s.schemeCode?.toLowerCase().includes(searchLower) ||
            s.shortDescription?.toLowerCase().includes(searchLower)
          );
        }
        return true;
      });

      total = filteredData.length;
      schemes = filteredData.slice(skip, skip + limitNum).map((s, idx) => ({
        ...s,
        id: `scheme-${idx}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as any;
    }

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        activityType: 'SCHEME_VIEWED',
        description: `Viewed government schemes${category ? ` in ${category} category` : ''}`,
        metadata: {
          category: category || 'all',
          search: search || null,
          resultsCount: schemes.length,
        },
      },
    });

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      data: {
        data: schemes as any,
        meta: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error('Schemes error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch schemes',
    });
  }
}
