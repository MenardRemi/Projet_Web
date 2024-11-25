# Version/ Paramètre d'initialisation
- PHP : 7.4.33
- Postgresql : 17
- Changement PostgresSQL/17/data/pg_hba.conf méthode = md5 au lieu de scram-sha-256 à la fin du fichier
- Changement PostgresSQL/17/data/postgresql.conf rajouter password_encryption = md5

# A récupérer
- récupérer les tables "objets" et "score" dans sa BDD


# A modifier dans le code
Possibilités de sources de problèmes :
- Présence de fetch('http://localhost:8888/api/objets') (Dans assets/jeu.js ligne 35). Mettre votre port à la place de "8888".
- Présence de Port_SQL = 5433. Remplacer par le votre.


# Règles dans le jeu :
- Ne pas "passer la ligne de changement de date", c'est à dire, toujours rester sur la carte centrale.


# Solution de jeu :
- Le chronomètre se lance dès l'ouverture de la carte.
- A l'ENSG, Laura-Lee dit au joueur de se diriger vers l'Islande (où Clara Correia fait son stage). Clara lui indique de chercher une lettre qui se trouve dans un parc proche d'elle.
- Sur cette lettre il est indiqué d'aller au Québec (dans la ville portant le nom de sa région, soit Québec-city)
- Sur la carte postale trouvée à Québec, il est écrit le code du coffre présent à Rio de Janeiro (soit 1213). Ne pas hésiter à cliquer sur l'objet pour mieux voir le code. Une indication est donnée par Jules Faguet pour trouver le coffre.
- Le design de la pièce nous mène vers le mont Fuji, où Romain nous précise comment résoudre la dernière énigme. Il faut glisser la pièce sur la fontaine en haut du mont Fuji.
- Récupérer le disque entraîne l'arrêt du chronomètre.

