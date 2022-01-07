// Initialization
const compress = new Compress();

var myObject = new Vue({
  el: "#app",
  data: {
    newName: "",
    newDate: "",
    newPhone: "",
    newImage: "",
    birthdays: [],

    showBirthday: true,
    showAddForm: false,
    showprofile: false,
    profilName: "",
    profilDate: "",
    profilImage: "",
    newYearGift: "",
    newGift: "",
    showformgift: false,
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
      let profile = this.birthdays.find((element) => element.name == name);
      this.profilName = profile.name;
      this.profilDate = profile.date;
      // this.profileOpen = index;
      this.profilGift = profile.gifts;

      console.log("profil ouvert " + this.profilName);
    },

    uploadImage() {
      console.log('upload image');
      

      //To do compresser l'image avant de la convertir
      const files = [document.getElementById("photo").files[0]];
      
      compress
        .compress(files, {
          size: 4, // the max size in MB, defaults to 2MB
          quality: 0.75, // the quality of the image, max is 1,
          maxWidth: 1920, // the max width of the output image, defaults to 1920px
          maxHeight: 1920, // the max height of the output image, defaults to 1920px
          resize: true, // defaults to true, set false if you do not want to resize the image width and height
          rotate: false, // See the rotation section below
        })
        .then((data) => {
          console.log('data',data);
          this.newImage ='data:image/jpeg;base64,'+data[0].data;
        });
    },

    addBirthday: function (newName, newDate, newImage) {
      
      this.birthdays.push({
        name: newName,
        date: newDate,
        dateFormated:
          newDate.slice(8) +
          "/" +
          newDate.slice(5, 7) +
          "/" +
          newDate.slice(0, 4),
        image: newImage,
        count: this.countdown(),
        gifts: [],
      });

      this.birthdays = _.orderBy(this.birthdays, "count", "asc");

      this.saveBirthdays();
      (this.showAddForm = false),
        (this.newName = ""),
        (this.newImage = ""),
        (this.newDate = "");
    },

    addGift: function (newYearGift, newGift) {
      let where = this.indexOf(this.profilName);

      this.birthdays[where].gifts.push({
        yeargift: newYearGift,
        namegift: newGift,
      });

      //Ordonner les cadeaux par année
      //to do : faire en sorte que ça se rafraichisse automatiquement!!!!!

      this.birthdays[where].gifts = _.orderBy(
        this.birthdays[where].gifts,
        "yeargift",
        "desc"
      );

      // console.log("tableau birthdays " + this.birthdays);
      //[{name: "jiji", date: "2021-12-17", countdown: 20, gifts:{yeargift: "2004", namegift:"velo"}},
      // {name: "titi", date: "2021-12-16", countdown: 20}]
      //console.log("dsfdf", this.birthdays[this.profileOpen]);

      this.saveBirthdays();

      (this.showformgift = false), (this.newYearGift = ""), (this.newGift = "");
      // même syntaxe
      // this.showformgift = false;
      // this.newYearGift = "";
      // this.newGift = "";
    },

    removeBirthday(name) {
      let profileIndex = this.birthdays.findIndex(
        (element) => element.name == name
      );
      console.log("profil a supprimer", profileIndex);
      this.birthdays.splice(profileIndex, 1);
      this.saveBirthdays();
    },
    indexOf(name) {
      let profileIndex = this.birthdays.findIndex(
        (element) => element.name == name
      );
      return profileIndex;
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
