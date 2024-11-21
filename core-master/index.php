<?php

declare(strict_types=1);
require_once 'flight/Flight.php';
session_start();

$host = 'localhost';
$port = '5433';
$dbname = 'postgres';
$user = 'postgres';
$password = 'postgres';

// Chaîne de connexion
$conn_string = "host=$host port=$port dbname=$dbname user=$user password=$password";

// Création de la connexion
$conn = pg_connect($conn_string);

if (!$conn){
    exit("Erreur");
}
else{

}

session_start();

Flight::set('conn', $conn);

Flight::route('GET /accueil', function() use ($conn) {


    



    // Vérification de la connexion
    if (!$conn) {
        echo "Erreur de connexion à la base de données.";
    } else {
        

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
        $result = pg_query($conn, $sql);

        // Récupération des résultats
        
        if ($result) {
            Flight::render('accueil', ['meilleursScores' => $result]);
        } else {
            echo "Erreur lors de la récupération des données.";
        }
    }




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
    Flight::render('jeu');
});

Flight::route('GET /api/objets', function() use ($conn) {
    /*$host = 'localhost';
    $port = '5433';
    $dbname = 'postgres';
    $user = 'postgres';
    $password = 'postgres';

    // Chaîne de connexion
    $conn_string = "host=$host port=$port dbname=$dbname user=$user password=$password";*/


    if (!$conn) {
        echo json_encode(["error" => "Erreur de connexion à la base de données"]);
        return;
    }


    if (isset($_GET['id']) && !empty($_GET['id'])) {
        // Requête pour récupérer l'objet sélectionné
        $sql = "SELECT id, objet_nom, ST_X(ST_Transform(position, 3857)::geometry) AS longitude, ST_Y(ST_Transform(position, 3857)::geometry) AS latitude, zoom, icone, bloque, texte, code, remove, recuperable FROM objets WHERE id=" . pg_escape_string($_GET['id']);
        //$sql = "SELECT id, objet_nom, ST_X(position) AS longitude, ST_Y(position) AS latitude, zoom, icone, bloque, texte, code, remove, recuperable FROM objets WHERE id=" . pg_escape_string($_GET['id']);

    } else {
        // Requête pour récupérer tous les objets pour commencer le jeu
        $sql = "SELECT id, objet_nom, ST_X(ST_Transform(position, 3857)::geometry) AS longitude, ST_Y(ST_Transform(position, 3857)::geometry) AS latitude, zoom, icone, bloque, texte, code, remove, recuperable FROM objets";
        //$sql = "SELECT id, objet_nom, ST_X(position::geometry) AS longitude, ST_Y(position::geometry) AS latitude, zoom, icone, bloque, texte, code, remove, recuperable FROM objets;"

    }

    // Exécution de la requête
    $result = pg_query($conn, $sql);

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

    


});


Flight::route('GET /login', function () {
    Flight::render('login', ['user' => $_SESSION]);

});

Flight::route('POST /login', function () {
    if (isset($_POST['user']) and !empty($_POST['user'])) {
        $_SESSION['user'] = $_POST['user'];
        Flight::render('jeu', ['user' => $_SESSION]);} // si le nom d'utilisateur est entrée alors ouvre le jeu
        else{
            Flight::render('login', ['user' => $_SESSION]);
        }
});

Flight::route('/logout', function () {
    $_SESSION = [];
    Flight::render('login', ['user' => $_SESSION]);

});

Flight::route('POST /ajoutscore', function () use ($conn){

    if (!$conn) {
        echo json_encode(["error" => "Erreur de connexion à la base de données"]);
        return;
    }
    /*if (isset($_POST['user']) and !empty($_POST['user'])) {
        if (isset($_POST['temps']) and !empty($_POST['temps'])) {
            $sql = "INSERT INTO score (nom, temps) VALUES ($_POST['user'], $_POST['temps']);";
        }
    
    }
    // Exécution de la requête
    $result = pg_query($conn, $sql);
    if (!$result){
        echo "erreur lors de l'ajout du chrono du joueur $_POST['user']";
    }*/

    // Vérifier si un utilisateur est connecté
    if (isset($_SESSION['user']) && !empty($_SESSION['user'])) {
        $user = pg_escape_string($conn, $_SESSION['user']);

        // Vérifier si le temps est fourni
        if (isset($_POST['temps']) && !empty($_POST['temps'])) {
            $temps = isset($_POST['temps']) ? $_POST['temps'] : null;

            // Valider le format du temps (HH:MM:SS)
            if ($_POST['temps'] === null || !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/', $temps)) {
                echo json_encode(["error" => "Format de temps invalide. Utilisez HH:MM:SS."]);
                return;
            }

            // Échappement pour protéger contre les injections SQL
            $temps = pg_escape_string($conn, $_POST['temps']);
            
            // Préparer et exécuter la requête d'insertion
            $sql = "INSERT INTO score (nom, temps) VALUES ('$user', '$temps')";
            $result = pg_query($conn, $sql);

            if ($result) {
                echo json_encode(["success" => "Score ajouté avec succès pour l'utilisateur $user"]);
            } else {
                echo json_encode(["error" => "Erreur lors de l'ajout du score"]);
            }
        } else {
            echo json_encode(["error" => "Le temps n'a pas été fourni"]);
        }
    } else {
        echo json_encode(["error" => "Aucun utilisateur connecté"]);
    }
});

//pg_close($conn);
Flight::start();
?>



