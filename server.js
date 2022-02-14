const STATUS = Object.freeze({
    "Zaplanowany":  1, 
    "Umowiony":     2,
    "Oplacony":     3,
    "Zagrany":      4,
    "Odwolany":     5,
});

var mongo = require('mongodb');
var MongoClient =require('mongodb').MongoClient;
//const url = "mongodb+srv://admin:<password>@cluster0.5d8av.mongodb.net/tpsiBR?retryWrites=true&w=majority";
const url = "mongodb://localhost:27017/tpsiBR";

const PORT = process.env.PORT || 3000;
const express = require('express');
const bodyParser= require('body-parser');
const session = require('express-session');
const router = express.Router();
const app = express();
app.use(express.static('public'));

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.result =[];
app.listen(PORT, function() { console.log('nasluchujemy na '+PORT); });


app.get('/', (req, resp) => {
	resp.render('index.ejs');
	resp.end();
});

app.get('/amILoggedIn', (req, resp) => {
	if (req.session._id)
		resp.json({ message: "Jesteś zalogowany.", login: req.session.login, nazwa: req.session.nazwa });
	else
		resp.json({ message: "Nie byłeś zalogowany."});
	console.log("asdasdd");
	resp.end();
});

app.post('/login', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	console.log("Login request");
	var dbo = db.db("tpsiBR");
	dbo.collection("zespoly").find({ login: req.body.login, haslo: req.body.haslo }, { login:1,nazwa:1,gatunek:0,haslo:0 }).toArray(
	function (err, result) {
		if (err) throw err;
		console.log(req.body.login, req.body.haslo);
		console.log(result);
		if (result.length == 0)
			resp.json({ message: "Błędne dane logowania." });
		else {
			req.session.login = result[0].login;
			req.session._id =  result[0]._id;
			req.session.nazwa =  result[0].nazwa;
			resp.json({ message: "Pomyślnie zalogowano.", nazwa: result[0].nazwa });
		}
	});
	db.close();
	});
});

app.post('/register', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
	if (err) throw err;
	console.log("Register request");
	var dbo = db.db("tpsiBR");
	dbo.collection("zespoly").find({ $or: [ {login: req.body.login}, {nazwa: req.body.nazwa} ] }, { login:1,nazwa:1 }).toArray(
	function (err, result) {
		if (err) throw err;
		console.log(result);
		if (result.length != 0) {
			var login = false, nazwa = false;
			for (var i=0; i<result.length && !(login && nazwa); i++) {
				login = result[i].login == req.body.login ? true : login || false;
				nazwa = result[i].nazwa == req.body.nazwa ? true : nazwa || false;
			}
			resp.json({ message: "Rejestracja nie udana.", login: login, nazwa: nazwa});
		}
		else {
			var zespoly = [ { nazwa: req.body.nazwa, gatunek: req.body.gatunek, login: req.body.login, haslo: req.body.haslo, email: req.body.email, telefon: req.body.telefon } ];
			dbo.collection("zespoly").insertMany(zespoly, function(err, res) {
				if (err) throw err;

				//req.session.login = req.body.login;
				//req.session._id =  zespoly[0]._id;
				//req.session.nazwa =  req.body.nazwa;
				resp.json({ message: "Rejestracja pomyślna." });
			});
			
		}
		db.close();
	});
	
	});
});

app.get('/logout', (req, resp) => {
	//if (req.session._id) {
		console.log("Logout request");
		req.session._id = null;
		req.session.login = null;
		req.session.nazwa = null;
		//resp.json({ message: "Pomyślnie wylogowano"});
		resp.redirect("/");
		//resp.render('index.ejs',{ login: null, nazwa: null });
	//}
	//else
	//	resp.json({ message: "Nie byłeś zalogowany."});
});

app.get('/concerts', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			dbo.collection("koncerty").find({ zespolID: new mongo.ObjectID(req.session._id) })
			.sort({termin: -1}) // -1 to descending
			.toArray(
				function (err, result) {
					console.log("koncerty", result);
					resp.json({ message: "Zwrócono koncerty", koncerty: result, status: STATUS });
					resp.end();
					db.close();
				}
			);
		}
	});
});

app.get('/concert', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			console.log(req.query);
			dbo.collection("koncerty").findOne({ _id: new mongo.ObjectID(req.query.id), zespolID: new mongo.ObjectID(req.session._id) },
				function (err, result) {
					if (err) throw err;
					if (!result) {
						resp.json({ message: "Brak takiego koncertu."});
						resp.end();
					} else {
						console.log("koncert", result);
						resp.json({ message: "Zwrócono koncert", koncert: result });
						resp.end();
						db.close();
					}
				}
			);
		}
	});
});

