var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
//const url = "mongodb+srv://admin:<password>@cluster0.5d8av.mongodb.net/tpsiBR?retryWrites=true&w=majority";
const url = "mongodb://localhost:27017/tpsiBR";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    var dbo = db.db("tpsiBR");
    
    dbo.collection("zespoly").drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Kolekcja Usunięta");
        db.close();
    });
    
    dbo.collection("kontrahenci").drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Kolekcja Usunięta");
        db.close();
    });
    
    dbo.collection("muzycy").drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Kolekcja Usunięta");
        db.close();
    });
    
    dbo.collection("koncerty").drop(function(err, delOK) {
        if (err) throw err;
        if (delOK) console.log("Kolekcja Usunięta");
        db.close();
    });
    
 });