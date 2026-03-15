// Reputation system for KisanSaathi community gamification

export const REPUTATION_EVENTS = {
  POST_PUBLISHED:      { points: 10,  label: 'Post published' },
  POST_LIKED:          { points: 2,   label: 'Post liked' },
  COMMENT_LIKED:       { points: 1,   label: 'Comment liked' },
  HELPFUL_ANSWER:      { points: 25,  label: 'Answer marked helpful' },
  PEST_ALERT_VERIFIED: { points: 50,  label: 'Pest alert verified by community' },
  QUESTION_ANSWERED:   { points: 15,  label: 'Question answered' },
  PROFILE_COMPLETE:    { points: 20,  label: 'Profile completed' },
}

export const BADGES = [
  {
    id:          'first_post',
    name:        'First Post',
    nameHindi:   'पहली पोस्ट',
    icon:        '🌱',
    description: 'Published your first post',
    condition:   (stats) => stats.postsCount >= 1,
  },
  {
    id:          'active_farmer',
    name:        'Active Farmer',
    nameHindi:   'सक्रिय किसान',
    icon:        '⚡',
    description: '7 days posting streak',
    condition:   (stats) => stats.streakDays >= 7,
  },
  {
    id:          'expert_farmer',
    name:        'Expert Farmer',
    nameHindi:   'विशेषज्ञ किसान',
    icon:        '🌾',
    description: '10+ helpful answers given',
    condition:   (stats) => stats.helpfulAnswers >= 10,
  },
  {
    id:          'pest_watcher',
    name:        'Pest Watcher',
    nameHindi:   'कीट निगरानीकर्ता',
    icon:        '🔍',
    description: '5+ pest alerts confirmed by community',
    condition:   (stats) => stats.verifiedPestAlerts >= 5,
  },
  {
    id:          'community_leader',
    name:        'Community Leader',
    nameHindi:   'समुदाय नेता',
    icon:        '👑',
    description: '100+ followers',
    condition:   (stats) => stats.followersCount >= 100,
  },
  {
    id:          'trusted_voice',
    name:        'Trusted Voice',
    nameHindi:   'विश्वसनीय आवाज़',
    icon:        '✅',
    description: '1000+ reputation points',
    condition:   (stats) => stats.reputationScore >= 1000,
  },
]

// Calculate which badges a user has earned
export function calculateBadges(stats) {
  return BADGES
    .filter(badge => badge.condition(stats))
    .map(b => b.id)
}

// Get reputation tier label
export function getReputationTier(score) {
  if (score >= 1000) return { label: 'Master Farmer', labelHindi: 'मास्टर किसान', color: 'text-purple-600' }
  if (score >= 500)  return { label: 'Expert',        labelHindi: 'विशेषज्ञ',      color: 'text-blue-600'   }
  if (score >= 200)  return { label: 'Experienced',   labelHindi: 'अनुभवी',        color: 'text-green-600'  }
  if (score >= 50)   return { label: 'Active',        labelHindi: 'सक्रिय',        color: 'text-yellow-600' }
  return                    { label: 'Newcomer',      labelHindi: 'नए किसान',      color: 'text-gray-500'   }
}