app.get('/newConcertInfo', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			dbo.collection("kontrahenci").find({},{ nazwa: 1 })
			.sort({nazwa: 1}) // -1 to descending
			.toArray(
				function (err, result) {
					console.log("kontrahenci", result);
					resp.json({ message: "Zwrócono info dla formularza.", kontrahenci: result, status: STATUS });
					resp.end();
					db.close();
				}
			);
		}
	});
});

app.post('/newConcert', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		console.log("New concert request");
		var dbo = db.db("tpsiBR");
		var kon = { 
			zespolID: new mongo.ObjectID(req.session._id), 
			kontrahentID: new mongo.ObjectID(req.body.kontrahentID), 
			nazwa: req.body.nazwa, 
			termin: req.body.termin, 
			dlugosc: req.body.dlugosc, 
			cena: req.body.cena, 
			adres: req.body.adres, 
			kod: req.body.kod, 
			miejscowosc: req.body.miejscowosc, 
			status: req.body.status };
		//dbo.collection("koncerty").find({ zespolID: new mongo.ObjectID(req.session._id), $or: [{ termin: {$lt: req.body.termin} }] })
		dbo.collection("koncerty").insertMany([ kon ], function(err, res) {
			if (err) {
				resp.json({ message: "Błąd podczas dodawania koncertu." });
				throw err;
			}
			console.log(kon);
			resp.json({ message: "Pomyślnie dodano koncert." });
			resp.end();
			db.close();
		});
	});
});

app.get('/band', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;

		if (!req.session._id) {
			//resp.render('band.ejs', { zespol: null, muzycy: [] });
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			dbo.collection("zespoly").find({ _id: new mongo.ObjectID(req.session._id) }).toArray(
			function (err, result) {
				console.log(req.session._id,"zespół",result);
				if (err) throw err;
				dbo.collection("muzycy").find({ zespolID: new mongo.ObjectID(req.session._id) }).toArray(
					function(err, res) {
						console.log(res);
						if (err) throw err;
						//resp.render('band.ejs', { zespol: result[0], muzycy: res });
						resp.json({ message: "Zwrócono info nt zespołu.", zespol: result[0], muzycy: res });
						resp.end();
						db.close();
					}
				);
			});
		}
	});
});

app.post('/band/update', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			dbo.collection("zespoly").updateOne({ _id: new mongo.ObjectID(req.session._id) },
			{ $set: {nazwa: req.body.nazwa, gatunek: req.body.gatunek, email: req.body.email, telefon: req.body.telefon } },
			function(err,res) {
				if (err) throw err;
				if (res.result.nModified == 0) {
					resp.json({ message: "Edycja nie powiodła się." });
					resp.end;
				} else {
					resp.json({ message: "Edycja powiodła się." });
					resp.end;
				}
				db.close();
			});
		}
	});
});

app.post('/removeMusician', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			if (dbo.collection("muzycy").deleteOne({ _id: new mongo.ObjectID(req.body.muzykID), zespolID: new mongo.ObjectID(req.session._id) }).deletedCount < 1) {
				resp.json({ message: "Usunięcie nie powiodło się." });
				resp.end;
			} else {
				resp.json({ message: "Usunięcie powiodło się." });
				resp.end;
			}
		}
		db.close();
	});
});

app.post('/addMusician', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			dbo.collection("muzycy").insertMany([{ zespolID: new mongo.ObjectID(req.session._id), imie: req.body.imie, 
				nazwisko: req.body.nazwisko, rola: req.body.rola }], 
			function(err,res) {
				if (err) throw err;
				resp.json({ message: "Pomyślnie dodano muzyka." });
				resp.end;
				db.close();
			});
		}
	});
});

app.post('/removeConcert', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			if (dbo.collection("koncerty").deleteOne({ _id: new mongo.ObjectID(req.body.koncertID), zespolID: new mongo.ObjectID(req.session._id), status: { $in: [STATUS.Zagrany, STATUS.Odwolany] } }).deletedCount < 1) {
				resp.json({ message: "Usunięcie nie powiodło się." });
				resp.end;
			} else {
				resp.json({ message: "Usunięcie powiodło się." });
				resp.end;
			}
		}
		db.close();
	});
});

