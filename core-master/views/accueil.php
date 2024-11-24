<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="../assets/initialisation.css">
    <title>Accueil</title>
</head>
<body>
    <div id="container">
        <h1><span>La quête du disque volé</span></h1>
        <div id="jouerBtn">
            <a href="/login" id="jouerBtnlien" class="button">Jouer</a>
        </div>
        <h2>Hall of fame</h2>
        <ul>
            <?php 
            while ($row = pg_fetch_assoc($meilleursScores)) {
                    ?> <li><?php echo htmlspecialchars($row['nom']) . " : " . htmlspecialchars($row['temps']); ?></li>
            <?php } ?>
        </ul>
    </div>
    
</body>
</html>