var app = angular.module('myApp');
app.factory('LoginService', function($http) {
    var isAuthenticated = false;
    return {
        login:function(username, password){
            $http.get("api/")
            isAuthenticated = username === 'admin' && password === 'pass';
            return isAuthenticated;
        },
        isAuthenticated : function() {
            return isAuthenticated;
        }
    };
});