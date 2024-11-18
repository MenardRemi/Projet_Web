<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>carte</title>
  <script src="https://cdn.jsdelivr.net/npm/vue"></script>
  <link rel="stylesheet" href="../assets/jeu.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    

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