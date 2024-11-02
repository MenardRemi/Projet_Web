<?php

declare(strict_types=1);
require 'flight/Flight.php';
session_start();


Flight::route('', function() {
    # Connexion au serveur
    $host = 'localhost'; // Adresse du serveur PostgreSQL
    $dbname = 'postgres'; // Nom de la base de données
    $user = 'postgres'; // Nom d'utilisateur PostgreSQL
    $password = 'md5'; // Mot de passe PostgreSQL

    try {
        // Création de la connexion PDO
        $pdo = new PDO("pgsql:host=$host;port=5433;dbname=$dbname", $user, $password);
        
        // Configuration des options de PDO (par exemple, pour afficher les erreurs)
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        echo "Connexion réussie à PostgreSQL !";

        # Enregistrement du lien à la BDD
        Flight::set('db', $pdo);

    } catch (PDOException $e) {
        echo "Erreur de connexion : " . $e->getMessage();
    }




    // Requête pour récupérer les 10 meilleurs scores
    $sql = "SELECT joueur, temps FROM scores ORDER BY temps DESC LIMIT 10";
    
    // Exécution de la requête
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Récupération des résultats
    $meilleursScores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
    }

    Flight::render('accueil', ['meilleursScores' => $meilleursScores]);
    Flight::render('accueil');
});

Flight::route('GET /map', function(){

    # Reconnexion à la base de donnée
    $pdo = Flight::get('db');

    # Récupération des objets de la bdd
    
    # Redirection vers le fichier map.php en incluant la table des objets
    # Le fichier javascript associé à ce fichier renverra vers la route ci-desous pour récupérer les informations des 
    # objets nécessaires
});

Flight::route('GET /api/objets', function(){

    if (isset($_GET['id']) && !empty($_GET['id'])) {
        // Requête pour récupérer l'objet sélectionné
        $sql = "SELECT Objet_nom FROM objets WHERE id=$_GET['id']";
    }
    else{
        // Requête pour récupérer tous les objets pour commencer le jeu
        $sql = "SELECT Objet_nom FROM objets WHERE Objet_nom='poème' OR Objet_nom='carte_postale' OR Objet_nom='coffre' OR Objet_nom='statue'";
    }

    // Exécution de la requête
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    // Récupération des résultats
    $Objets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Renvoie dans la console les objets sélectionnés sous format JSON
});



Flight::start();
?>



