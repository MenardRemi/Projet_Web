<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <title>Login</title>
  <link rel="stylesheet" href="../assets/initialisation.css">
<head>

<body>

<?php

if (isset($user['user']) and !empty($user['user'])) {?>

  <div class="fenetre-login">
    <h2> <?php echo $user['user'] ?> est connecté</h2>
    <a href="/logout" title="Disconnect" class="btn btn-secondary">Déconnection</a>
    <a href="/map" class="btn btn-primary">Jouer</a>
  </div>
    
<?php } else{ ?>

<div class="fenetre-login">
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

<?php } ?>
    
</body>
</html>