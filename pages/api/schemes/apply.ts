import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import type { ApiResponse, SchemeApplication } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SchemeApplication>>
) {
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  if (req.method === 'POST') {
    try {
      const {
        schemeId,
        applicantName,
        applicantPhone,
        applicantEmail,
        address,
        district,
        state,
        pincode,
        landSize,
        landLocation,
        cropsGrown,
        bankName,
        accountNumber,
        ifscCode,
        documents,
      } = req.body;

      // Validation
      if (!schemeId || !applicantName || !applicantPhone || !address) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        });
      }

      // Get scheme details
      const scheme = await prisma.governmentScheme.findUnique({
        where: { id: schemeId },
      });

      if (!scheme) {
        return res.status(404).json({
          success: false,
          error: 'Scheme not found',
        });
      }

      // Generate application number
      const applicationNumber = `KISAN-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Create application
      const application = await prisma.schemeApplication.create({
        data: {
          userId: session.user.id,
          schemeId,
          applicationNumber,
          status: 'SUBMITTED',
          applicantName,
          applicantPhone,
          applicantEmail: applicantEmail || null,
          address,
          district,
          state,
          pincode,
          landSize: landSize || 0,
          landLocation: landLocation || '',
          cropsGrown: cropsGrown || [],
          bankName: bankName || null,
          accountNumber: accountNumber || null,
          ifscCode: ifscCode || null,
          documents: documents || [],
          submittedAt: new Date(),
          currentStage: 'DOCUMENT_VERIFICATION',
          stageHistory: [
            {
              stage: 'APPLICATION_SUBMITTED',
              timestamp: new Date().toISOString(),
              status: 'COMPLETED',
            },
          ],
        },
      });

      // Log activity
      await prisma.userActivity.create({
        data: {
          userId: session.user.id,
          activityType: 'SCHEME_APPLIED',
          description: `Applied for ${scheme.name}`,
          metadata: {
            applicationId: application.id,
            schemeId,
            applicationNumber,
          },
        },
      });

      return res.status(201).json({
        success: true,
        data: {
          id: application.id,
          applicationNumber: application.applicationNumber,
          schemeId: application.schemeId,
          schemeName: scheme.name,
          status: application.status,
          applicantName: application.applicantName,
          landSize: application.landSize,
          cropsGrown: application.cropsGrown,
          submittedAt: application.submittedAt,
          currentStage: application.currentStage,
        } as any,
        message: 'Application submitted successfully',
      });
    } catch (error) {
      console.error('Scheme application error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to submit application',
      });
    }
  }

  if (req.method === 'GET') {
    // Get user's applications
    try {
      const applications = await prisma.schemeApplication.findMany({
        where: { userId: session.user.id },
        include: { scheme: true },
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json({
        success: true,
        data: applications.map(app => ({
          id: app.id,
          applicationNumber: app.applicationNumber,
          schemeId: app.schemeId,
          schemeName: (app as any).scheme.name,
          status: app.status,
          applicantName: app.applicantName,
          landSize: app.landSize,
          cropsGrown: app.cropsGrown,
          submittedAt: app.submittedAt,
          currentStage: app.currentStage,
          assignedOfficer: app.assignedOfficer,
        })) as any,
      });
    } catch (error) {
      console.error('Fetch applications error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch applications',
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
}
