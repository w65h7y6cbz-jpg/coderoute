# Cap Code — Révision Code de la route 2026

Application locale de préparation intensive à l’épreuve théorique, pensée pour une utilisation sur PC et pour le contexte Nouvelle-Calédonie. Elle privilégie la lecture attentive, la répétition adaptative et une mesure honnête de la progression. Les règles explicitement dépendantes du territoire sont marquées **« à vérifier NC »** : la signalisation en place et le référentiel officiel à jour restent prioritaires.

## Démarrer

Prérequis : Node.js 20+ et npm.

```bash
npm install
npm run dev
```

Ouvrir l’adresse affichée par Vite (habituellement `http://localhost:5173`). Pour la production :

```bash
npm run build
npm run preview
```

## Fonctionnalités

- Dashboard, compte à rebours configurable, préparation estimée et accès rapide.
- Révision rapide adaptative, entraînement par thème/difficulté, erreurs pondérées et thèmes faibles.
- Examen blanc sans correction intermédiaire, seuil configurable, bilan thématique et historique.
- Catalogue/quiz panneaux, scènes SVG d’intersection, QCM simple et multi-réponses.
- Maîtrise par question, dernières réussite/erreur, XP, série, progression journalière et statistiques.
- Raccourcis `1` à `9` pour sélectionner, `Entrée` pour valider/continuer.
- Import/export JSON et remise à zéro dans Paramètres.

## Architecture

```text
src/
├── components/      # Quiz réutilisable et illustrations SVG
├── data/            # Banque de questions locale
├── lib/             # Scoring, pondération adaptative, statistiques + tests
├── App.tsx          # Navigation et pages produit
├── store.tsx        # État React et persistance locale
├── styles.css       # Design responsive sans framework
└── types.ts         # Schéma de données extensible
```

## Données et confidentialité

Toutes les données restent dans `localStorage` sous la clé `cap-code-v1`. Aucun compte, backend, traqueur ou service payant n’est requis. L’export contient progression et banque de questions. L’import accepte une sauvegarde Cap Code et restaure l’état utilisateur.

## Ajouter une question

Modifier `src/data/questions.ts` en utilisant le constructeur `q`. Chaque entrée comporte : identifiant stable, texte, thème, sous-thème, difficulté, type, propositions, index des réponses exactes, explication, astuce et visuel optionnels, statut de vérification. Les réponses multi-choix utilisent plusieurs index. Toute règle locale non confirmée doit recevoir `à vérifier NC`.

## Visuels locaux

`src/components/Visual.tsx` génère les panneaux, routes et véhicules en SVG React : aucun fichier distant n’est téléchargé. Pour ajouter un visuel, créer une branche sur le nom reçu par la prop `name`, dessiner avec des primitives SVG, puis référencer ce nom dans la question. Les icônes d’interface sont rendues localement en SVG par Lucide.

## Qualité et évolutions

Lancer `npm test` pour tester comparaison multi-réponses, mémoire des erreurs et priorité adaptative. Évolutions possibles : banque validée par un formateur NC, service worker hors-ligne, minuterie d’examen, lecture audio et synchronisation optionnelle chiffrée.
