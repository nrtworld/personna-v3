# Cahier des charges : Personna-V3

- Personna-V3 est une application web de gestionnaire de fiches personnages pour jeu de rôle. 
- elle est codée en angular
- elle est complètement responsive pour s'afficher aussi bien sur ordinateur que sur téléphone ou tablette.
- sa base de donnée est sur firebase.
- On peut se loguer sur l'app via le système d'authentification fournit par firebase.
- Une fois logué, l'utilisateur arrive sur son dashboard 
- Un petit menu ouvrable est présent en haut à droite de toute les pages et reste tout le temps visible, même lorsque l'on scroll la page. il contient un bouton pour se déconnecter et un bouton pour revenir au dashboard.

## Le dashboard 

- Contient la liste des personnages de l'utilisateurs.
- Les personnages sont présentés sous un format carte, comme des cartes type pokemon. 
- une carte affiche la photo,le nom et l'XP du personnage ainsi que le jeu auquel il appartient.
- un filtre est disponible sur la page pour trier les cartes par jeux ou par ordre alphabétique des nom de personnages.
- un champ de recherche est disponnible sur la page pour rechercher une carte en fonction du nom de perso ou du nom du jeu.
- un bouton est présent pour ouvrir le mode de création d'un nouveau personnage.
** quand on clique dessus, on doit choisir le jeu pour lequel on veux créer un personnage (la liste actuelle disponible est : 1- Le jeu d'Aimé.)
** la sélection du "1" ouvre le mode de création d'un nouveau personnage spécifique pour "le jeu d'Aimé"
- un boiton est présent pour supprimer un personnage
- un clic sur une carte ouvre la page du personnage.

## création d'un nouveau personnage

### Personnage pour "Le jeu d'Aimé"
* Une partie "Identité"
** contient nom, photo, age, points de compétences, points de vie max, point de vie restant, XP
* une partie "Statistiques de base"
** pour ajouter ou supprimer une statistique de base au personnage.
** une statistique de base est composée d'un nom, d'une description, d'un nombre de points.
** les statistiques de bases disponiblent dans le jeu sont stockées dans un référentiel dans la bdd firebase (nom + description)
* une partie "Maitrise"
** pour ajouter ou supprimer une Maitrise au personnage.
** une maitrise est composée d'un nom, d'une description, d'un nombre de points.
** les Maitrises disponiblent dans le jeu sont stockées dans un référentiel dans la bdd firebase (nom + description)
* une partie "Compétences"
** pour ajouter ou supprimer une Compétence au personnage.
** une Compétence est composée d'un nom, d'une description, d'un nombre de points et de la liste des noms des stat de base et/ou maitrise utiles pour aider a son utilisation
** les Compétences disponiblent dans le jeu sont stocké dans un référentiel dans la bdd firebase (nom + description + liste stat/maitrise)
* une partie "Trait de caractère"
** pour ajouter ou supprimer un Trait de caractère au personnage
** un Trait de caractère est composé d'un nom, d'une description
** les Traits de caractère disponiblent dans le jeu sont stocké dans un référentiel dans la bdd firebase (nom + description)
* une partie "Inventaire"
** pour ajouter ou supprimer un objet dans l'inventaire du personnage
** un objet possède au minimum un nom + une quantité.
*** possibilité de lui rajouter un nombre de dés blancs et/ou un nombre de dés rouges 
*** possibilité de lui rajouter une description
* une partie "notes"
** l'utilisater peut ajouter ou supprimer une note libre en cours de partie.

* Un bouton pour valider la création et sauvegarder le personnage en bdd.
** la validation amène le joueur sur la fiche personnage.

## La fiche personnage

**IMPORTANT : tous les changements apportés au personnage par l'utilisateur sur cette page sont instantanément sauvegardés dans la bdd.**

* Affiche de façon claire et structurée toutes les informations du personnage.
* Les descriptions des différents éléments n'apparaissent sur l'écran que via le clic sur un petit "i" d'information.
* Le niveau de vie est représenté via une barre de vie apparaissant toujours à  l'écran et dont la couleur varie du vert jusqu'au rouge en fonction de la vie restante.
* la fiche est pensée pour être utilisée en temps réel lors d'une partie de jeu de rôle. 
Il faut donc : 
** qu'un maximum d'informations soit visiblent sans scroll, même sur un téléphone.
** qu'un bouton(icon) toujours accessible dans une barre de menu en haut de l'écran permette d'ajouter ou d'enlever rapidement de la vie au personnage
** qu'un bouton(icon) toujours accessible dans une barre de menu en haut de l'écran permette d'ouvrir et fermer l'inventaire du joueur.
*** Une fois dans l'inventaire, le joueur peut ajouter, modifier ou supprimer un objet.
** qu'un bouton(icon) toujours accessible dans une barre de menu en haut de l'écran permette l'ajout rapide d'un onjet dans l'inventaire
** qu'un bouton(icon) toujours accessible dans une barre de menu en haut de l'écran permette d'ajouter un point de compétence.

* un bouton "utiliser une compétence" est disponible.
** un clique diminue le nombre de points de compétences du personnage de 1.
** le bouton n'est pas cliquable si les points de compétences sont à 0

* un toggle permet d'aller sur la page de création du personnage pour modification lorsqu'il est activé
** il apparait désactivé lorsqu'on est sur la fiche perso.
