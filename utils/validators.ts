// Crop Recommendation Validators
export function validateCropRecommendation(body: unknown): { success: true; data: any } | { success: false; errors: string[] } {
  const errors: string[] = [];
  const b = body as any;

  if (!b.soilType) errors.push('soilType is required');
  if (!b.climate) errors.push('climate is required');
  if (!b.season) errors.push('season is required');

  const validSoilTypes = ['ALLUVIAL', 'BLACK', 'RED', 'LATERITE', 'ARID', 'FOREST', 'MOUNTAIN', 'DESERT'];
  const validClimates = ['TROPICAL', 'SUBTROPICAL', 'TEMPERATE', 'ARID', 'MOUNTAIN'];
  const validSeasons = ['KHARIF', 'RABI', 'ZAID'];

  if (b.soilType && !validSoilTypes.includes(b.soilType)) {
    errors.push(`soilType must be one of: ${validSoilTypes.join(', ')}`);
  }
  if (b.climate && !validClimates.includes(b.climate)) {
    errors.push(`climate must be one of: ${validClimates.join(', ')}`);
  }
  if (b.season && !validSeasons.includes(b.season)) {
    errors.push(`season must be one of: ${validSeasons.join(', ')}`);
  }

  if (b.soilPh && (b.soilPh < 0 || b.soilPh > 14)) {
    errors.push('soilPh must be between 0 and 14');
  }

  return errors.length > 0 ? { success: false, errors } : { success: true, data: b };
}

// Disease Detection Validators
export function validateDiseaseDetection(body: unknown): { success: true; data: any } | { success: false; errors: string[] } {
  const errors: string[] = [];
  const b = body as any;

  if (!b.imageBase64) errors.push('imageBase64 is required');
  if (b.imageBase64 && !isValidBase64(b.imageBase64)) {
    errors.push('imageBase64 must be a valid base64 string');
  }

  return errors.length > 0 ? { success: false, errors } : { success: true, data: b };
}

// Weather Validators
export function validateWeatherRequest(body: unknown): { success: true; data: any } | { success: false; errors: string[] } {
  const errors: string[] = [];
  const b = body as any;

  if (b.latitude === undefined || b.latitude === null) errors.push('latitude is required');
  if (b.longitude === undefined || b.longitude === null) errors.push('longitude is required');

  if (b.latitude !== undefined && (b.latitude < -90 || b.latitude > 90)) {
    errors.push('latitude must be between -90 and 90');
  }
  if (b.longitude !== undefined && (b.longitude < -180 || b.longitude > 180)) {
    errors.push('longitude must be between -180 and 180');
  }

  return errors.length > 0 ? { success: false, errors } : { success: true, data: b };
}

// Market Price Validators
export function validateMarketPriceQuery(params: URLSearchParams): { success: true; data: any } | { success: false; errors: string[] } {
  const errors: string[] = [];
  const data: any = {};

  const validCategories = ['CEREALS', 'PULSES', 'OILSEEDS', 'VEGETABLES', 'FRUITS', 'SPICES', 'FIBERS', 'SUGAR', 'DAIRY', 'MEAT', 'POULTRY', 'FISHERY'];

  if (params.has('category') && !validCategories.includes(params.get('category')!)) {
    errors.push(`category must be one of: ${validCategories.join(', ')}`);
  }

  if (params.has('page')) {
    const page = parseInt(params.get('page')!, 10);
    if (isNaN(page) || page < 1) errors.push('page must be a positive integer');
    else data.page = page;
  }

  if (params.has('limit')) {
    const limit = parseInt(params.get('limit')!, 10);
    if (isNaN(limit) || limit < 1 || limit > 100) errors.push('limit must be between 1 and 100');
    else data.limit = limit;
  }

  return errors.length > 0 ? { success: false, errors } : { success: true, data };
}

// Scheme Validators
export function validateSchemeQuery(params: URLSearchParams): { success: true; data: any } | { success: false; errors: string[] } {
  const errors: string[] = [];
  const data: any = {};

  const validCategories = ['SUBSIDY', 'LOAN', 'INSURANCE', 'PENSION', 'GRANT', 'TRAINING', 'EQUIPMENT', 'SEEDS', 'FERTILIZER', 'IRRIGATION', 'STORAGE', 'MARKETING'];
  const validStatuses = ['ACTIVE', 'INACTIVE', 'EXPIRED'];

  if (params.has('category') && !validCategories.includes(params.get('category')!)) {
    errors.push(`category must be one of: ${validCategories.join(', ')}`);
  }

  if (params.has('status') && !validStatuses.includes(params.get('status')!)) {
    errors.push(`status must be one of: ${validStatuses.join(', ')}`);
  }

  return errors.length > 0 ? { success: false, errors } : { success: true, data };
}

// Helper functions
function isValidBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}
