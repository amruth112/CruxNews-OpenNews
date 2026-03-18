import type { Article } from '../types';

// Simple lexicon-based sentiment analyzer
// Fast, synchronous, entirely client-side. No AI models needed for this.
// Values roughly map from -1 (very negative) to +1 (very positive)

const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'superb',
  'success', 'successful', 'succeed', 'win', 'winning', 'winner', 'victory',
  'agree', 'agreement', 'approve', 'approval', 'benefit', 'beneficial',
  'boost', 'breakthrough', 'brilliant', 'celebrate', 'celebration', 'cheer',
  'growth', 'grow', 'improve', 'improvement', 'innovative', 'innovation',
  'joy', 'joyful', 'love', 'loved', 'peace', 'peaceful', 'perfect', 'positive',
  'profit', 'profitable', 'progress', 'prosper', 'prosperity', 'proud',
  'recover', 'recovery', 'resolve', 'resolution', 'safe', 'safety', 'secure',
  'smile', 'solve', 'solution', 'strong', 'strength', 'support', 'supported',
  'thrive', 'thriving', 'triumph', 'trust', 'trusted', 'up', 'welcome', 'wise',
  'optimistic', 'hope', 'hopeful', 'cure', 'healing', 'healthy', 'genius'
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'awful', 'horrible', 'dreadful', 'appalling', 'abysmal',
  'fail', 'failure', 'failed', 'lose', 'losing', 'loser', 'loss', 'defeat',
  'angry', 'anger', 'attack', 'attacked', 'ban', 'banned', 'blame', 'blamed',
  'bomb', 'bombed', 'cancel', 'cancelled', 'clash', 'clashed', 'collapse',
  'conflict', 'crash', 'crashed', 'crisis', 'critical', 'damage', 'damaged',
  'danger', 'dangerous', 'dead', 'death', 'decline', 'declined', 'destroy',
  'destroyed', 'devastating', 'devastated', 'die', 'died', 'disaster', 'disastrous',
  'down', 'drop', 'dropped', 'emergency', 'error', 'fake', 'fear', 'feared',
  'fight', 'fighting', 'flaw', 'flawed', 'foul', 'guilty', 'harm', 'harmful',
  'hate', 'hated', 'illegal', 'illness', 'infect', 'infected', 'injury', 'injured',
  'kill', 'killed', 'killer', 'murder', 'murdered', 'negative', 'pain', 'painful',
  'panic', 'panicked', 'poor', 'problem', 'protest', 'protested', 'quit', 'reject',
  'rejected', 'risk', 'risky', 'ruin', 'ruined', 'sad', 'scandal', 'scary',
  'shock', 'shocking', 'sick', 'sickness', 'smash', 'smashed', 'steal', 'stolen',
  'stress', 'stressful', 'struggle', 'struggling', 'suffer', 'suffered', 'suspect',
  'suspected', 'tension', 'tense', 'terrible', 'terror', 'terrorism', 'threat',
  'threaten', 'tragedy', 'tragic', 'trouble', 'troubling', 'ugly', 'unhappy',
  'unlawful', 'unsafe', 'victim', 'violence', 'violent', 'warn', 'warning',
  'worry', 'worried', 'worse', 'worst', 'wrong'
]);

/**
 * Calculate sentiment score for a text string (-1 to 1).
 */
export function analyzeTextSentiment(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  
  // Convert to lowercase and split by non-word characters
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  
  if (words.length === 0) return 0;

  let posCount = 0;
  let negCount = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) posCount++;
    if (NEGATIVE_WORDS.has(word)) negCount++;
  }

  // If no sentiment words found, score is 0
  if (posCount === 0 && negCount === 0) return 0;

  // Calculate normalized score between -1 and 1
  // Formula: (pos - neg) / (pos + neg)
  // With a dampening factor to prevent absolute 1/-1 for short texts
  const total = posCount + negCount;
  const dampener = Math.min(total / 5, 1); // Full effect only if at least 5 sentiment words
  
  const score = ((posCount - negCount) / total) * dampener;
  
  // Bound strictly between -1 and 1
  return Math.max(-1, Math.min(1, score));
}

/**
 * Calculate sentiment score for an entire article by weighing title heavily.
 */
export function analyzeArticleSentiment(article: Article): number {
  const titleScore = analyzeTextSentiment(article.title);
  const descScore = analyzeTextSentiment(article.description);
  
  // Title carries 2x the weight of the description
  return (titleScore * 2 + descScore) / 3;
}
