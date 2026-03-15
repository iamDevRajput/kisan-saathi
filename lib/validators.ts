import { z } from 'zod';

// ===================== Common Schemas =====================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const locationSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  location: z.string().optional(),
});

// ===================== Advisory Schemas =====================

export const generateAdvisorySchema = z.object({
  cropName: z.string().min(1, 'Crop name is required'),
  stage: z.enum(['SEEDLING', 'VEGETATIVE', 'FLOWERING', 'FRUITING', 'MATURITY', 'HARVEST']),
  location: z.string().min(1, 'Location is required'),
  soilData: z.object({
    nitrogen: z.number().optional(),
    phosphorus: z.number().optional(),
    potassium: z.number().optional(),
    pH: z.number().min(0).max(14).optional(),
    moisture: z.number().min(0).max(100).optional(),
  }).optional(),
  weatherData: z.object({
    temperature: z.number().optional(),
    humidity: z.number().optional(),
    rainfall: z.number().optional(),
  }).optional(),
  language: z.string().default('hi'),
});

export const cropProfileSchema = z.object({
  name: z.string().min(1),
  variety: z.string().optional(),
  sowingDate: z.string().datetime().optional(),
  area: z.number().positive().optional(),
  irrigationType: z.enum(['DRIP', 'SPRINKLER', 'FLOOD', 'FURROW', 'RAINFED']).optional(),
  soilType: z.enum(['ALLUVIAL', 'BLACK', 'RED', 'LATERITE', 'ARID', 'FOREST', 'MOUNTAIN', 'DESERT']).optional(),
});

// ===================== Pest Detection Schemas =====================

export const pestDetectionAnalyzeSchema = z.object({
  imageUrl: z.string().url('Valid image URL required'),
  cropName: z.string().optional(),
  cropId: z.string().optional(),
});

export const pestDetectionUpdateSchema = z.object({
  status: z.enum(['DETECTED', 'TREATING', 'TREATED', 'RESOLVED', 'CHRONIC']),
  notes: z.string().optional(),
});

export const pestAlertQuerySchema = z.object({
  district: z.string().optional(),
  state: z.string().default('UP'),
});

// ===================== Weather Schemas =====================

export const weatherForecastSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  days: z.coerce.number().int().min(1).max(15).default(7),
});

export const farmAdvisorySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  crops: z.array(z.string()).min(1),
  language: z.string().default('hi'),
});

export const weatherSubscribeSchema = z.object({
  farmId: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  location: z.string().optional(),
  alertTypes: z.array(z.string()),
  notifyVia: z.array(z.enum(['EMAIL', 'SMS', 'PUSH', 'WHATSAPP'])),
});

// ===================== Market Schemas =====================

export const marketPricesQuerySchema = z.object({
  state: z.string().default('UP'),
  district: z.string().optional(),
  commodity: z.string().optional(),
  mandi: z.string().optional(),
  date: z.string().optional(),
});

export const marketTrendsQuerySchema = z.object({
  commodity: z.string().min(1),
  mandi: z.string().optional(),
  days: z.coerce.number().int().min(1).max(90).default(30),
});

export const marketForecastSchema = z.object({
  commodity: z.string().min(1),
  mandi: z.string().min(1),
  days: z.number().int().min(1).max(14).default(7),
});

export const priceAlertSchema = z.object({
  commodity: z.string().min(1),
  marketName: z.string().optional(),
  alertType: z.enum(['PRICE_ABOVE', 'PRICE_BELOW', 'PRICE_CHANGE_PERCENT', 'DAILY_UPDATE']),
  targetPrice: z.number().positive().optional(),
  priceChangePercent: z.number().optional(),
  notifyVia: z.array(z.enum(['EMAIL', 'SMS', 'PUSH', 'WHATSAPP'])).default(['PUSH']),
});

export const bestMandiQuerySchema = z.object({
  commodity: z.string().min(1),
  userLat: z.coerce.number().min(-90).max(90),
  userLng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().positive().default(100),
});

