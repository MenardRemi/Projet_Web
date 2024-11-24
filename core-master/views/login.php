<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>login</title>
  <link rel="stylesheet" href="../assets/login.css">
<head>

<body>


 
<?php

if (isset($user['user']) and !empty($user['user'])) {

    echo 'Connecté '.$user['user'];
    echo '<p><a href="/logout" title="Disconnect">déconnection</a></p>';

                
      } else{


    echo '<div class="fenetre-login">
    <form action="/login" method="post">

    <fieldset>
    <legend>LOGIN</legend>
    <p><label>username:
    <input type="text" name="user">
    </label></p>
    <input type="submit" value="OK">
</fieldset>
</form>
</div> 
';

}

?>


    
</body>
</html>