app.post('/updateConcert', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			var kon = { 
				_id: new mongo.ObjectID(req.body.koncertID), 
				zespolID: new mongo.ObjectID(req.session._id), 
				kontrahentID: new mongo.ObjectID(req.body.kontrahentID), 
				nazwa: req.body.nazwa, 
				termin: req.body.termin, 
				dlugosc: req.body.dlugosc, 
				cena: req.body.cena, 
				adres: req.body.adres, 
				kod: req.body.kod, 
				miejscowosc: req.body.miejscowosc, 
				status: req.body.status };
			dbo.collection("koncerty").updateOne(
			{ _id: new mongo.ObjectID(req.body.koncertID), zespolID: new mongo.ObjectID(req.session._id) },
			{ $set: { 
				kontrahentID: kon.kontrahentID, 
				nazwa: kon.nazwa, 
				termin: kon.termin, 
				dlugosc: kon.dlugosc, 
				cena: kon.cena, 
				adres: kon.adres, 
				kod: kon.kod, 
				miejscowosc: kon.miejscowosc, 
				status: kon.status} },
			function(err,res) {
				if (err) throw err;
				if (res.result.nModified == 0) {
					console.log("Nie edytowano???")
					resp.json({ message: "Edycja nie powiodła się." });
					resp.end;
				} else {
					resp.json({ message: "Edycja powiodła się." });
					resp.end;
				}
				db.close();
			});
		}
	});
});

app.post('/newKontrahent', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			dbo.collection("kontrahenci").insertMany([{ zespolID: new mongo.ObjectID(req.session._id), nazwa: req.body.nazwa, adres: req.body.adres, kod: req.body.kod, miejscowosc: req.body.miejscowosc }], 
			function(err,res) {
				if (err) throw err;
				resp.json({ message: "Pomyślnie dodano kontrahenta." });
				resp.end;
				db.close();
			});
		}
	});
});

app.post('/removeKontrahent', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			if (dbo.collection("kontrahenci").deleteOne({ _id: new mongo.ObjectID(req.body.kontrahentID), zespolID: new mongo.ObjectID(req.session._id) }).deletedCount < 1) {
				resp.json({ message: "Usunięcie nie powiodło się." });
				resp.end;
			} else {
				resp.json({ message: "Usunięcie powiodło się." });
				resp.end;
			}
		}
		db.close();
	});
});

app.post('/updateKontrahent', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			var kon = { 
				zespolID: new mongo.ObjectID(req.session._id), 
				nazwa: req.body.nazwa, 
				adres: req.body.adres, 
				kod: req.body.kod, 
				miejscowosc: req.body.miejscowosc 
			};
			dbo.collection("kontrahenci").updateOne(
			{ _id: new mongo.ObjectID(req.body.kontrahentID), zespolID: new mongo.ObjectID(req.session._id) },
			{ $set: { 
				nazwa: kon.nazwa, 
				adres: kon.adres, 
				kod: kon.kod, 
				miejscowosc: kon.miejscowosc } 
			},
			function(err,res) {
				if (err) throw err;
				if (res.result.nModified == 0) {
					console.log("Nie edytowano???")
					resp.json({ message: "Edycja nie powiodła się." });
					resp.end;
				} else {
					resp.json({ message: "Edycja powiodła się." });
					resp.end;
				}
				db.close();
			});
		}
	});
});

app.get('/kontrahent', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;

		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			dbo.collection("kontrahenci").find({ _id: new mongo.ObjectID(req.query.id), zespolID: new mongo.ObjectID(req.session._id) }).toArray(
			function (err, result) {
				console.log(req.body.kontrahentID,"kontrahent",result);
				if (err) throw err;
				if (result.length == 0) {
					resp.json({ message: "Brak takiego kontrahenta." });
					resp.end();
				} else {
					resp.json({ message: "Zwrócono info nt kontrahenta.", kontrahent: result[0] });
					resp.end();
				}
			});
		}
	});
});

app.get('/kontrahenci', (req, resp) => {
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;

		if (!req.session._id) {
			resp.json({ message: "Nie jesteś zalogowany." });
			resp.end;
		} else {
			var dbo = db.db("tpsiBR");
			dbo.collection("kontrahenci").find({ zespolID: new mongo.ObjectID(req.session._id) }).toArray(
			function (err, result) {
				console.log(req.body.kontrahentID,"kontrahent",result);
				if (err) throw err;
				dbo.collection("kontrahenci").find({ zespolID: { $ne: new mongo.ObjectID(req.session._id) } }).toArray(
				function (er, res) {
					resp.json({ message: "Zwrócono kontrahentów", kontrahenciT: result, kontrahenci: res });
					resp.end();
				});
			});
		}
	});
});