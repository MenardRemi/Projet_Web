<?php

declare(strict_types=1);
require 'flight/Flight.php';
session_start();


Flight::route('', function() {
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
});

Flight::route('/jeu', function(){
    # Récupération des objets de la bdd
    # Redirection vers le fichier jeu.php en incluant la table des objets
});

Flight::start();
?>