// ===================== Scheme Schemas =====================

export const schemeQuerySchema = z.object({
  category: z.enum(['SUBSIDY', 'LOAN', 'INSURANCE', 'PENSION', 'GRANT', 'TRAINING', 'EQUIPMENT', 'SEEDS', 'FERTILIZER', 'IRRIGATION', 'STORAGE', 'MARKETING']).optional(),
  state: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED', 'COMING_SOON', 'SUSPENDED']).optional(),
});

export const checkEligibilitySchema = z.object({
  landArea: z.number().positive().optional(),
  landType: z.enum(['OWNED', 'LEASED', 'SHARED', 'GOVERNMENT_ALLOTTED']).optional(),
  annualIncome: z.number().nonnegative().optional(),
  hasKCC: z.boolean().optional(),
  hasPMKisan: z.boolean().optional(),
  category: z.enum(['GENERAL', 'OBC', 'SC', 'ST', 'EWS']).optional(),
  state: z.string().default('UP'),
});

export const schemeApplySchema = z.object({
  schemeId: z.string().min(1),
  applicantName: z.string().min(1),
  applicantPhone: z.string().min(10).max(15),
  applicantEmail: z.string().email().optional(),
  address: z.string().min(1),
  district: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().length(6),
  landSize: z.number().positive(),
  landLocation: z.string().min(1),
  cropsGrown: z.array(z.string()),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
});

export const schemeAiGuideSchema = z.object({
  schemeId: z.string().min(1),
  userProfile: z.object({
    landArea: z.number().optional(),
    category: z.string().optional(),
    state: z.string().optional(),
    district: z.string().optional(),
  }).optional(),
  language: z.string().default('hi'),
});

// ===================== Translation Schemas =====================

export const translateSchema = z.object({
  text: z.string().min(1),
  targetLanguage: z.enum(['en', 'hi', 'pa', 'mr', 'gu', 'bn', 'te', 'ta', 'kn', 'ml', 'or', 'ur']),
  sourceLanguage: z.string().optional(),
});

export const updateLanguageSchema = z.object({
  lang: z.enum(['en', 'hi', 'pa', 'mr', 'gu', 'bn', 'te', 'ta', 'kn', 'ml', 'or', 'ur']),
});

// ===================== User Schemas =====================

export const userEligibilitySchema = z.object({
  landArea: z.number().positive().optional(),
  landType: z.enum(['OWNED', 'LEASED', 'SHARED', 'GOVERNMENT_ALLOTTED']).optional(),
  annualIncome: z.number().nonnegative().optional(),
  incomeCategory: z.enum(['BPL', 'APL', 'LOWER_MIDDLE', 'MIDDLE', 'UPPER_MIDDLE']).optional(),
  hasKCC: z.boolean().optional(),
  hasPMKisan: z.boolean().optional(),
  hasNREGA: z.boolean().optional(),
  bankAccountLinked: z.boolean().optional(),
  aadhaarLinked: z.boolean().optional(),
  category: z.enum(['GENERAL', 'OBC', 'SC', 'ST', 'EWS']).optional(),
});

// ===================== Type exports =====================

export type GenerateAdvisoryInput = z.infer<typeof generateAdvisorySchema>;
export type CropProfileInput = z.infer<typeof cropProfileSchema>;
export type PestDetectionAnalyzeInput = z.infer<typeof pestDetectionAnalyzeSchema>;
export type WeatherForecastInput = z.infer<typeof weatherForecastSchema>;
export type FarmAdvisoryInput = z.infer<typeof farmAdvisorySchema>;
export type MarketPricesQueryInput = z.infer<typeof marketPricesQuerySchema>;
export type MarketForecastInput = z.infer<typeof marketForecastSchema>;
export type PriceAlertInput = z.infer<typeof priceAlertSchema>;
export type CheckEligibilityInput = z.infer<typeof checkEligibilitySchema>;
export type SchemeApplyInput = z.infer<typeof schemeApplySchema>;
export type TranslateInput = z.infer<typeof translateSchema>;
