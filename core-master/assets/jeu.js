Vue.createApp({
    data() {
        return {
            map: null,
            objets: [], // Objets récupérés depuis l'API
            markers: [], // Marqueurs associés aux objets
            Inventory: [], // Inventaire des objets récupérés
            selectedItem: null, // Élément sélectionné dans l'inventaire
        };
    },
    methods: {
        // Initialiser la carte Leaflet
        initMap() {
            this.map = L.map('map').setView([-22.776993, -43.211614], 9);
            this.featureGroup = L.featureGroup().addTo(this.map);

            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & contributors',
            }).addTo(this.map);


            this.fetchObjets();
            

            // Gérer l'affichage des icônes à chaque changement de zoom
            this.map.on('zoomend', this.checkZoomAndDisplayObjects);

            /*this.map.on('error', (event) => {
                console.error("Erreur Leaflet détectée :", event.error);
            });*/
        },

        // Récupérer les objets depuis l'API
        fetchObjets() {
            fetch('http://localhost:8888/api/objets')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.objets = data;
                    this.createMarkers(); // Crée les marqueurs pour les objets
                    this.checkZoomAndDisplayObjects(); // Vérifie le zoom initial
                })
                .catch(error => console.error("Erreur lors de la récupération des objets:", error));
        },

        // Créer des marqueurs pour chaque objet
        createMarkers() {
            this.objets.forEach(objet => {
                console.log("Objet à traiter :", objet); // Débogage
                if (objet.icone && objet.latitude && objet.longitude) {
                    const icon = L.icon({
                        iconUrl: objet.icone,
                        iconSize: [50, 50],
                        iconAnchor: [25, 50],
                        popupAnchor: [0, -50],
                    });
                    const marker = L.marker([objet.latitude, objet.longitude], { icon }); //{ keepInView: true }
                    
                    
                    console.log(`Marqueur créé pour : ${objet.texte}`);

                    this.markers.push({ marker, image: objet }); // Associe le marqueur à l'objet

                    marker.on('click', () => this.onMarkerClick(marker, objet));
                }
            });
        },

        // Gérer le clic sur un marqueur
        onMarkerClick(marker, objet) {
            console.log(objet.recuperable);
            console.log(objet.objet_nom);
            if (objet.recuperable == "t" && objet.remove == "f") {
                console.log("laaaaa");
                this.addImageToInventory(objet);
                //this.map.removeLayer(marker); // Retirer l'icône de la carte
                //this.featureGroup.removeLayer(marker);
            }

            if (objet.code) {
                
                console.log("code");
                this.askForCode(marker, objet);
            }
            //this.checkZoomAndDisplayObjects();
        },

        // Ajouter un objet à l'inventaire
        addImageToInventory(image) {
            this.Inventory.push(image);
            image.remove = "t"; // Marque l'objet comme supprimé
            this.unlockObjectOnMap(image); // Débloque les objets liés
        },

        // Retirer un objet de l'inventaire
        removeImageFromInventory(image) {
            const index = this.Inventory.indexOf(image);
            if (index !== -1) {
                this.Inventory.splice(index, 1);
            }
        },

        // Demander un code pour débloquer un objet
        askForCode(marker, objet) {
            const code = prompt("Entrez un code à 4 chiffres");
            if (code && code === objet.code) {
                //this.map.removeLayer(marker);
                objet.remove = "t"; // on retire le coffre fermé de la carte
                this.unlockObjectOnMap(objet);
            } else {
                alert("Code incorrect !");
            }
        },

        // Débloquer un objet sur la carte
        unlockObjectOnMap(image) {
            const ObjetsBloques = this.objets.filter(obj => obj.bloque === image.id);
            ObjetsBloques.forEach(bloque => {
                console.log("bloqueeeeeeeee");
                bloque.remove = "f";
            })
            this.checkZoomAndDisplayObjects();
        },

        // Vérifier le zoom et afficher ou masquer les objets
        checkZoomAndDisplayObjects() {
            const currentZoom = this.map.getZoom();
            //const currentZoom = this.featureGroup.getZoom();
            console.log()

            this.markers.forEach(({ marker, image }) => {
                console.log("valeur remove :", image.remove);
                if (marker && image){
                    console.log(image.objet_nom, image.zoom, image.remove);
                    if (currentZoom >= image.zoom && image.remove == "f") { // Bon niveau de zoom + pas supprimé de la carte
                        console.log("zoom OKKKKKKKKKK");
                        console.log(this.featureGroup.hasLayer(marker));
                        //marker.addTo(this.featureGroup);
                        if (!this.featureGroup.hasLayer(marker)) {
                            console.log(`Ajout du marqueur pour : ${image.objet_nom}`);
                            this.featureGroup.addLayer(marker);
                            //this.featureGroup.addLayer(marker);
                        }
                    } else { // pas bon niveau de zoom ou à supprimer de la carte
                        console.log("zoom pas ok ou à supp de la carte");
                        console.log(this.featureGroup.hasLayer(marker));
                        if (this.featureGroup.hasLayer(marker)) {
                            console.log(`Retrait du marqueur pour : ${image.objet_nom}`);
                            //marker.remove(this.featureGroup);
                            this.featureGroup.removeLayer(marker);
                            //this.featureGroup.removeLayer(marker);
                        }
                    }
                }
            });
        },

        // Ouvrir une fenêtre avec une image en grand
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

        // Sélectionner un objet dans l'inventaire
        selectItem(item) {
            this.selectedItem = item;
        },

        // Gérer le dépôt d'un objet sur la carte
        Drop(event) {
            const dropX = event.clientX;
            const dropY = event.clientY;

            const targetImage = this.objets.find(image => image.bloque === this.selectedItem.objet);
            if (targetImage) {
                const targetPoint = this.map.latLngToContainerPoint(
                    L.latLng(targetImage.latitude, targetImage.longitude)
                );

                const tolerance = 50;
                if (
                    dropX >= targetPoint.x - tolerance &&
                    dropX <= targetPoint.x + tolerance &&
                    dropY >= targetPoint.y - tolerance &&
                    dropY <= targetPoint.y + tolerance
                ) {
                    this.unlockObjectOnMap(this.selectedItem);
                    this.removeImageFromInventory(this.selectedItem);
                }
            }
        },
    },
    mounted() {
        this.initMap();
    },
}).mount('#vue_app');
