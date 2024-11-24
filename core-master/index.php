<?php



declare(strict_types=1);
require 'flight/Flight.php';
session_start();


$host = 'localhost';      // Hôte où PostgreSQL est installé
$port = '5432';           // Le port par défaut de PostgreSQL
$dbname = 'postgres';  // Nom de votre base de données
$user = 'postgres';    // Nom d'utilisateur PostgreSQL
$password = 'postgres';  // Mot de passe de l'utilisateur PostgreSQL

// Construire la chaîne de connexion
$conn_str = "host=$host port=$port dbname=$dbname user=$user password=$password";

// Tenter de se connecter
$conn = pg_connect($conn_str);

// Vérification de l'état de la connexion
/*
if (!$conn) {
    $error = error_get_last();
    echo "Connection failed. Error was: ".$error['message']. "\n";
} ; */

Flight::route('/jeu', function () {
    Flight::render('jeu');
});



//NOUVEAU 


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

//

Flight::start();
?>



