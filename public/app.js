(function() {

    var app = angular.module('myApp', ['ui.router']);
    app.run(function($rootScope, $location, $state, LoginService){
        //console.clear();
        console.log('running');
        //$rootScope.isAuthenticated = false;
        $rootScope.isAuthenticated = LoginService.isAuthenticated();
        console.log($rootScope.isAuthenticated);

        $state.defaultErrorHandler(function(error) {
            // This is a naive example of how to silence the default error handler.
            //console.log(error);
            console.log("Przekierowywanie");
        });
    });
    app.config(['$stateProvider','$urlRouterProvider',
    function($stateProvider, $urlRouterProvider, $rootScope){
        $stateProvider
		.state('login',{
            url: '/login',
            templateUrl: 'pages/login.html',
            controller: 'LoginController'
        })
        .state('register',{
            url: '/register',
            templateUrl: 'pages/register.html',
            controller: 'RegisterController'
        })
        .state('home',{
            url: '/home',
            templateUrl: 'pages/home.html',
            controller: 'HomeController',
            resolve: { authenticate: authenticate }
        })
        .state('band',{
            url: '/band',
            templateUrl: '/pages/band.html',
            controller: 'BandController',
            resolve: { authenticate: authenticate }
        })
        .state('concerts',{
            url: '/concerts',
            templateUrl: 'pages/concerts.html',
            controller: 'ConcertsController',
            resolve: { authenticate: authenticate }
        })
        .state('newConcert',{
            url: '/newConcert',
            templateUrl: 'pages/newConcert.html',
            controller: 'NewConcertController',
            resolve: { authenticate: authenticate }
        })
        .state('kontrahenci',{
            url: '/kontrahenci',
            templateUrl: 'pages/kontrahenci.html',
            controller: 'KontrahenciController',
            resolve: { authenticate: authenticate }
        })
        .state('newKontrahent',{
            url: '/newKontrahent',
            templateUrl: 'pages/newKontrahent.html',
            controller: 'NewKontrahentController',
            resolve: { authenticate: authenticate }
        });

        function authenticate($q, $state, $rootScope, $timeout) {
            console.log($rootScope.isAuthenticated);
            if ($rootScope.isAuthenticated)
                return $q.when();
            else {
                $timeout(function() { 
                    if (!$rootScope.isAuthenticated)
                        $state.go('login'); 
                    else 
                        return $q.when();
                    return $q.reject();
                });
            }
        }
        $urlRouterProvider.otherwise('home');
    }]);
    app.config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }]);
})();