var app = angular.module('myApp');
app.controller('BandController',
function($scope, $rootScope, $stateParams, $state, $http, LoginService){
    if(!$rootScope.isAuthenticated){
        $state.transitionTo('login');
    } else {
    var init = function() {
        $('[name^="edycja"]').toggle();
        $http.get("band").then(response => {
            //console.log(response.data);
            if (response.data.message == "Nie jesteś zalogowany.")
                $state.transitionTo('login');
            else {
                $rootScope.zespol = response.data.zespol; // To działa
                $rootScope.muzycy = response.data.muzycy;
                $rootScope.edycja = {};
                Object.assign($rootScope.edycja,$rootScope.zespol); // Deep Copy
            }
        }); 
    }
    init();

    $scope.removeMusician = function(id) {
        $http.post("removeMusician",{muzykID: $scope.muzycy[id]._id}).then(data => {
            if (data.data.message == "Nie jesteś zalogowany.")
                $state.transitionTo('login');
            else if (data.data.message == "Usunięcie nie powiodło się.")
                console.log("CO???");
            else {
                console.log("Usuwanie muzyka...");
                $rootScope.muzycy.splice(id,1);
            }
        });
    };

    $scope.addMusician = function() {
        var muzyk = { imie: $scope.imie, nazwisko: $scope.nazwisko, rola: $scope.rola }
        $http.post("addMusician", muzyk).then(data => {
            if (data.data.message == "Nie jesteś zalogowany.")
                $state.transitionTo('login');
            else if (data.data.message == "Dodanie nie powiodło się.")
                console.log("CO???");
            else {
                console.log("Dodano muzyka...");
                $rootScope.muzycy.push(muzyk);
                $scope.imie = "";$scope.nazwisko = "";$scope.rola = "";
            }
        });
    };

    $scope.editBand = function() {
        edycja();
        var band = { nazwa: $scope.edycja.nazwa, gatunek: $scope.edycja.gatunek, email: $scope.edycja.email, telefon: $scope.edycja.telefon };
        $http.post("band/update", band).then(data => {
            if (data.data.message == "Nie jesteś zalogowany.")
                $state.transitionTo('login');
            else if (data.data.message == "Edycja nie powiodła się.")
                console.log("CO???");
            else {
                console.log("Edytowano zespół...");
                Object.assign($rootScope.zespol,$rootScope.edycja);
            }
        });
    }}
});

function edycja() {
    $('[name^="edycja"]').toggle();
    $('.span').toggle();
}

