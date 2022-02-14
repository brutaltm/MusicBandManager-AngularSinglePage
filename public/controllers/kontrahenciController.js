var app = angular.module('myApp');
app.controller('KontrahenciController',
function($scope, $rootScope, $stateParams, $state, $http, LoginService){
    if(!$rootScope.isAuthenticated){
        $state.transitionTo('login');
    } else {
    $scope.sortowanoPo = {par: '', rosn: true};
    $scope.Math=Math;
    var init = function() {
        $http.get("kontrahenci").then(response => {
            //console.log(response.data);
            if (response.data.message == "Nie jesteś zalogowany.")
                $state.transitionTo('login');
            else {
                $scope.kontrahenci = response.data.kontrahenci; // To działa
                $scope.kontrahenciT = response.data.kontrahenciT;
            }
        }); 
    };
    init();

    $scope.removeKontrahent = function(id) {
        $http.post("removeKontrahent",{kontrahentID: $scope.kontrahenciT[id]._id}).then(data => {
            if (data.data.message == "Nie jesteś zalogowany.")
                $state.transitionTo('login');
            else if (data.data.message == "Usunięcie nie powiodło się.")
                console.log("CO???");
            else {
                console.log("Usuwanie kontrahenta...");
                $scope.kontrahenciT.splice(id,1);
            }
        });
    };

    $scope.sort = function(par) {
        if ($scope.sortowanoPo.par != par) {
            $scope.sortowanoPo.par = par;
            $scope.sortowanoPo.rosn = true;
        } 
        else $scope.sortowanoPo.rosn = !$scope.sortowanoPo.rosn;

        switch(par) {
            case "nazwa": case "adres": case "kod": case "miejscowosc":
                if ($scope.sortowanoPo.rosn) {
                    $scope.kontrahenciT = $scope.kontrahenciT.sort((a,b) => a[par].localeCompare(b[par]));
                    $scope.kontrahenci = $scope.kontrahenci.sort((a,b) => a[par].localeCompare(b[par]));
                } else {
                    $scope.kontrahenciT = $scope.kontrahenciT.sort((a,b) => b[par].localeCompare(a[par]));
                    $scope.kontrahenci = $scope.kontrahenci.sort((a,b) => b[par].localeCompare(a[par]));
                }
                break;
            default:
                break;
        }
    
    };
    }
});