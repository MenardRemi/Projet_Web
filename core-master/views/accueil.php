<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <title>Accueil</title>
</head>
<body>
    <h1>La quête du disque volé</h1>
    <a href="/map" class="btn btn-primary">Jouer</a>
    <h2>Hall of fame</h2>
    <ul>
        <?php 
        while ($row = pg_fetch_assoc($meilleursScores)) {
                ?> <li><?php echo htmlspecialchars($row['nom']) . " : " . htmlspecialchars($row['temps']); ?></li>
        <?php } ?>
    </ul>
</body>
</html>