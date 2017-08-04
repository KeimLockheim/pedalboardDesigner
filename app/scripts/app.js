'use strict';

/**
 * @ngdoc overview
 * @name pedalboardDesignerApp
 * @description
 * # pedalboardDesignerApp
 *
 * Main module of the application.
 */
angular
  .module('pedalboardDesignerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'flowChart',
    'WebMIDI'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });

  });

