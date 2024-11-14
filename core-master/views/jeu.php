<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>carte</title>
  <script src="https://cdn.jsdelivr.net/npm/vue"></script>

  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    

<style>

ul {
  list-style-type: none; /* Supprimer les points devant les éléments de la liste */
}

#map { 
        width: 100%;
        height: 100%;
}

body {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0;
        font-family: Arial, sans-serif;
        background-color: #9c9700; 
        color: white; /* Texte en blanc pour visibilité */
        }

/* Titre */
.title {
    font-size: 2rem;
    margin-top: 20px;
    text-align: center;
    font-weight: bold;
v    color: #333;
    }

/* Conteneur de la carte */
.map-container {
        flex:1;
        width: 90%;
        max-width: 1000px; /* Limite la taille maximum */
        margin-top: 10px;
        overflow: hidden;
        height: calc(100vh - 100px);
        }

/* Conteneur principal pour la carte et l'inventaire */
    .app-container {
            display: flex;
            justify-content: center;
            align-items: stretch; /* Aligne les éléments à la même hauteur */
            width: 90%;
            height: calc(100vh - 100px);

        }

/* Styles pour la section de l’inventaire */
    .inventory {
            width: 20%; /* L'inventaire prendra 20% de la largeur de la fenêtre */
            max-width: 250px; /* Limite de largeur maximale */
            min-width: 100px; /* Limite de largeur minimale */
            background-color: #9c9700;
            margin-top: 10px;
            height: 100%; /* Pour correspondre à la hauteur de la carte */
            display: flex;
            flex-direction: column;
            align-items: center; /* Centre les éléments dans l'inventaire */
            overflow-y: auto;
            padding: 10px;
        }

    .inventory-image {
        max-width: 90%; /* L'image prendra 90% de la largeur de l'inventaire */
        max-height: 90%; /* Limite également la hauteur */
        height: auto; /* Maintient les proportions de l'image */
        object-fit: contain;
        margin: 10px;
    }



</style>

</head>

<body>

<!-- Titre de la page -->
<div class="title">La Quête du Disque Volé</div>

<div id = 'app1' class="app-container">

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

        

</div>













<script src = "assets/jeu.js"></script>

</body>
</html>