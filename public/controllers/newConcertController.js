var app = angular.module('myApp');
app.controller('NewConcertController',
function($scope, $rootScope, $location, $stateParams, $state, $http, LoginService){
    if(!$rootScope.isAuthenticated){
        $state.transitionTo('login');
    } else {
    var paramValue = $location.search().concert; 
    //console.log("JD",paramValue);
    if (paramValue)
        console.log("JD",paramValue);
    $scope.title = paramValue ? "Edycja koncertu" : "Nowy koncert";

    var init = paramValue ? function() {
        $rootScope.koncert = {};
        $http.get("newConcertInfo").then(response => {
            //console.log(response.data);
            if (response.data.message == "Nie jesteś zalogowany.")
                $state.transitionTo('login');
            else {
                $rootScope.status = response.data.status; 
                $rootScope.kontrahenci = response.data.kontrahenci;
            }
        }); 
        $http.get("concert", { params: {id: paramValue} }).then(response => {
            //console.log(response.data);
            if (response.data.message == "Nie jesteś zalogowany.")
                $state.transitionTo('login');
            else if (response.data.message == "Brak takiego koncertu.")
                console.log("CO???");
            else {
                $scope.koncert = response.data.koncert;
                $scope.koncert.termin = new Date($scope.koncert.termin);
                console.log($scope.koncert.status);

            }
        }); 

    } :
    function() {
        console.log(new Date().getTimezoneOffset()/60);
        $http.get("newConcertInfo").then(response => {
            //console.log(response.data);
            if (response.data.message == "Nie jesteś zalogowany.")
                $state.transitionTo('login');
            else {
                $rootScope.status = response.data.status; 
                $rootScope.kontrahenci = response.data.kontrahenci;
                $scope.koncert = {};
                var date = new Date;
                date.setSeconds(0,0);
                $scope.koncert.termin = date;
                $scope.koncert.kontrahentID = $rootScope.kontrahenci[0]._id;
                $scope.koncert.status = 1;
            }
        }); 
    };
    init();
    
    $scope.formSubmit = paramValue ? 
    function(){
        $http.post("updateConcert",{ koncertID: paramValue, kontrahentID: $scope.koncert.kontrahentID, nazwa: $scope.koncert.nazwa, termin: $scope.koncert.termin, 
            dlugosc: $scope.koncert.dlugosc, cena: $scope.koncert.cena, status: $('input[name=status]:checked').val(), adres: $scope.koncert.adres, 
            kod: $scope.koncert.kod, miejscowosc: $scope.koncert.miejscowosc }).then(data => {
            //console.log(data);
            if (data.data.message == "Edycja nie powiodła się.") {
                $scope.error = "Nie udało się edytować koncertu."
            } else {
                $state.transitionTo('concerts');
            }
        });
    } : 
    function(){
        $http.post("newConcert",{ kontrahentID: $scope.koncert.kontrahentID, nazwa: $scope.koncert.nazwa, termin: $scope.koncert.termin, 
            dlugosc: $scope.koncert.dlugosc, cena: $scope.koncert.cena, status: $('input[name=status]:checked').val(), adres: $scope.koncert.adres, 
            kod: $scope.koncert.kod, miejscowosc: $scope.koncert.miejscowosc }).then(data => {
            //console.log(data);
            if (data.data.message == "Pomyślnie dodano koncert.") {
                $state.transitionTo('concerts');
            } else {
                $scope.error = "Nie udało się dodać koncertu."
            }
        });
    };}
});