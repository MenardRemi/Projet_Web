<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>login</title>
<head>

<body>

<?php

if (isset($user['user']) and !empty($user['user'])) {

    echo 'Connecté '.$user['user'];
    echo '<p><a href="/logout" title="Disconnect">déconnection</a></p>';

                
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