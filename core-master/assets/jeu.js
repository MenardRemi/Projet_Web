Vue.createApp({
    data() {
        return {
            map: null, // carte
            geoserverWMS: null, // couche WMS
            objets: [], // Objets récupérés depuis l'API
            markers: [], // Marqueurs associés aux objets
            Inventory: [], // Inventaire des objets récupérés
            selectedItem: null, // Élément sélectionné dans l'inventaire
            timer: null, // timer
            elapsedTime: 0, // Temps écoulé en secondes
            gagne:false,
        };
    },
    computed: {
        // Formate le temps écoulé en HH:MM:SS
        formattedTime() {
            const hours = String(Math.floor(this.elapsedTime / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((this.elapsedTime % 3600) / 60)).padStart(2, '0');
            const seconds = String(this.elapsedTime % 60).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        },
        // Affiche le texte
        afficherText() {
            return this.selectedItem?.texte;
        },
    },
    methods: {


        /* INTIALISATION DU JEU */


        // Initialise la carte Leaflet et la couche WMS
        initMap() {
            this.map = L.map('map').setView([48.841335, 2.587347], 4);
            this.featureGroup = L.featureGroup().addTo(this.map);

            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & contributors',
            }).addTo(this.map);

            this.geoserverWMS = L.tileLayer.wms("http://localhost:8080/geoserver/jeu_disque/wms", {
                layers: 'jeu_disque:objets',
                format: 'image/png',
                transparent: true,
                attribution: "Données via GeoServer",
                tiled: true,
                version: '1.1.1',
            });

            // Appelle les objets
            this.fetchObjets();
            
            // Gère l'affichage des icônes à chaque changement de zoom
            this.map.on('zoomend', this.checkZoomAndDisplayObjects);
        },

        // Récupère les objets depuis l'API
        fetchObjets() {
            fetch('http://localhost:8888/api/objets')
                .then(response => response.json())
                .then(data => {
                    this.objets = data;
                    this.createMarkers(); // Crée les marqueurs pour les objets
                    this.checkZoomAndDisplayObjects(); // Vérifie le zoom initial
                })
                .catch(error => console.error("Erreur lors de la récupération des objets:", error));
        },

        // Crée des marqueurs pour chaque objet
        createMarkers() {
            this.objets.forEach(objet => {
                if (objet.icone && objet.latitude && objet.longitude) { // si l'objet a bien les propriétés nécessaires à sa création
                    // Création de l'objet icône
                    const icon = L.icon({
                        iconUrl: objet.icone,
                        iconSize: [50, 50],
                        iconAnchor: [25, 50],
                        popupAnchor: [0, -50],
                    });
                    // Création du marqueur
                    const marker = L.marker([objet.latitude, objet.longitude], { icon }); //{ keepInView: true }
                    
                    // Ajout du marqueur avec
                    this.markers.push({ marker, objet }); // Associe le marqueur à l'objet

                    // Si le marqueur est cliqué alors on le gère
                    marker.on('click', () => this.onMarkerClick(objet));
                }
            });
        },


        /* GESTION DU CLIC SUR UN OBJET */


        // Gérer le clic sur un marqueur
        onMarkerClick(objet) {
            if (objet.recuperable == "t" && objet.remove == "f") { // Si l'objet est récupérable et qu'il n'est pas retiré de la carte
                // Ajout à l'inventaire
                this.addImageToInventory(objet);
            }

            if (objet.code) { // Si l'objet dispose d'un dispositif de code
                // Demande au joueur de rentrer un code
                this.askForCode(objet);
            }

            if (objet.texte) {// si l'objet a un texte on l'affiche
                this.selectedItem = objet;
                this.selectedItem.showText = true;
            };
        },

        // Ajoute un objet à l'inventaire
        addImageToInventory(objet) {
            this.Inventory.push(objet);
            objet.remove = "t"; // Marque l'objet comme supprimé
            if (objet.objet_nom != "piece"){ 
                this.unlockObjectOnMap(objet); // Débloque les objets liés
            }
            else{
                this.checkZoomAndDisplayObjects();
            }
        },

        // Retire un objet de l'inventaire
        removeImageFromInventory(objet) {
            // Récupère l'index de l'objet dans l'inventaire
            const index = this.Inventory.indexOf(objet);
            if (index !== -1) {
                this.Inventory.splice(index, 1);
            }
            // MAJ de l'affichage des objets
            this.checkZoomAndDisplayObjects();
        },

        // Demande un code pour débloquer un objet
        askForCode(objet) {
            const code = prompt("Entrez un code à 4 chiffres");
            if (code && code === objet.code) { // Code bon
                objet.remove = "t"; // on retire le coffre fermé de la carte
                this.unlockObjectOnMap(objet);
            } else {
                alert("Code incorrect !");
            }
        },

        // Débloque un objet sur la carte
        unlockObjectOnMap(objet) {
            const ObjetsBloques = this.objets.filter(obj => obj.bloque === objet.id);
            ObjetsBloques.forEach(bloque => {
                bloque.remove = "f";
            })
            // MAJ de l'affichage des objets
            this.checkZoomAndDisplayObjects();
        },

        // Sélectionner un objet dans l'inventaire
        selectItem(item) {
            this.selectedItem = item;
        },

        // Gérer le dépôt d'un objet de l'inventaire sur la carte
        Drop(event) {
            const dropX = event.clientX;
            const dropY = event.clientY;

            // Recherche de l'objet bloqué par l'objet sélectionné
            const targetImage = this.objets.find(objet => objet.bloque === this.selectedItem.id);
            if (targetImage) {
                const targetPoint = this.map.latLngToContainerPoint(
                    L.latLng(targetImage.latitude, targetImage.longitude)
                );

                // Rayon de tolérance de glisse
                const tolerance = 300;
                if (
                    dropX >= targetPoint.x - tolerance &&
                    dropX <= targetPoint.x + tolerance &&
                    dropY >= targetPoint.y - tolerance &&
                    dropY <= targetPoint.y + tolerance
                ) {
                    // Pièce bien positionné donc disque trouvé !
                    this.unlockObjectOnMap(this.selectedItem);
                    this.removeImageFromInventory(this.selectedItem);
                    this.checkZoomAndDisplayObjects;
                } 
            }
        },


        /* GESTION DE L'AFFICHAGE DYNAMMIQUE */


        // Vérifie le zoom et affiche ou masque les objets
        checkZoomAndDisplayObjects() {
            // Récupère le niveau de zoom actuel
            const currentZoom = this.map.getZoom();

            // Boucle sur les marqueurs
            this.markers.forEach(({ marker, objet }) => {
                if (marker && objet){ // Si on a bien une valeur pour le marqueur et l'objet
                    
                    // Bon niveau de zoom et objet non supprimé de la carte
                    if (currentZoom >= objet.zoom && objet.remove == "f") { 
                        
                        // N'est pas présent sur la carte
                        if (!this.featureGroup.hasLayer(marker)) { 
                            // On l'ajoute
                            this.featureGroup.addLayer(marker);
                        }
                    } 

                    // Pas le bon niveau de zoom ou à supprimer de la carte
                    else { 

                        // Est présent sur la carte
                        if (this.featureGroup.hasLayer(marker)) { 
                            // On le retire
                            this.featureGroup.removeLayer(marker);
                        }
                    }
                }
            });

            // On parcourt l'inventaire pour repérer le disque
            this.Inventory.forEach((objet) => {
                if (objet.objet_nom === "disque"){
                    this.stopChrono();
                    this.gagne=true;
                    this.sendScore();
                }
            });
        },

        // Affiche la boîte de texte de l'objet sélectionné
        showTextBox() {
            if (this.selectedItem) {
                return true;
            } else {
                return false;
            };

        },

        // Retire la boîte de texte de l'objet sélectionné
        hideMessage() {
            this.selectedItem = null; // Enlever le texte
        },

        // Ouvrir une fenêtre avec une image en grand, pour mieux voir les objets
        openWindow(imageSrc) {
            const newWindow = window.open('', '_blank', 'width=800,height=600');
            newWindow.document.write(`
                <html>
                    <head><title>Image</title></head>
                    <body style="text-align: center; margin: 0; background: black;">
                        <img src="${imageSrc}" style="max-width: 100%; max-height: 100%;" />
                    </body>
                </html>
            `);
        },

        // Change la valeur de la triche
        changeTriche(){
            // Si la triche est activée on la retire
            if (this.map.hasLayer(this.geoserverWMS)) {
                this.map.removeLayer(this.geoserverWMS);
            }
            else{ // Sinon on l'ajoute
                this.geoserverWMS.addTo(this.map);
            }
        },


        /* GESTION DU CHRONOMETRE */
        

        // Initialiser le chronomètre
        startChrono() {
            if (!this.timer) {
                this.timer = setInterval(() => {
                    this.elapsedTime++;
                }, 1000);
            }
        },

        // Arrêter le chronomètre
        stopChrono() {
            clearInterval(this.timer);
            this.timer = null; // Retour du tableau à 0
        },

        // Requête pour envoyer le score à la base de données
        // Méthode POST pour éviter que le joueur puisse tricher
        sendScore() {
            fetch('http://localhost:8888/ajoutscore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    temps: this.formattedTime, // Temps arrêté envoyé
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.success);
                } else {
                    alert(data.error);
                }
            })
            .catch(error => console.error('Erreur lors de l\'envoi du score:', error));
        },
    },
    mounted() {
        this.initMap();
        this.startChrono();
    },
}).mount('#vue_app');
