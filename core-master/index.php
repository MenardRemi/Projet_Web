<?php

declare(strict_types=1);
require_once 'flight/Flight.php';
session_start();


Flight::route('GET /', function() {


    $host = 'localhost';
    $port = '5433'; // Assure-toi que le port est correct
    $dbname = 'postgres';
    $user = 'postgres';
    $password = 'postgres'; // Assure-toi que ce mot de passe est le bon

    // Chaîne de connexion
    $conn_string = "host=$host port=$port dbname=$dbname user=$user password=$password";

    // Création de la connexion
    $dbconn = pg_connect($conn_string);

    // Vérification de la connexion
    if (!$dbconn) {
        echo "Erreur de connexion à la base de données.";
    } else {
        echo "Connexion réussie à la base de données PostgreSQL!";

        /*if ($result) {
            // Parcours des résultats
            while ($row = pg_fetch_assoc($result)) {
                echo "<br>" . "nom: " . $row['nom'] . "<br>";
            }
        } else {
            echo "Erreur lors de la récupération des données.";
        }*/

        // Requête pour récupérer les 10 meilleurs scores
        $sql = "SELECT nom, temps FROM score ORDER BY temps LIMIT 10";
        
        // Exécution de la requête
        $result = pg_query($dbconn, $sql);

        // Récupération des résultats
        
        if ($result) {
            Flight::render('accueil', ['meilleursScores' => $result]);
        } else {
            echo "Erreur lors de la récupération des données.";
        }
    }


    pg_close($dbconn);

    # Connexion au serveur
    /*$host = 'localhost'; // Adresse du serveur PostgreSQL
    $dbname = 'postgres'; // Nom de la base de données
    $user = 'postgres'; // Nom d'utilisateur PostgreSQL
    $password = 'postgres'; // Mot de passe PostgreSQL

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

    */
    //Flight::render('accueil_2');
});

/*Flight::route('GET /map', function(){

    # Reconnexion à la base de donnée
    $pdo = Flight::get('db');

    # Récupération des objets de la bdd
    
    # Redirection vers le fichier map.php en incluant la table des objets
    # Le fichier javascript associé à ce fichier renverra vers la route ci-desous pour récupérer les informations des 
    # objets nécessaires
});*/

Flight::route('GET /map', function() {
    Flight::render('test_carte');
});

Flight::route('GET /api/objets', function() {
    $host = 'localhost';
    $port = '5433';
    $dbname = 'postgres';
    $user = 'postgres';
    $password = 'postgres';

    // Chaîne de connexion
    $conn_string = "host=$host port=$port dbname=$dbname user=$user password=$password";

    // Création de la connexion
    $dbconn = pg_connect($conn_string);

    if (!$dbconn) {
        echo json_encode(["error" => "Erreur de connexion à la base de données"]);
        return;
    }


    if (isset($_GET['id']) && !empty($_GET['id'])) {
        // Requête pour récupérer l'objet sélectionné
        $sql = "SELECT id, objet_nom, ST_X(ST_Transform(position, 4326)::geometry) AS longitude, ST_Y(position::geometry) AS latitude, zoom, icone, bloque, texte FROM objets WHERE id=" . pg_escape_string($_GET['id']);
    } else {
        // Requête pour récupérer tous les objets pour commencer le jeu
        $sql = "SELECT id, objet_nom, ST_X(ST_Transform(position, 4326)::geometry) AS longitude, ST_Y(position::geometry) AS latitude, zoom, icone, bloque, texte FROM objets WHERE Objet_nom IN ('poème', 'carte_postale', 'coffre_ferme', 'coffre_ouvert', 'statue')";
    }

    // Exécution de la requête
    $result = pg_query($dbconn, $sql);

    if ($result) {
        // Conversion des résultats en format JSON
        $objets = [];
        while ($row = pg_fetch_assoc($result)) {

            $objets[] = $row;
        }
        //Transmission des données JSON
        echo json_encode($objets);
        $objets = json_encode($objets);
        

    } else {
        echo json_encode(["error" => "Erreur lors de la récupération des données"]);
    }

    


    // Fermer la connexion
    pg_close($dbconn);
});




Flight::start();
?>



