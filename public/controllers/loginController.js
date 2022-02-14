var app = angular.module('myApp');
app.controller('LoginController',
function($scope, $rootScope, $stateParams, $state, $http, LoginService) {
    if($rootScope.isAuthenticated){
        $state.transitionTo('home');
    } else {
        $scope.message = LoginService.message;
        $rootScope.title = "Przykład logowania";
        $scope.formSubmit = function(){
            $http.post("login",{ login: $scope.username, haslo: $scope.password }).then(data => {
                //console.log(data);
                $rootScope.isAuthenticated = data.data.message == "Błędne dane logowania." ? false : true;
                
                if($rootScope.isAuthenticated) {
                    $rootScope.login = $scope.username;
                    $rootScope.nazwa = data.data.nazwa;
                    $scope.error = '';
                    $scope.username = '';
                    $scope.password = '';
                    $state.transitionTo('home');
                } else
                    $scope.error = "Błędne dane logowania!";
            });
        };
    }
    
});