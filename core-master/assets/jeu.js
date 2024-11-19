
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
            {objet : 'Remi', position :[-51.210461, 46.812867], zoom :'2',icone : 'image/remi.jpg',  recuperable : false, text : 'Tu dois m’aider à retrouver ce disque ! Ma future vie de DJ en dépend…', code : '', bloque: '', remove:false},
            {objet : 'Diego', position :[-71.210461, 46.812867], zoom :'14',icone : 'image/diego.jpg',  recuperable : false, text : '', code : '', bloque: 'Remi', remove:false},
            {objet : 'Mael', position :[-71.210461, 46.812867], zoom :'14',icone : 'image/mael.jpg',  recuperable : false, text : '', code : '', bloque: 'Remi', remove:false},
            {objet : 'Laura-lee', position :[-31.210461, 46.812867], zoom :'5',icone : 'image/lauralee.jpg',  recuperable : false, text : 'Je sais pas pourquoi mais ces derniers jours Karine n’arrêtait pas de me parler d’un voyage vers la terre de glace et de feu', code : '', bloque: 'Remi', remove:false},
            {objet : 'Seb', position :[-71.210461, 46.812867], zoom :'14',icone : 'image/seb.jpg',  recuperable : false, text : 'j’ai vu Karine quitter l’école avec un objet doré dans son sac', code : '', bloque: 'Remi', remove:false},
            {objet : 'Celia', position :[-71.210461, 86.812867], zoom :'14',icone : 'image/celia.jpg',  recuperable : false, text : '', code : '', bloque: 'Remi', remove:false},
            {objet : 'Clara', position :[-71.210461, 56.812867], zoom :'14',icone : 'image/canettes.jpg',  recuperable : false, text : 'Cherche un peu dans la ville', code : '', bloque: '', remove:false},
            {objet : 'poeme', position :[-61.210461, 48.812867], zoom :'5',icone : 'image/lettre.png',  recuperable : false, text : `À l'est des montagnes et au bord de la mer,
                                                                                                                                Se trouve une ville où le sirop d'érable est fier.
                                                                                                                                Cherche le plus vieux quartier, pavé et charmant,
                                                                                                                                Là-bas, une boutique te dévoilera un trésor brillant.
                                                                                                                                La carte postale attend sous le signe d'un castor,
                                                                                                                                Un symbole canadien, tout près de son store.
                                                                                                                                Et si tu cherches bien, une coïncidence se dévoile,
                                                                                                                                Car ton nom est le même que la région où tu travailles.
                                                                                                                                Trouve cette ville historique, où l'hiver est festif,
                                                                                                                                Et tu découvriras une carte postale, en souvenir d'un récit !`, code : '', bloque: 'Laura-lee', remove:false},
            {objet : 'canettes', position :[-71.210461, 47.812867], zoom :'14',icone : 'image/canettes.png',  recuperable : false, text : '', code : '', bloque: 'Laura-lee', remove:false},
            {objet : 'dechets', position :[-71.210461, 49.812867], zoom :'14',icone : 'image/dechets.png',  recuperable : false, text : '', code : '', bloque: 'Laura-lee', remove:false},
            {objet : 'carte postale', position :[-43.277614, -22.776993], zoom :'15', icone : 'image/carte_postale.png', recuperable : true, text : '', code : '', bloque:'poeme', remove:false},
            {objet : 'Jules', position :[-91.210461, 46.812867], zoom :'14',icone : 'image/jule.jpg',  recuperable : false, text : 'Va voir sur les rives de Rio', code : '', bloque: 'carte postale', remove:false},
            {objet : 'coffre ferme', position :[-22.776993, -43.211614], zoom :'5', icone : 'image/coffre_ferme.png', recuperable : false, text : '', code :'1213', bloque: 'carte postale', remove:false},
            {objet : 'coffre ouverte', position :[-22.776993, -43.211614], zoom :'5', icone : 'image/coffre_ouverte.png', recuperable : false, text : '', code :'', bloque: 'coffre ferme', remove:true},
            {objet : 'piece', position :[-22.776993, -43.211614], zoom :'5', icone : 'image/piece.png', recuperable : true, text : '', code :'', bloque: 'coffre ferme', remove:true},
            {objet : 'Romain', position :[-71.210461, 46.812867], zoom :'14',icone : 'image/romain.jpg',  recuperable : false, text : 'Tu peux faire un voeux au près de la fontaine en lançant une pièce dessus', code : '', bloque: 'coffre ouverte', remove:false},
            {objet : 'fontaine du mont fuji', position :[2.587624, 48.84139], zoom :'5', icone : 'image/fontaine_mont_fuji.png', recuperable : false, text : '', code :'', bloque: 'piece', remove:false},
            {objet : 'disque', position :[2.587624, 48.84139], zoom :'5', icone : 'image/disque.png', recuperable : true, text : '', code :'', bloque:'fontaine du mont fuji', remove:true},
    
        ],
            
            Inventory: [],
            markers : [],
            selectedItem : null,

