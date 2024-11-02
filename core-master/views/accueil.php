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
    <a href="/jeu" class="btn btn-primary">Jouer</a>
    <h2>Hall of fame</h2>
    <tbody>
        <?php foreach ($meilleursScores as $score): ?>
            <tr>
                <td><?= htmlspecialchars($score['joueur']); ?></td>
                <td><?= htmlspecialchars($score['temps']); ?></td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</body>
</html>