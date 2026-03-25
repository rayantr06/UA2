# Plan de travail

## Objectif

Organiser proprement le travail avant de commencer le frontend React afin de respecter exactement les consignes du professeur et de repartir le projet entre 3 personnes.

## Methode retenue

La meilleure methode ici est:
- un seul depot GitHub
- un backend fourni conserve tel quel
- un frontend React dans un dossier separe
- une repartition par blocs fonctionnels correspondant aux tables
- une gestion des taches avec GitHub Issues et GitHub Projects

Pas besoin de Jira pour ce projet. GitHub suffit et correspond mieux a ce que le professeur veut evaluer.

## Repartition par membre

### Membre 1
Responsable de:
- Departments
- Subjects

Pages a produire:
- `/departments`
- `/departments/new`
- `/departments/:id`
- `/subjects`
- `/subjects/new`
- `/subjects/:id`

Responsabilites:
- CRUD complet
- validations des formulaires
- recherche et pagination sur ces modules
- reutilisation des composants partages

### Membre 2
Responsable de:
- Laboratories
- Equipment

Pages a produire:
- `/laboratories`
- `/laboratories/new`
- `/laboratories/:id`
- `/equipment`
- `/equipment/new`
- `/equipment/:id`

Responsabilites:
- CRUD complet
- gestion des images
- adaptation responsive sur ses ecrans
- integration propre avec les relations de laboratoire

### Membre 3
Responsable de:
- Users
- Roles
- Authentification frontend
- Redux et protection des routes

Pages a produire:
- `/login`
- `/dashboard`
- `/users`
- `/users/new`
- `/users/:id`
- `/roles`
- `/roles/new`
- `/roles/:id`

Responsabilites:
- CRUD complet users/roles
- stockage du token
- logout
- configuration Axios
- route guard

## Taches communes

Ces taches doivent etre visibles dans le travail d'equipe:
- creation du projet React
- configuration React Router
- configuration Redux Toolkit
- creation du layout global
- composants reutilisables
- integration finale
- tests manuels
- README final

## Backlog GitHub Issues

### Setup commun
1. Initialiser le frontend React
2. Installer les dependances: Router, Redux, Axios, React Hook Form, Yup
3. Mettre en place la structure du projet
4. Creer le layout global
5. Configurer Redux
6. Configurer l'authentification frontend
7. Ajouter la protection des routes

### Modules fonctionnels
8. Creer le CRUD Departments
9. Creer le CRUD Subjects
10. Creer le CRUD Laboratories
11. Creer le CRUD Equipment
12. Creer le CRUD Users
13. Creer le CRUD Roles

### Qualite
14. Ajouter les validations des formulaires
15. Ajouter pagination et recherche
16. Harmoniser les composants reutilisables
17. Faire les tests d'integration
18. Finaliser README et demonstration

## Ordre de developpement

1. Ecrire la repartition du travail dans le README
2. Initialiser le frontend
3. Mettre en place Router + Redux + Axios
4. Faire login + logout + routes protegees
5. Faire le layout global
6. Developper les modules par membre
7. Ajouter validations
8. Ajouter pagination, recherche, gestion d'erreur
9. Tester tout le parcours
10. Corriger les bugs d'integration
11. Finaliser le depot et la demonstration

## Notes techniques sur le backend

- Le backend fourni contient les routes necessaires pour les 6 tables principales.
- Certaines routes sont protegees par token ou par role.
- La base SQLite actuelle contient deja des utilisateurs et des departements.
- Les roles ne sont pas encore prets dans la base, donc il faudra prevoir des donnees de test pour valider correctement l'autorisation.

## Resultat attendu avant de coder

Avant la premiere ligne de frontend, l'equipe doit avoir:
- la repartition des membres ecrite
- les branches definies
- les issues creees
- le plan de travail valide
- le backend localement lance et teste

