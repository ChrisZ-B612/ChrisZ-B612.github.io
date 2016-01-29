/**
 * Created by Chris, Z on 12/30/2015 8:02 AM.
 */
var myApp = angular.module("myApp", []);
myApp.controller("HelloWorldController", ["$scope", function ($scope) {
    $scope.greeting = "Hello World~";
    $scope.man = true;
}]);
