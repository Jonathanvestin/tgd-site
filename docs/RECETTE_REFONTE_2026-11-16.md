# Recette de la refonte TGD — 16 novembre 2026

Statut : prévisualisation uniquement. Aucun accord de publication déduit des validations de progression.

## Vérifications réalisées

- 38 URL du sitemap : HTTP 200 sur la prévisualisation du commit e2ce93da68d0e92d530df732ff03b5962874a9a5.
- Titres uniques ; une description, une URL canonique, un H1 et un main par page du sitemap.
- Aucun lien interne ni fragment introuvable dans les destinations locales analysées ; aucun doublon d’identifiant HTML ni de chargement de script sur ces pages.
- JSON-LD syntaxiquement valide. Ce contrôle ne constitue pas une certification des résultats enrichis Google.
- Aucun ancien numéro 07 61 09 26 26 trouvé dans les fichiers HTML/JS/JSON ; numéro actuel 07 63 69 52 57.
- Rapport PDF anonymisé, robots.txt et sitemap.xml : HTTP 200.
- Dix pages locales contrôlées à 1363 px et 340 px : absence de débordement après chargement. FAQ accessibles au clavier. Les dix titres SEO et canoniques ont été conservés.
- Pages métiers et parcours Contact vérifiés lors des étapes précédentes : navigation, PDF, présélections, étapes, validation à vide et retour. Tests réels antérieurs reçus en boîte de réception, hors spam. Aucun nouvel envoi réel pendant cette recette globale.

## Correctif de cette passe

Le point /_vercel/insights/script.js renvoie HTTP 404 sur la prévisualisation. Suppression des appels sur Accueil et Contact. Aucun mécanisme de suivi fonctionnel n’est remplacé ; l’activation éventuelle de Web Analytics reste à configurer et à tester séparément.

## Points commerciaux à faire confirmer avant publication

Les contenus historiques suivants sont conservés, car leur modification peut changer la présentation des engagements :

- Validé par Jonathan : un ou plusieurs convoyeurs peuvent être attitrés à un client. Facturation définie en fonction de chaque client ; les mentions de facturation mensuelle systématique ont été remplacées sur Lyon et Toulouse.
- Lyon : formulations « chaque jour » et arrivée à l’heure prévue. Confirmer leur exactitude ou valider une formulation conditionnée aux contraintes de mission.
- Corrigé selon Jonathan : aucune offre de plateau fermé. Les mentions de cette offre ont été retirées de la page Prestige et de son schéma FAQ ; transport sur plateau étudié sur devis. Le périmètre du protocole photographique exhaustif reste à confirmer.
- Montants chauffeur conservés : courte prestation 390 € TTC à partir de ; longue distance 650 € HT / 780 € TTC la journée à partir de ; majoration électrique de 20 % selon conditions sur la page longue distance.

## Limites

- Aucun test sur téléphone physique ; petite largeur testée dans le navigateur.
- Pas de score Lighthouse ni de mesure Core Web Vitals : quota PageSpeed rencontré lors de l’audit initial. Ne pas annoncer de gain mesuré de vitesse.
- Aucun bilan Search Console ni garantie de positionnement ou de présence dans les réponses IA.
- Blog et mentions légales répondent et passent les vérifications structurelles ; cela ne constitue ni une refonte visuelle de chaque article ni une validation juridique des contenus.
- /convoyage-premium reste redirigé vers /convoyage-luxe ; pas de nouvelle page concurrente indexable.
- Prévisualisations Vercel protégées selon leur URL ; accès temporaire utilisé pour les vérifications. Ne pas retirer la protection du projet.

## Publication future

Après validation des points commerciaux et du résultat global : conserver le commit de retour arrière, vérifier les changements intervenus sur main, fusionner seulement sur instruction explicite, puis contrôler la production, ses formulaires et son indexabilité. Ne pas promouvoir la prévisualisation pendant cette recette.
