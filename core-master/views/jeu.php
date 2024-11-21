<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="../assets/jeu.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <title>Test affichage API</title>
</head>
<body>


<!-- Titre de la page -->
<div class="title">La Quête du Disque Volé</div>

<div id = 'vue_app' class="app-container">

    <!-- Chronomètre -->
        <div class="chrono-container">
            <h4>Chronomètre</h4>
            <div id="chrono">{{ formattedTime }}</div>
        </div>

        <div class="map-container">
            <div id = 'map'
                @dragover.prevent
                @drop="Drop($event)">
            </div> 
        </div>

        <div class="inventory">
            <h1>Inventaire</h1>
            
            <ul>
                <li v-for="(image, index) in Inventory" :key="index">
                    <img 
                    :src="image.icone" 
                    class="inventory-image"
                    @dragstart="selectItem(image)" 
                    draggable="true"
                    @click="openWindow(image.icone)" 
                    />
                </li>   
            </ul>
            
        </div>
    <div id="victoire" v-if="gagne">
        <h2>Bravo vous avez trouvé le disque !</h2>
        <a href="/accueil" class="btn btn-primary">Accueil</a>
    </div>
</div>



</body>
<script src="../assets/jeu.js"></script>
</html>