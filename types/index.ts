// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ==================== USER TYPES ====================

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  phone: string | null;
  role: 'ADMIN' | 'FARMER' | 'EXPERT' | 'AGENT';
  language: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== AI CROP RECOMMENDATION TYPES ====================

export interface CropRecommendationRequest {
  soilType: SoilType;
  soilPh?: number;
  climate: Climate;
  season: Season;
  rainfall?: number;
  temperature?: number;
  humidity?: number;
  farmId?: string;
}

export interface CropRecommendation {
  cropName: string;
  confidence: number;
  expectedYield: {
    min: number;
    max: number;
    unit: string;
  };
  marketDemand: 'HIGH' | 'MEDIUM' | 'LOW';
  profitability: 'HIGH' | 'MEDIUM' | 'LOW';
  waterRequirement: 'HIGH' | 'MEDIUM' | 'LOW';
  growingPeriod: number; // days
  reasons: string[];
}

export interface CropRecommendationResponse {
  recommendations: CropRecommendation[];
  topRecommendation: string;
  confidenceScore: number;
  id: string;
}

export type SoilType = 'ALLUVIAL' | 'BLACK' | 'RED' | 'LATERITE' | 'ARID' | 'FOREST' | 'MOUNTAIN' | 'DESERT';
export type Climate = 'TROPICAL' | 'SUBTROPICAL' | 'TEMPERATE' | 'ARID' | 'MOUNTAIN';
export type Season = 'KHARIF' | 'RABI' | 'ZAID';

// ==================== AI DISEASE DETECTION TYPES ====================

export interface DiseaseDetectionRequest {
  imageBase64: string;
  cropId?: string;
  cropName?: string;
  symptoms?: string[];
}

export interface DiseaseDetectionResult {
  id: string;
  diseaseName: string;
  scientificName: string | null;
  confidence: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  affectedArea: number | null;
  symptoms: string[];
  causes: string[];
  organicTreatments: TreatmentOption[];
  chemicalTreatments: TreatmentOption[];
  preventiveMeasures: string[];
}

export interface TreatmentOption {
  name: string;
  description: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  effectiveness: number;
  cost: 'LOW' | 'MEDIUM' | 'HIGH';
}

// ==================== WEATHER TYPES ====================

export interface WeatherRequest {
  latitude: number;
  longitude: number;
  location?: string;
  days?: number;
}

export interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  forecast: DailyForecast[];
  agriculturalIndices: AgriculturalIndices;
}

export interface CurrentWeather {
  date: Date;
  temperature: number;
  feelsLike: number | null;
  humidity: number;
  pressure: number | null;
  windSpeed: number | null;
  windDirection: string | null;
  visibility: number | null;
  uvIndex: number | null;
  condition: WeatherCondition;
  description: string;
  icon: string;
  rainfall: number | null;
  rainfallProbability: number | null;
}

export interface DailyForecast {
  date: Date;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  rainfall: number;
  rainfallProbability: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
  windSpeed: number;
  agriculturalAdvice: string[];
}

export interface AgriculturalIndices {
  heatIndex: number | null;
  soilMoistureIndex: number | null;
  pestRiskIndex: number | null;
  irrigationRecommendation: string;
  fieldWorkSuitability: 'GOOD' | 'FAIR' | 'POOR';
}

export type WeatherCondition = 
  | 'CLEAR' 
  | 'CLOUDY' 
  | 'PARTLY_CLOUDY' 
  | 'RAIN' 
  | 'HEAVY_RAIN' 
  | 'THUNDERSTORM' 
  | 'SNOW' 
  | 'FOG' 
  | 'DUST';

export interface WeatherAlert {
  id: string;
  alertType: WeatherAlertType;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  title: string;
  description: string;
  location: string;
  startsAt: Date;
  endsAt: Date | null;
  affectedCrops: string[];
  recommendedActions: string[];
}

export type WeatherAlertType = 
  | 'HEAT_WAVE' 
  | 'COLD_WAVE' 
  | 'HEAVY_RAIN' 
  | 'DROUGHT' 
  | 'FLOOD' 
  | 'STRONG_WINDS' 
  | 'FROST' 
  | 'HAILSTORM' 
  | 'PEST_OUTBREAK_RISK';

// ==================== MARKET PRICE TYPES ====================

