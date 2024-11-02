<?php



declare(strict_types=1);
require 'flight/Flight.php';
session_start();


Flight::route('', function() {

    Flight::render('accueil');
});

Flight::start();
?>



