// Synchronisation des avis Google, exclusivement cote serveur.
// Priorite : Google Business Profile API (tous les avis, tri chronologique).
// Secours : Places API (note, total et selection de cinq avis Google).

const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJczTzUUIzLWoR59TwldN3SsM';

const STAR_RATINGS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

function relativeDate(value) {
  const published = Date.parse(value);
  if (!Number.isFinite(published)) return '';
  const days = Math.max(0, Math.floor((Date.now() - published) / 86400000));
  if (days < 1) return "aujourd'hui";
  if (days < 7) return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  if (days < 35) {
    const weeks = Math.floor(days / 7);
    return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `il y a ${months} mois`;
  }
  const years = Math.floor(days / 365);
  return `il y a ${years} an${years > 1 ? 's' : ''}`;
}

function normaliseBusinessReview(review) {
  return {
    author: review.reviewer?.displayName || 'Client Google',
    rating: STAR_RATINGS[review.starRating] || Number(review.starRating) || 5,
    text: review.comment || '',
    time: relativeDate(review.updateTime || review.createTime),
    publishedAt: review.updateTime || review.createTime || '',
  };
}

function normalisePlaceReview(review) {
  return {
    author: review.authorAttribution?.displayName || 'Client Google',
    rating: Number(review.rating || 5),
    text: review.text?.text || review.originalText?.text || '',
    time: review.relativePublishTimeDescription || '',
    publishedAt: review.publishTime || '',
  };
}

async function getAccessToken() {
  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) throw new Error(`OAuth Google : ${response.status}`);
  const data = await response.json();
  if (!data.access_token) throw new Error('Jeton Google absent');
  return data.access_token;
}

async function fetchBusinessProfileReviews() {
  const required = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REFRESH_TOKEN',
    'GOOGLE_BUSINESS_ACCOUNT_ID',
    'GOOGLE_BUSINESS_LOCATION_ID',
  ];
  if (!required.every(name => process.env[name])) return null;

  const token = await getAccessToken();
  const account = encodeURIComponent(process.env.GOOGLE_BUSINESS_ACCOUNT_ID);
  const location = encodeURIComponent(process.env.GOOGLE_BUSINESS_LOCATION_ID);
  const endpoint = `https://mybusiness.googleapis.com/v4/accounts/${account}/locations/${location}/reviews?pageSize=50&orderBy=updateTime%20desc`;
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Business Profile API : ${response.status}`);
  const data = await response.json();

  return {
    name: 'The Gentleman Driver',
    rating: Number(data.averageRating || 0),
    total: Number(data.totalReviewCount || 0),
    source: 'business-profile',
    reviews: (data.reviews || [])
      .map(normaliseBusinessReview)
      .filter(review => review.text)
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)),
  };
}

async function fetchPlaceReviews() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=fr`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews',
    },
  });
  if (!response.ok) throw new Error(`Places API : ${response.status}`);
  const data = await response.json();

  return {
    name: data.displayName?.text || 'The Gentleman Driver',
    rating: Number(data.rating || 0),
    total: Number(data.userRatingCount || 0),
    source: 'places',
    reviews: (data.reviews || [])
      .map(normalisePlaceReview)
      .filter(review => review.text)
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');

  try {
    const data = await fetchBusinessProfileReviews() || await fetchPlaceReviews();
    if (!data) {
      return res.status(503).json({
        error: 'Synchronisation Google non configurée',
        configured: false,
      });
    }
    return res.status(200).json({ ...data, configured: true });
  } catch (error) {
    console.error('Google reviews sync:', error);
    return res.status(502).json({ error: 'Google temporairement indisponible' });
  }
}
