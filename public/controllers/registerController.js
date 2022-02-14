var app = angular.module('myApp');
app.controller('RegisterController',
function($scope, $rootScope, $stateParams, $state, $http, LoginService){
    if($rootScope.isAuthenticated){
        $state.transitionTo('home');
    }
    else {
        $scope.sendForm = function() {
            console.log($scope.login);
            /*if ($scope.login) $("[ng-model='login']").parent().addClass("border border-success");
            if ($scope.password && $scope.repeatpassword && $scope.password == $scope.repeatpassword)
                $("[ng-model*='password']").parent().addClass("border border-success");
            */
            if ($scope.login && $scope.password && $scope.repeatpassword && $scope.nazwa && $scope.email && $scope.gatunek && $scope.telefon) {
                
                $http.post("register",{ login: $scope.login, haslo: $scope.password, nazwa: $scope.nazwa, gatunek: $scope.gatunek, email: $scope.email, telefon: $scope.telefon })
                .then(data => {
                    if (data.data.message == "Rejestracja pomyślna.") {
                        LoginService.isAuthenticated = true;
                        $rootScope.login = $scope.login;
                        LoginService.message = "Zarejestrowano pomyślnie. Możesz się teraz zalogować.";
                        $state.transitionTo('home');
                    } else {
                        console.log("Rejestracja nieudana");
                        $scope.error = "Nie udało się zarejestrować.";
                        Object.keys(data.data).forEach(function(k) {
                            console.log(k);
                            if (data.data[k] == true) {
                                console.log(k);
                                $("[ng-model='" + k + "']").get(0).setCustomValidity("Nazwa użytkownika zajęta");
                                $("[ng-model='" + k + "']").get(0).reportValidity();
                            }
                        });
                    }
                    
                });
            }

        }
    }
});