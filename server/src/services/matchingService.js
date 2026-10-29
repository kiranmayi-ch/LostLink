import ItemReport from '../models/ItemReport.js';

// Common English stopwords to filter out for keyword comparison
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most',
  'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than',
  'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn', 'we', 'were',
  'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'won', 'would', 'you', 'your'
]);

// Tokenize text into words, removing stopwords and punctuation
export const extractKeywords = (text) => {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
};

// Calculate Jaccard similarity between two token sets
export const calculateTokenOverlap = (tokensA, tokensB) => {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersectionCount = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      intersectionCount++;
    }
  }
  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
};

// Calculate string similarity (dice/n-gram based)
export const calculateStringSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.85;

  const tokens1 = extractKeywords(s1);
  const tokens2 = extractKeywords(s2);
  return calculateTokenOverlap(tokens1, tokens2);
};

// Calculate date proximity score (decays over 30 days)
export const calculateDateProximityScore = (date1, date2) => {
  if (!date1 || !date2) return 0.5;
  const diffMs = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays <= 1) return 1.0;
  if (diffDays <= 3) return 0.9;
  if (diffDays <= 7) return 0.75;
  if (diffDays <= 14) return 0.5;
  if (diffDays <= 30) return 0.25;
  return 0.05;
};

/**
 * Compare two item reports and return match score (0-100) and human-readable reasons
 */
export const compareReports = (targetReport, candidateReport) => {
  const reasons = [];

  // 1. Category match (Weight: 20%)
  let categoryScore = 0;
  if (targetReport.category === candidateReport.category) {
    categoryScore = 1.0;
    reasons.push(`Exact category match: "${targetReport.category}"`);
  }

  // 2. Title similarity (Weight: 35%)
  const titleTokensTarget = extractKeywords(targetReport.title);
  const titleTokensCandidate = extractKeywords(candidateReport.title);
  const titleSimilarity = calculateStringSimilarity(targetReport.title, candidateReport.title);
  const commonTitleWords = titleTokensTarget.filter((w) => titleTokensCandidate.includes(w));
  if (commonTitleWords.length > 0) {
    reasons.push(`Common keywords in title: ${commonTitleWords.map((w) => `"${w}"`).join(', ')}`);
  }

  // 3. Description keyword overlap (Weight: 20%)
  const descTokensTarget = extractKeywords(targetReport.description);
  const descTokensCandidate = extractKeywords(candidateReport.description);
  const descOverlap = calculateTokenOverlap(descTokensTarget, descTokensCandidate);
  const commonDescWords = descTokensTarget.filter((w) => descTokensCandidate.includes(w));
  if (commonDescWords.length > 1) {
    reasons.push(`Description keyword overlap (${commonDescWords.slice(0, 4).join(', ')})`);
  }

  // 4. Approximate location similarity (Weight: 15%)
  const locationSimilarity = calculateStringSimilarity(
    targetReport.approximateLocation,
    candidateReport.approximateLocation
  );
  if (locationSimilarity >= 0.5) {
    reasons.push(`Similar location: "${candidateReport.approximateLocation}"`);
  }

  // 5. Date proximity (Weight: 10%)
  const dateProximityScore = calculateDateProximityScore(
    targetReport.dateOccurred,
    candidateReport.dateOccurred
  );
  const diffDays = Math.round(
    Math.abs(new Date(targetReport.dateOccurred) - new Date(candidateReport.dateOccurred)) /
      (1000 * 60 * 60 * 24)
  );
  if (diffDays <= 3) {
    reasons.push(`Occurred within ${diffDays === 0 ? 'the same day' : `${diffDays} day(s)`}`);
  } else if (diffDays <= 14) {
    reasons.push(`Occurred within ${diffDays} days`);
  }

  // Weighted total score calculation
  const totalScore = Math.round(
    (titleSimilarity * 35 +
      categoryScore * 20 +
      descOverlap * 20 +
      locationSimilarity * 15 +
      dateProximityScore * 10)
  );

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    reasons,
    isPotentialMatch: totalScore >= 40,
    disclaimer: 'Possible Match — Please verify the item before claiming it.',
  };
};

/**
 * Find potential matches for an item report from opposing reportType
 */
export const findMatchesForReport = async (reportId, limit = 6) => {
  const targetReport = await ItemReport.findById(reportId);
  if (!targetReport) return [];

  const opposingType = targetReport.reportType === 'lost' ? 'found' : 'lost';

  // Find candidate reports that are active and not archived/hidden
  const candidates = await ItemReport.find({
    _id: { $ne: targetReport._id },
    reportType: opposingType,
    status: { $in: ['active', 'under_claim'] },
    moderationStatus: 'approved',
  })
    .populate('reporterId', 'name institution')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const scoredMatches = [];

  for (const candidate of candidates) {
    const matchResult = compareReports(targetReport, candidate);

    if (matchResult.isPotentialMatch) {
      scoredMatches.push({
        report: candidate,
        matchScore: matchResult.score,
        matchReasons: matchResult.reasons,
        disclaimer: matchResult.disclaimer,
      });
    }
  }

  // Sort descending by matchScore
  scoredMatches.sort((a, b) => b.matchScore - a.matchScore);

  return scoredMatches.slice(0, limit);
};
