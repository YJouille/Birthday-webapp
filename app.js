var myObject = new Vue({
  el: "#app",
  data: {
    newName: "",
    newDate: "",
    newImage: "",
    birthdays: [],
    showBirthday: true,
    showform: false,
    showprofile: false,
    profilName: "",
    profilDate: "",
    profilImage: "",
    newYearGift: "",
    newGift: "",
    showformgift: false,
    profileOpen: "",
    profilGift: "",
    searchTerm: "",
    searchGift: "",
  },

  //[{name: "jiji", date: "2021-12-17", countdown: 20, gifts:{yeargift: "2004", namegift:"velo"}},
  // {name: "titi", date: "2021-12-16", countdown: 20}]

  mounted() {
    if (localStorage.getItem("birthdays")) {
      try {
        this.birthdays = JSON.parse(localStorage.getItem("birthdays"));
      } catch (e) {
        localStorage.removeItem("birthdays");
      }
    }
  },

  computed: {
    filterByTerm() {
      return this.birthdays.filter((birthday) => {
        return birthday.name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      });
    },

    filterByGift() {    
      if (this.profilGift) {
        return this.profilGift.filter((value) => {
          return value.namegift
            .toLowerCase()
            .includes(this.searchGift.toLowerCase());
        });
      }  
    },
  },

  methods: {
    showProfile: function (name) {
      //console.log('tableau birthdays ' + this.birthdays);
      let profile = this.birthdays.find(element =>element.name == name);
      this.profilName = profile.name;
      this.profilDate = profile.date;

     // this.profileOpen = index;
      this.profilGift = profile.gifts;

     console.log("profil ouvert " + this.profilName);
    },
    
    uploadImage() {
      //To do compresser l'image avant de la convertir 
      const file = document.getElementById("photo").files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.newImage = reader.result;
        console.log(this.newImage);
        console.log("file",file);
      };
      reader.readAsDataURL(file);
    },

    addBirthday: function (newName, newDate, newImage) {  
      this.birthdays.push({ 
        name: newName,
        date: newDate,
        dateFormated : newDate.slice(8)+'/'+newDate.slice(5,7)+'/'+newDate.slice(0,4),
        image: newImage,
        count: this.countdown(),
        gifts: [],
      });

      this.birthdays = _.orderBy(this.birthdays, "count", "asc");

      this.saveBirthdays();
      (this.showform = false), (this.newName = ""),(this.newImage= ""),(this.newDate = "");
    },

    addGift: function (newYearGift, newGift) {

      this.birthdays[this.profileOpen].gifts.push({
        yeargift: newYearGift,
        namegift: newGift,
      });
      //Ordonner les cadeaux par année
      //to do : faire en sorte que ça se rafraichisse automatiquement!!!!!

      this.birthdays[this.profileOpen].gifts = _.orderBy(this.birthdays[this.profileOpen].gifts, "yeargift" , "desc" );

     // console.log("tableau birthdays " + this.birthdays);
      //[{name: "jiji", date: "2021-12-17", countdown: 20, gifts:{yeargift: "2004", namegift:"velo"}},
      // {name: "titi", date: "2021-12-16", countdown: 20}]
      //console.log("dsfdf", this.birthdays[this.profileOpen]);

      this.saveBirthdays();

      (this.showformgift = false),(this.newYearGift = ""),(this.newGift = "");
      // même syntaxe
      // this.showformgift = false;
      // this.newYearGift = "";
      // this.newGift = "";
    },

    removeBirthday(name) {
      let profileIndex = this.birthdays.findIndex(element =>element.name == name);
      console.log('profil a supprimer',profileIndex);
      this.birthdays.splice(profileIndex, 1);
      this.saveBirthdays();
    },

    removeGift(x) {
      this.birthdays[this.profileOpen].gifts.splice(x, 1);
      this.saveBirthdays();
    },

    saveBirthdays() {
      //console.log(this.birthdays);
      const parsed = JSON.stringify(this.birthdays);
      //console.log(parsed);
      localStorage.setItem("birthdays", parsed);
    },

    countdown() {
      birthdayDate = new Date(this.newDate);
      currentDate = new Date();

      birthdayDate.setFullYear(currentDate.getFullYear());

      if (birthdayDate < currentDate) {
        birthdayDate.setFullYear(currentDate.getFullYear() + 1);
      }
      tmp = birthdayDate - currentDate;
      var diff = {}; // Initialisation du retour

      tmp = Math.floor(tmp / 1000); // Nombre de secondes entre les 2 dates
      diff.sec = tmp % 60; // Extraction du nombre de secondes

      tmp = Math.floor((tmp - diff.sec) / 60); // Nombre de minutes (partie entière)
      diff.min = tmp % 60; // Extraction du nombre de minutes

      tmp = Math.floor((tmp - diff.min) / 60); // Nombre d'heures (entières)
      diff.hour = tmp % 24; // Extraction du nombre d'heures

      tmp = Math.floor((tmp - diff.hour) / 24); // Nombre de jours restants
      diff.day = tmp + 1;

      return diff.day;
    },
  },
});
