# UA2

Depot GitHub du projet d'equipe pour l'evaluation 2 en Programmation Web Avance.

Ce depot contient actuellement:
- le backend fourni par le professeur
- la documentation de planification du travail
- le plan de repartition pour une equipe de 3

Le frontend React est maintenant initialise dans le dossier `frontend/`.
Les modules Laboratories et Equipment (Personne 2) sont completes.

## Structure actuelle

```text
UA2/
|-- backend-examen2-web-avance/
|-- docs/
|   `-- PLAN_TRAVAIL.md
`-- README.md
```

## Consignes importantes du projet

Le projet doit respecter les points suivants:
- React uniquement
- pas de framework React de type Next.js ou Nuxt
- routage des pages
- formulaires et validations
- authentification et protection des routes au frontend
- utilisation obligatoire de Redux
- CRUD complet pour les tables fournies
- interface responsive
- collaboration propre via GitHub

Le document du professeur mentionne aussi une repartition claire du travail entre 3 personnes, a inclure dans la remise.

## Backend fourni

Le backend expose les entites suivantes:
- Users
- Roles
- Departments
- Subjects
- Laboratories
- Equipment

Relations principales:
- Department -> Users
- Department -> Subjects
- Department -> Laboratories
- Laboratory -> Subjects
- Laboratory -> Equipment
- User <-> Role
- User <-> Subject

## Repartition officielle du travail

### Membre 1
- Departments
- Subjects
- validation des formulaires de ces modules
- recherche, pagination et composants CRUD reutilisables sur ces pages

### Membre 2
- Laboratories
- Equipment
- gestion des images dans ces modules
- adaptation responsive de ces ecrans

### Membre 3
- Users
- Roles
- authentification frontend
- Redux global
- protection des routes
- gestion du token et des appels API

## Taches communes
- structure initiale du projet React
- layout global: navbar, sidebar, dashboard
- composants reutilisables: table, formulaire, pagination, loader, alertes
- tests finaux d'integration
- README final
- preparation de la demonstration

## Methode Git recommande

- branche principale: `main`
- une branche par grand bloc:
  - `feature/departments-subjects`
  - `feature/laboratories-equipment`
  - `feature/users-roles-auth`
- aucune modification directe sur `main`
- merge via Pull Request
- commits clairs

## Mise en route du backend

1. Aller dans le dossier backend:

```bash
cd backend-examen2-web-avance
```

2. Copier le fichier d'exemple:

```bash
copy .env.example .env
```

3. Installer les dependances:

```bash
npm install
```

4. Lancer le serveur:

```bash
npm start
```

## Remarques utiles

- Le backend fonctionne actuellement avec SQLite dans la configuration du projet.
- Certaines routes exigent authentification et roles.
- La base fournie contient des utilisateurs et des departements, mais pas encore de roles prets a l'emploi.
- Il faudra donc prevoir des donnees de test avant de valider toutes les routes protegees.
- Le nom du PDF indique `2026`, mais le contenu montre aussi des dates comme `18 mars 2025` et une remise au plus tard le `24 mars`; il faut verifier la bonne date directement sur votre plateforme de cours.

## Documentation complementaire

- [Plan de travail](./docs/PLAN_TRAVAIL.md)

