
/*
map = L.map('map').setView([-71.210461, 46.812867], 15);
let featureGroup = L.featureGroup().addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & contributors'}).addTo(map);
//afficher une image
var popup = L.popup();


var imageIcon = L.marker([48.71256,  2.585735], { icon: L.icon({
    iconUrl: 'image/canettes.png', // Chemin vers votre image
    iconSize: [50, 50], // Taille de l'image
    iconAnchor: [25, 50], // Point d'ancrage
    popupAnchor: [0, -50] // Ancrage du popup
}) }).addTo(map);

*/

Vue.createApp({
    data() {
        return {
            images: [ //objets de Rémi
            {objet : 'canettes', position :[-71.210461, 46.812867], zoom :'14',icone : 'image/canettes.png',  recuperable : false, text : '', code : '', bloque: '', remove:false},
            {objet : 'carte postale', position :[-43.277614, -22.776993], zoom :'15', icone : 'image/carte_postale.png', recuperable : true, text : '', code : '', bloque:'', remove:false},
            {objet : 'coffre ferme', position :[-22.776993, -43.211614], zoom :'15', icone : 'image/coffre_ferme.png', recuperable : false, text : '', code :'1213', bloque: 'carte postale', remove:true},
            {objet : 'coffre ouverte', position :[-22.776993, -43.211614], zoom :'15', icone : 'image/coffre_ouverte.png', recuperable : false, text : '', code :'', bloque: 'coffre ferme', remove:true},
            {objet : 'piece', position :[-22.776993, -43.211614], zoom :'15', icone : 'image/piece.png', recuperable : true, text : '', code :'', bloque: 'coffre ouverte', remove:true},
            {objet : 'fontaine du mont fuji', position :[2.587624, 48.84139], zoom :'11', icone : 'image/fontaine_mont_fuji.png', recuperable : false, text : '', code :'', bloque: 'piece', remove:true},
            {objet : 'disque', position :[2.587624, 48.84139], zoom :'11', icone : 'image/disque.png', recuperable : true, text : '', code :'', bloque:'fontaine du mont fuji', remove:true},
    
        ],
            
            Inventory: [],
            markers : [],
            selectedItem : null,
            
        };
    },

 
    methods : {


        afficherImage(image) {

            
            // Créer une icône à partir de l'image
            var imageIcon = L.icon({
                iconUrl: image.icone, // Chemin vers votre image
                iconSize: [50, 50], // Taille de l'image
                iconAnchor: [25, 50], // Point d'ancrage
                popupAnchor: [0, -50] // Ancrage du popup
            });

            var marker = L.marker(image.position, { icon: imageIcon }).addTo(this.map );
            this.markers.push(marker);

            marker.on('click', () => {
                if (image.recuperable) { // si l'objet est récupérable on le récupère et on le met dans l'inventaire
                    this.selectedImageSrc = image.icone;
                    this.addImageToInventory(image);
                    this.Refresh();
                    //marker.remove(); // l'objet disparait de la carte

                };

                if (image.code){ // si l'objet possède un code alors demander
                    this.askForCode(marker);
                };
            });
        },

            addImageToInventory(image) {
                this.Inventory.push(image); // rajouter les images dans l'inventaire
                image.remove = true;
                //console.log(image.remove);
                this.unlockObjectOnMap(image); // ne plus l'afficher 
            },

            removeImageFromInventory(image) {
                const index = this.Inventory.indexOf(image);
                if (index !== -1) {
                    this.Inventory.splice(index, 1); // Supprime l'image de l'inventaire
                }
            },

            askForCode(marker) {
                // Utilisation de prompt pour demander à l'utilisateur d'entrer un code
                const Code = prompt("Entrez un code à 4 chiffres");
          
                // Vérification si le code est valide (exactement 4 chiffres)
                if (Code && /^\d{4}$/.test(Code)) {
                  this.code = Code;
                  marker.remove(); // supprimer le coffre fermer
                  this.afficherImage(this.images[3]); // Affiche le coffre ouverte
                  this.images[2].remove = true; //Ne plus afficher le coffre fermé
                  this.afficherImage(this.images[4]); // Afficher la pièce dans le coffre
                } else {
                  alert("Code invalide ! Veuillez entrer exactement 4 chiffres");
                }
              },
            
    

        openWindow(imageSrc) { //ouvrir en grand les images de l'inventaire
        
            const newWindow = window.open('', '_blank', 'width=800,height=600');

            // Insère l'image dans cette nouvelle fenêtre
            newWindow.document.write(`
              <html>
                <head><title>Carte Postal</title></head>
                <body style="text-align: center; background-color: #000; margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
                  <img src="${imageSrc}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                </body>
              </html>
            `);
        },

            
        selectItem(item) { // Sélectionne l'élément de l'inventaire
            this.selectedItem = item;
        },

        Drop(event) {
            
            //Position du dépot en pixel
            var dropX = event.clientX;
            var dropY = event.clientY;
            //console.log(dropX, dropY);

            //objet qui a besion de l'objet de l'inventaire pour le débloqué 
            const objetbloque = this.images.find(image => image.bloque === this.selectedItem.objet); // type liste []

            //objet qui va s'afficher après avoir débloqué l'image
            const objetshow = this.images.find(image => image.bloque === objetbloque.objet);
            
            // Position du target en pixel
            var target = L.latLng(objetbloque.position[0], objetbloque.position[1]);
            var targetPoint = this.map.latLngToContainerPoint(target);

            // Définir une tolérance pour la zone de dépôt
            const tolerance = 50; // Ajustez la tolérance selon vos besoins
           
        
            if (
                dropX >= targetPoint.x - tolerance &&
                dropX <= targetPoint.x + tolerance &&
                dropY >= targetPoint.y - tolerance &&
                dropY <= targetPoint.y + tolerance) {
                console.log("Objet déposé dans la zone de déblocage !");
                this.unlockObjectOnMap(this.selectedItem);
                this.removeImageFromInventory(this.selectedItem);
                this.afficherImage(objetshow);

              //console.log(objetbloque.bloque);
            } else {
                console.log("Objet n'est déposé pas dans la zone de déblocage !");
            };
        },
  
        // Débloquer un objet sur la carte
        unlockObjectOnMap(Image) {
            const bloquer = this.images.find(image => image.bloque === Image.objet);
            //console.log(bloquer);
            if (bloquer) {
            bloquer.remove = false;};

        },

        Refresh() {
        this.markers.forEach(marker => {
            marker.remove(); // Retire le marqueur de la carte
            });
        this.images.forEach(image => {
            if (!image.remove) {
                console.log(`L'objet ${image.objet} est bloqué par : ${image.bloque}`);
                this.afficherImage(image)
                };
            });

        },

        
  
 
},

    mounted() {
        
        this.map = L.map('map').setView([-43.277614, -22.776993], 1);
        var featureGroup = L.featureGroup().addTo(this.map);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & contributors'}).addTo(this.map);

        this.Refresh();

    },

 


  }).mount('#app1');


