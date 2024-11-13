

/*Vue.createApp({
    data() {
        return {

        };
    },
    methods: {
        affichage() {
            afficher_map();
            //afficher_objet(obj);
        },
        afficher_map(){
            var map = L.map('map').setView([-22.77, -43.21], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
        },
        afficher_objet (item) {
            
        }
         
}}).mount('#map');*/

/*Vue.createApp({
    data() {
        return {
            map: null,
            objets: [], // Stocker les objets récupérés depuis l'API
            markers: [] // Stocke les marqueurs pour pouvoir les gérer
        };
    },
    methods: {
        initMap() {
            // Initialisation de la carte
            this.map = L.map('map').setView([-22.77, -43.21], 9);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            // Récupération des objets depuis l'API
            this.fetchObjets();

            // Détecter le changement de niveau de zoom
            this.map.on('zoomend', this.checkZoomAndDisplayObjects);
        },
        fetchObjets() {
            fetch('http://localhost:8888/api/objets')
                .then(response => response.json())
                .then(data => {
                    console.log("Objets récupérés:", data); // Affiche les données récupérées
                    this.objets = data; // Charger les objets depuis l'API
                    this.checkZoomAndDisplayObjects();
                })
                .catch(error => console.error("Erreur lors de la récupération des objets:", error));
        },
        checkZoomAndDisplayObjects() {
            const currentZoom = this.map.getZoom();

            // Supprime tous les marqueurs existants
            this.markers.forEach(marker => this.map.removeLayer(marker));
            this.markers = []; // Réinitialise le tableau de marqueurs

            // Affiche uniquement les marqueurs dont le niveau de zoom requis est atteint
            this.objets.forEach(objet => {
                if (currentZoom >= objet.zoom) {
                    this.displayObject(objet);
                }
            });
        },
        displayObject(objet) {
            // Configuration de l'icône personnalisée
            const icon = L.icon({
                iconUrl: "image/" + objet.icone, // URL de l'icône à partir du JSON
                iconSize: [32, 32], // Taille de l'icône
                iconAnchor: [16, 32], // Ancre de l'icône
                popupAnchor: [0, -32] // Position de la bulle d'information
            });

            // Ajout de l'objet sous forme de marqueur avec l'icône personnalisée
            const marker = L.marker([objet.latitude, objet.longitude], { icon })
                    .addTo(this.map)
                    .bindPopup(`<b>${objet.texte}</b>`, { autoPan: false });

                this.markers.push(marker); // Ajoute le marqueur à la liste
        }
    },
    mounted() {
        this.initMap();
    }
}).mount('#map');*/

Vue.createApp({
    data() {
        return {
            map: null,
            // objets = images chez karine
            objets: [], // Stocke les objets récupérés depuis l'API
            markers: [], // Stocke les marqueurs pour pouvoir les gérer
            Inventory: []
        };
    },
    methods: {
        initMap() {
            this.map = L.map('map').setView([-22.77, -43.21], 9);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            this.fetchObjets();

            // Mettre à jour l'affichage des icônes à chaque changement de zoom
            this.map.on('zoomend', this.checkZoomAndDisplayObjects);
        },
        fetchObjets() {
            fetch('http://localhost:8888/api/objets')
                .then(response => response.json())
                .then(data => {
                    this.objets = data;
                    this.createMarkers(); // Crée les marqueurs une fois
                    this.checkZoomAndDisplayObjects(); // Vérifie les marqueurs en fonction du zoom initial
                })
                .catch(error => console.error("Erreur lors de la récupération des objets:", error));
        },
        createMarkers() {
            // Crée un marqueur pour chaque objet et l'ajoute au tableau
            this.objets.forEach(objet => {
                if (objet.icone && objet.latitude && objet.longitude) {
                    const icon = L.icon({
                        iconUrl: "image/" + objet.icone,
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32]
                    });

                    const marker = L.marker([objet.latitude, objet.longitude], { icon })
                        .bindPopup(`<b>${objet.texte}</b>`, { keepInView: true }); // Évite de recentrer la carte

                    this.markers.push({ marker, minZoom: objet.zoom }); // Associe le marqueur et son zoom minimum
                } else {
                    console.warn("L'objet est manquant des informations nécessaires:", objet);
                }
            });
        },
        checkZoomAndDisplayObjects() {
            const currentZoom = this.map.getZoom();

            this.markers.forEach(({ marker, minZoom }) => {
                if (currentZoom >= minZoom) {
                    // Affiche le marqueur si le niveau de zoom actuel est suffisant
                    if (!this.map.hasLayer(marker)) {
                        this.map.addLayer(marker);
                    }
                } else {
                    // Masque le marqueur si le niveau de zoom actuel est trop bas
                    if (this.map.hasLayer(marker)) {
                        this.map.removeLayer(marker);
                    }
                }
            });
        }
    },
    mounted() {
        this.initMap();
    }
}).mount('#map');

