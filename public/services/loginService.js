var app = angular.module('myApp');
app.factory('LoginService', function($rootScope, $http) {
    $rootScope.isAuthenticated = $rootScope.isAuthenticated == undefined ? false : $rootScope.isAuthenticated;
    console.log($rootScope.isAuthenticated);
    return {
        isAuthenticated: function() {
            checkIfLogged();
            return $rootScope.isAuthenticated;
        },
        message: ''
    }

    function checkIfLogged() {
        console.log("ASDASDADS");
        $http.get("amILoggedIn").then(response => {
            if (response.data.message == "Jesteś zalogowany.") {
                $rootScope.login = response.data.login;
                $rootScope.nazwa = response.data.nazwa;
                $rootScope.isAuthenticated = true;
                return true;
            } else {
                $rootScope.login = '';
                $rootScope.nazwa = '';
                $rootScope.isAuthenticated = false;
                return false;
            }
        });
    }
});