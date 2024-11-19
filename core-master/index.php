<?php



declare(strict_types=1);
require 'flight/Flight.php';
session_start();


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