export interface MarketPriceRequest {
  cropName?: string;
  marketName?: string;
  state?: string;
  category?: CropCategory;
  date?: Date;
  limit?: number;
  page?: number;
}

export interface MarketPrice {
  id: string;
  cropName: string;
  cropVariety: string | null;
  category: CropCategory;
  marketName: string;
  state: string;
  district: string | null;
  price: number;
  unit: string;
  currency: string;
  previousPrice: number | null;
  priceChange: number | null;
  priceChangePercent: number | null;
  trend: PriceTrend;
  grade: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  avgPrice: number | null;
  arrivals: number | null;
  arrivalDate: Date;
  forecastPrice: number | null;
  forecastTrend: PriceTrend | null;
}

export interface PriceTrend {
  cropName: string;
  currentPrice: number;
  previousPrice: number;
  changePercent: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  forecast: {
    nextWeek: number;
    nextMonth: number;
    confidence: number;
  };
}

export type CropCategory = 
  | 'CEREALS' 
  | 'PULSES' 
  | 'OILSEEDS' 
  | 'VEGETABLES' 
  | 'FRUITS' 
  | 'SPICES' 
  | 'FIBERS' 
  | 'SUGAR' 
  | 'DAIRY' 
  | 'MEAT' 
  | 'POULTRY' 
  | 'FISHERY';

export type PriceTrendType = 'UP' | 'DOWN' | 'STABLE' | 'VOLATILE';

// ==================== GOVERNMENT SCHEME TYPES ====================

export interface SchemeRequest {
  category?: SchemeCategory;
  state?: string;
  search?: string;
  eligibility?: {
    landSize?: number;
    income?: number;
    crops?: string[];
  };
  status?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  limit?: number;
  page?: number;
}

export interface GovernmentScheme {
  id: string;
  schemeCode: string;
  name: string;
  nameLocal: string | null;
  shortDescription: string;
  fullDescription: string;
  category: SchemeCategory;
  subCategory: string | null;
  tags: string[];
  eligibilityCriteria: EligibilityCriteria;
  eligibleStates: string[];
  eligibleCrops: string[];
  minLandSize: number | null;
  maxLandSize: number | null;
  incomeLimit: number | null;
  benefits: SchemeBenefit[];
  subsidyAmount: {
    min: number;
    max: number;
    unit: string;
  } | null;
  interestRate: number | null;
  applicationProcess: string[];
  requiredDocuments: string[];
  applicationUrl: string | null;
  offlineApplication: boolean;
  applicationCenters: string[];
  startDate: Date | null;
  endDate: Date | null;
  isPermanent: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'COMING_SOON' | 'SUSPENDED';
  helplineNumber: string | null;
  helplineEmail: string | null;
  websiteUrl: string | null;
}

export interface EligibilityCriteria {
  farmerType?: string[];
  landOwnership?: string;
  cropTypes?: string[];
  incomeRange?: {
    min: number;
    max: number;
  };
  ageLimit?: {
    min: number;
    max: number;
  };
  specialCategories?: string[];
  otherRequirements?: string[];
}

export interface SchemeBenefit {
  type: 'SUBSIDY' | 'LOAN' | 'INSURANCE' | 'GRANT' | 'EQUIPMENT' | 'TRAINING';
  description: string;
  amount?: number;
  percentage?: number;
}

export type SchemeCategory = 
  | 'SUBSIDY' 
  | 'LOAN' 
  | 'INSURANCE' 
  | 'PENSION' 
  | 'GRANT' 
  | 'TRAINING' 
  | 'EQUIPMENT' 
  | 'SEEDS' 
  | 'FERTILIZER' 
  | 'IRRIGATION' 
  | 'STORAGE' 
  | 'MARKETING';

export interface SchemeApplication {
  id: string;
  applicationNumber: string;
  schemeId: string;
  schemeName: string;
  status: ApplicationStatus;
  applicantName: string;
  landSize: number;
  cropsGrown: string[];
  submittedAt: Date | null;
  currentStage: string;
  assignedOfficer: string | null;
}

export type ApplicationStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'DOCUMENT_VERIFICATION' 
  | 'FIELD_VERIFICATION' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'DISBURSED';

// ==================== AUTH TYPES ====================

export interface AuthenticatedRequest {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

// ==================== PAGINATION TYPES ====================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
