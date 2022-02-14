var app = angular.module('myApp');
app.controller('NewKontrahentController',
function($scope, $rootScope, $location, $stateParams, $state, $http, LoginService){
    if(!$rootScope.isAuthenticated){
        $state.transitionTo('login');
    } else {
    var paramValue = $location.search().kontrahent; 
    //if (paramValue)
    //    console.log(paramValue);
    $scope.title = paramValue ? "Edycja kontrahenta" : "Nowy kontrahent";
    $scope.kontrahent = {};
    var init = paramValue ? function() {
        console.log(new Date().getTimezoneOffset()/60);
        $http.get("kontrahent", { params: {id: paramValue} }).then(response => {
            console.log(response.data);
            if (response.data.message == "Nie jesteś zalogowany.")
                $state.transitionTo('login');
            else if (response.data.message == "Brak takiego kontrahenta.")
                console.log("CO???");
            else {
                $scope.kontrahent = response.data.kontrahent;
            }
        }); 

    } :
    function() {
        console.log("Nowy kontrahent");
    };
    init();
    
    $scope.formSubmit = paramValue ? 
    function(){
        $http.post("updateKontrahent",{ kontrahentID: paramValue, nazwa: $scope.kontrahent.nazwa, adres: $scope.kontrahent.adres, 
            kod: $scope.kontrahent.kod, miejscowosc: $scope.kontrahent.miejscowosc }).then(data => {
            //console.log(data);
            if (data.data.message == "Edycja nie powiodła się.") {
                $scope.error = "Nie udało się edytować kontrahenta.";
            } else {
                $state.transitionTo('kontrahenci');
            }
        });
    } : 
    function(){
        $http.post("newKontrahent",{ kontrahentID: paramValue, nazwa: $scope.kontrahent.nazwa, adres: $scope.kontrahent.adres, 
            kod: $scope.kontrahent.kod, miejscowosc: $scope.kontrahent.miejscowosc }).then(data => {
            //console.log(data);
            if (data.data.message == "Pomyślnie dodano kontrahenta.") {
                $state.transitionTo('kontrahenci');
            } else {
                $scope.error = "Nie udało się dodać kontrahenta.";
            }
        });
    };}
});