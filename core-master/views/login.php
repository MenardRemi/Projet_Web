<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <title>login</title>
<head>

<body>

<?php

if (isset($user['user']) and !empty($user['user'])) {

    echo 'Connecté '.$user['user'];
    echo '<p><a href="/logout" title="Disconnect" class="btn btn-secondary">déconnection</a></p>';
    echo '<p><a href="/map" class="btn btn-primary">Jouer</a></p>';
                
      } else{


    echo '<form action="/login" method="post">

    <fieldset>
    <legend>LOGIN</legend>
    <p><label>username:
    <input type="text" name="user">
    </label></p>
    <input type="submit" value="OK">
</fieldset>
</form>';



}

?>
    
</body>
</html>