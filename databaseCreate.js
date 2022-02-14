var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
//const url = "mongodb+srv://admin:<password>@cluster0.5d8av.mongodb.net/tpsiBR?retryWrites=true&w=majority";
const url = "mongodb://localhost:27017/tpsiBR";

const STATUS = Object.freeze({
    "Zaplanowany":  1, 
    "Umowiony":     2,
    "Oplacony":     3,
    "Zagrany":      4,
    "Odwolany":     5,
});

// Tworzenie bazy
MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    // Tworzenie kolekcji
    var dbo = db.db("tpsiBR");
    
    dbo.createCollection("zespoly",
    function(err, res) {
        if (err) throw err;
        console.log("Kolekcja zespoly utworzona!");
        db.close();
    });
    
    dbo.createCollection("kontrahenci",
    function(err, res) {
        if (err) throw err;
        console.log("Kolekcja kontrahenci utworzona!");
        db.close();
    });

    dbo.createCollection("muzycy",
    function(err, res) {
        if (err) throw err;
        console.log("Kolekcja muzycy utworzona!");
        db.close();
    });

    dbo.createCollection("koncerty",
    function(err, res) {
        if (err) throw err;
        console.log("Kolekcja koncerty utworzona!");
        db.close();
    });
    

    // Dodawanie przykładowych danych
    var zespoly = [ { nazwa: "Banda Łysego", gatunek: "Rock", login: "Lysy", haslo: "Haslo", email: "lysy@o2.pl", telefon: "727277555"},
                    { nazwa: "Zespol 2", gatunek: "Pop", login: "test", haslo: "Haslo", email: "test@o2.pl", telefon: "765437555"},
                    { nazwa: "Zespol 3", gatunek: "Pop/Rock", login: "test2", haslo: "Haslo", email: "test2@o2.pl", telefon: "364365234"} ];
    dbo.collection("zespoly").insertMany(zespoly, 
    function(err, res) {
        if (err) throw err;
        console.log("Zespoły wstawione");
        console.log(res.insertedIds);
        db.close(); 
    });

    var muzycy =  [ { zespolID: zespoly[0]._id, imie: "Norbert", nazwisko: "Gierczak", rola: "Wokalista"},
                    { zespolID: zespoly[1]._id, imie: "Jan", nazwisko: "Kowalski", rola: "Wokalista"},
                    { zespolID: zespoly[2]._id, imie: "Jan", nazwisko: "Gierczakowski", rola: "Gitarzysta"} ];
    dbo.collection("muzycy").insertMany(muzycy, 
    function(err, res) {
        if (err) throw err;
        console.log("Muzycy wstawieni");
        console.log(res.insertedIds);
        db.close(); 
    });

    var kontrahenci = [ 
       { nazwa: "Urząd Gminy Mińsk Maz.", adres: "ul. Warszawska 100", kod: '05-300', miejscowosc: "Mińsk Mazowiecki"}, 
       { nazwa: "Urząd Gminy Siedlce", adres: "ul. 3 maja 12", kod: '03-200', miejscowosc: "Siedlce"},
       { nazwa: "Urząd Gminy Warszawa", adres: "ul. Wiejska 140", kod: '00-100', miejscowosc: "Warszawa"}
    ];
    dbo.collection("kontrahenci").insertMany(kontrahenci, 
        function(err, res) {
            if (err) throw err;
            console.log("Kontrahenci wstawieni");
            console.log(res.insertedIds);
            db.close(); 
    });

    var koncerty = [ 
        { zespolID: zespoly[0]._id, kontrahentID: kontrahenci[0]._id, nazwa: "Koncert bez okazji", termin: new Date('2021-10-10T15:00:00'), 
          dlugosc: 3.0, cena: 10000, adres: "ul. Warszawska 30", kod: '05-300', miejscowosc: "Mińsk Mazowiecki", status: STATUS.Oplacony },
        { zespolID: zespoly[1]._id, kontrahentID: kontrahenci[0]._id, nazwa: "Koncert bez okazji", termin: new Date('2021-10-10T18:00:00'), 
          dlugosc: 1.0, cena: 3000, adres: "ul. Warszawska 30", kod: '05-300', miejscowosc: "Mińsk Mazowiecki", status: STATUS.Zaplanowany },
        { zespolID: zespoly[2]._id, kontrahentID: kontrahenci[0]._id, nazwa: "Koncert bez okazji", termin: new Date('2021-10-10T13:30:00'), 
          dlugosc: 1.5, cena: 4000, adres: "ul. Warszawska 30", kod: '05-300', miejscowosc: "Mińsk Mazowiecki", status: STATUS.Umowiony },
    ];
    dbo.collection("koncerty").insertMany(koncerty, 
        function(err, res) {
            if (err) throw err;
            console.log("Koncerty wstawione");
            console.log(res.insertedIds);
            db.close(); 
    });
    
 });