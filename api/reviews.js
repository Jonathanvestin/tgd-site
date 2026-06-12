// api/reviews.js — Vercel Serverless Function
// Récupère les avis Google Places côté serveur (contourne le CORS)
// Place ID : ChIJ... (à confirmer une fois la fiche géolocalisée)

const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJczTzUUIzLWoR59TwldN3SsM';
const API_KEY  = process.env.GOOGLE_PLACES_API_KEY;

export default async function handler(req, res) {
  // CORS — autorise tous les domaines TGD
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=3600'); // cache 1h côté Vercel

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key manquante' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,user_ratings_total,reviews&language=fr&reviews_sort=newest&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return res.status(502).json({ error: data.status, message: data.error_message });
    }

    const { name, rating, user_ratings_total, reviews } = data.result;

    return res.status(200).json({
      name,
      rating,
      total: user_ratings_total,
      reviews: (reviews || []).map(r => ({
        author:  r.author_name,
        rating:  r.rating,
        text:    r.text,
        time:    r.relative_time_description,
        photo:   r.profile_photo_url,
      }))
    });

  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur', detail: err.message });
  }
}