//NOUVEAU SCORE
            startTime : null,
            stopTime : null,
            score : null,
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


            var marker = L.marker(image.position, { icon: imageIcon }).addTo(this.featureGroup);
            this.markers.push(marker);

            
            marker.addTo(this.featureGroup);

            marker.on('click', () => {

                if (image.recuperable) { // si l'objet est récupérable on le récupère et on le met dans l'inventaire
                    this.selectedImageSrc = image.icone;
                    this.addImageToInventory(image);
//NOUVEAU
                    marker.remove();
                };

                if (image.code){ // si l'objet possède un code alors demander
                    this.askForCode(marker, image);
                };


// NOUVEAU
                if (image.text) {// si y'a un texte on l'affiche
                    marker.bindPopup(image.text).openPopup(); //afficher le texte
                    console.log(image.objet);

                    };

//NOUVEAU
                this.unlockObjectOnMap(image);
            });
            
        },

        /*
        zoom(image) {
            const currentZoom = this.map.getZoom();
            console.log(`Niveau de zoom actuel : ${currentZoom}`);
            console.log(image.zoom, image.remove);
            
            if (currentZoom >= image.zoom && !image.remove) {
                // Si le zoom est dans la plage, s'assurer que l'image est affichée
                    return true

            } else {
                // Si le zoom est hors de la plage, retirer l'image
                    return false
            };
            
        },
*/

            addImageToInventory(image) {
                this.Inventory.push(image); // rajouter les images dans l'inventaire
                image.remove = true;
                //console.log(image.remove);

//NOUVEAU SCORE
                //Vérifier si le disque est dans l'inventiare alors fin de jeu
                const existsInInventory = this.Inventory.some(image => image.objet === "disque");

                if (existsInInventory) {
                    //console.log("L'objet 'disque' est présent dans l'inventaire.");
                    this.stopTime = Date.now();
                    this.score = (this.stopTime - this.startTime);
                    //console.log(this.startTime, this.stopTime);
                    //console.log(score);
                    alert("score :" + this.score);
                } else {
                    console.log("L'objet 'disque' n'est pas présent dans l'inventaire.");
                }
                
            },

            removeImageFromInventory(image) {
                const index = this.Inventory.indexOf(image);
                if (index !== -1) {
                    this.Inventory.splice(index, 1); // Supprime l'image de l'inventaire
                }
            },

//NOUVEAU
            askForCode(marker, Image) {
                // Utilisation de prompt pour demander à l'utilisateur d'entrer un code
                const Code = prompt("Entrez un code à 4 chiffres");
                const objetsBloques = this.images.filter(image => image.bloque === Image.objet);
          
                // Vérification si le code est valide (exactement 4 chiffres)
                if (Code && /^\d{4}$/.test(Code)) {
                  this.code = Code;
                  marker.remove(); // supprimer l'image précédent
                  objetsBloques.forEach(bloque => {
                    bloque.remove = false; //rendre visible les objets bloqués par le code
                    this.unlockObjectOnMap(bloque);
                  })
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
            const objetbloque = this.images.find(image => image.bloque === this.selectedItem.objet); 
            //console.log(objetbloque);

            //objet qui va s'afficher après avoir débloqué l'image
            const objetshow = this.images.find(image => image.bloque === objetbloque.objet);
            //console.log(objetshow);
            
            // Position du target en pixel
            var target = L.latLng(objetbloque.position[0], objetbloque.position[1]);
            var targetPoint = this.map.latLngToContainerPoint(target);
            //console.log(target);

//NOUVEAU
            // Définir une tolérance pour la zone de dépôt
            const tolerance = 100; // Ajustez la tolérance selon vos besoins
           
        
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


//NOUVEAU
        // Débloquer un objet sur la carte
        unlockObjectOnMap(Image) {
            const objetsBloques = this.images.filter(image => image.bloque === Image.objet);

            objetsBloques.forEach(bloque => {
                if(!bloque.remove){
                this.afficherImage(bloque); // Débloquer tous les objets sélectionnés
                };
                //bloque.remove = false;
            });
    
            //this.Refresh(); //actualiser l'écran avec les nouveaux éléments

        },


        /*
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
        */

        
  
 
},

    mounted() {

//NOUVEAU SCORE
        this.startTime = Date.now();


        this.map = L.map('map').setView([-43.277614, -22.776993], 1);
        this.featureGroup = L.featureGroup().addTo(this.map);
        
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(this.map);

//NOUVEAU
        this.afficherImage(this.images[0]);

    },

 


  }).mount('#app1');


