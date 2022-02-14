var app = angular.module('myApp');
app.controller('ConcertsController',
function($scope, $rootScope, $stateParams, $state, $http, LoginService){
    if(!$rootScope.isAuthenticated){
        $state.transitionTo('login');
    } else {
    $scope.sortowanoPo = {par: '', rosn: true};
    $scope.Math=Math;
    var init = function() {
        $http.get("concerts").then(response => {
            //console.log(response.data);
            if (response.data.message == "Nie jesteś zalogowany.")
                $state.transitionTo('login');
            else {
                $rootScope.koncerty = response.data.koncerty; // To działa
                $rootScope.status = response.data.status;
                $rootScope.keys = Object.keys($rootScope.status);
                //$scope.koncerty = response.data.koncerty; // Z jakiegoś powodu nie działa
                //console.log($scope.koncerty);
                //$state.transitionTo('concerts');
            }
        }); 
    };
    init();

    $scope.removeConcert = function(id) {
        $http.post("removeConcert",{koncertID: $scope.koncerty[id]._id}).then(data => {
            if (data.data.message == "Nie jesteś zalogowany.")
                $state.transitionTo('login');
            else if (data.data.message == "Usunięcie nie powiodło się.")
                console.log("CO???");
            else {
                console.log("Usuwanie koncertu...");
                $rootScope.koncerty.splice(id,1);
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
            case "termin":
                if ($scope.sortowanoPo.rosn)
                    $rootScope.koncerty = $rootScope.koncerty.sort((a,b) => new Date(a[par]) - new Date(b[par]));
                else 
                    $rootScope.koncerty = $rootScope.koncerty.sort((a,b) => new Date(b[par]) - new Date(a[par]));
                break;
            case "nazwa": case "adres": case "kod": case "miejscowosc":
                if ($scope.sortowanoPo.rosn)
                    $rootScope.koncerty = $rootScope.koncerty.sort((a,b) => a[par].localeCompare(b[par]));
                else 
                    $rootScope.koncerty = $rootScope.koncerty.sort((a,b) => b[par].localeCompare(a[par]));
                break;
            case "dlugosc": case "cena": case "status":
                if ($scope.sortowanoPo.rosn)
                    $rootScope.koncerty = $rootScope.koncerty.sort((a,b) => a[par] - b[par]);
                else 
                    $rootScope.koncerty = $rootScope.koncerty.sort((a,b) => b[par] - a[par]);
                break;
        }
    
    };
    }
});