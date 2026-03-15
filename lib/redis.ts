import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

export { redis };

// Cache keys
export const CACHE_KEYS = {
  WEATHER: (lat: number, lng: number) => `weather:${lat.toFixed(2)}:${lng.toFixed(2)}`,
  MARKET_PRICES: (state: string, date: string) => `prices:${state}:${date}`,
  SCHEMES: 'schemes:all',
  MANDI_LIST: (state: string) => `mandis:${state}`,
  TRANSLATION: (text: string, lang: string) => `translate:${lang}:${hashString(text)}`,
};

// Cache durations in seconds
export const CACHE_TTL = {
  WEATHER: 3600, // 1 hour
  MARKET_PRICES: 1800, // 30 minutes
  SCHEMES: 86400, // 24 hours
  MANDI_LIST: 86400, // 24 hours
  TRANSLATION: 604800, // 7 days
};

// Helper to hash strings for cache keys
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Get from cache
export async function getFromCache<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  
  try {
    const data = await redis.get<T>(key);
    return data;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

// Set to cache
export async function setToCache<T>(
  key: string,
  data: T,
  ttlSeconds: number
): Promise<boolean> {
  if (!redis) return false;
  
  try {
    await redis.set(key, data, { ex: ttlSeconds });
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
}

// Delete from cache
export async function deleteFromCache(key: string): Promise<boolean> {
  if (!redis) return false;
  
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
}

// Cache with fallback
export async function cacheWithFallback<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  // Try to get from cache first
  const cached = await getFromCache<T>(key);
  if (cached) {
    return cached;
  }
  
  // Fetch fresh data
  const data = await fetchFn();
  
  // Store in cache (don't await to avoid blocking)
  setToCache(key, data, ttlSeconds).catch(console.error);
  
  return data;
}

// Rate limiting
export async function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  if (!redis) {
    return { allowed: true, remaining: maxRequests, resetAt: Date.now() + windowSeconds * 1000 };
  }
  
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  
  try {
    // Remove old entries
    await redis.zremrangebyscore(key, 0, windowStart);
    
    // Count requests in current window
    const count = await redis.zcard(key);
    
    if (count >= maxRequests) {
      const oldest = await redis.zrange(key, 0, 0);
      const resetAt = oldest.length > 0 ? Number(oldest[0]) + windowSeconds * 1000 : now + windowSeconds * 1000;
      return { allowed: false, remaining: 0, resetAt };
    }
    
    // Add current request
    await redis.zadd(key, { score: now, member: now.toString() });
    await redis.expire(key, windowSeconds);
    
    return {
      allowed: true,
      remaining: maxRequests - count - 1,
      resetAt: now + windowSeconds * 1000,
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true, remaining: maxRequests, resetAt: now + windowSeconds * 1000 };
  }
}
