<?php
// Paramètres d'initialisation
declare(strict_types=1);
require_once 'flight/Flight.php';
session_start();

// Paramètres de connexion à la BDD
$host = 'localhost';
$port = '5433';
$dbname = 'postgres';
$user = 'postgres';
$password = 'postgres';

// Chaîne de connexion
$conn_string = "host=$host port=$port dbname=$dbname user=$user password=$password";

// Création de la connexion
$conn = pg_connect($conn_string);

// Vérification de la connexion
if (!$conn){
    exit("Erreur de connexion à la base de données");
}

// Initialisation
session_start();
Flight::set('conn', $conn);


// Route vers la page d'accueil
Flight::route('GET /accueil', function() use ($conn) {
        // Requête pour récupérer les 10 meilleurs scores
        $sql = "SELECT nom, temps FROM score ORDER BY temps LIMIT 10";
        
        // Exécution de la requête
        $result = pg_query($conn, $sql);

        // Transmission des résultats à l'accueil
        if ($result) {
            Flight::render('accueil', ['meilleursScores' => $result]);
        } else {
            echo "Erreur lors de la récupération des données.";
        }
    }
);


// Route vers la page de jeu 
Flight::route('GET /map', function() {
    Flight::render('jeu');
});


// Route permettant de récupérer les objets choisis de la base de données
Flight::route('GET /api/objets', function() use ($conn) {
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        // Requête pour récupérer l'objet sélectionné
        $sql = "SELECT id, objet_nom, ST_X(coord::geometry) AS longitude, ST_Y(coord::geometry) AS latitude, zoom, icone, bloque, texte, code, remove, recuperable FROM objets WHERE id=" . pg_escape_string($_GET['id']);        
    } else {
        // Requête pour récupérer tous les objets pour commencer le jeu
        $sql = "SELECT id, objet_nom, ST_X(coord::geometry) AS longitude, ST_Y(coord::geometry) AS latitude, zoom, icone, bloque, texte, code, remove, recuperable FROM objets";
    }

    // Exécution de la requête
    $result = pg_query($conn, $sql);

    if ($result) { // Requête fonctionnelle
        // Conversion des résultats en format JSON
        $objets = [];
        while ($row = pg_fetch_assoc($result)) {
            $objets[] = $row;
        }
        //Transmission des données JSON
        echo json_encode($objets);        

    } else {
        echo json_encode(["error" => "Erreur lors de la récupération des données"]);
    }
});


// Route vers la page de login
Flight::route('GET /login', function () {
    Flight::render('login', ['user' => $_SESSION]);

});


// Route vers le jeu si l'utilisateur est rentré
Flight::route('POST /login', function () {
    if (isset($_POST['user']) and !empty($_POST['user'])) {
        $_SESSION['user'] = $_POST['user'];
        Flight::render('jeu', ['user' => $_SESSION]);} // si le nom d'utilisateur est entrée alors ouvre le jeu
        else{
            Flight::render('login', ['user' => $_SESSION]);
        }
});


// Route de déconnexion vers la page de login
Flight::route('/logout', function () {
    $_SESSION = [];
    Flight::render('login', ['user' => $_SESSION]);

});


// Route permettant d'ajouter le score à la base de données
Flight::route('POST /ajoutscore', function () use ($conn){
    if (!$conn) {
        echo json_encode(["error" => "Erreur de connexion à la base de données"]);
        return;
    }

    // Vérifie si un utilisateur est connecté
    if (isset($_SESSION['user']) && !empty($_SESSION['user'])) {
        
        // Échappement pour protéger contre les injections SQL
        $user = pg_escape_string($conn, $_SESSION['user']);

        // Vérifier si le temps est fourni
        if (isset($_POST['temps']) && !empty($_POST['temps'])) {
            $temps = isset($_POST['temps']) ? $_POST['temps'] : null;

            // Vérifie la validité du format de temps (HH:MM:SS)
            if ($_POST['temps'] === null || !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/', $temps)) {
                echo json_encode(["error" => "Format de temps invalide. Utilisez HH:MM:SS."]);
                return;
            }

            // Protection contre les injonctions SQL
            $temps = pg_escape_string($conn, $_POST['temps']);
            
            // Préparation et exécution de la requête d'insertion
            $sql = "INSERT INTO score (nom, temps) VALUES ('$user', '$temps')";
            $result = pg_query($conn, $sql);

            if (!$result) {
                echo json_encode(["error" => "Erreur lors de l'ajout du score"]);
            }
        } else {
            echo json_encode(["error" => "Le temps n'a pas été fourni"]);
        }
    } else {
        echo json_encode(["error" => "Aucun utilisateur connecté"]);
    }
});

Flight::start();
?>



