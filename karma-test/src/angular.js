/**
 * Created by Chris, Z on 12/30/2015 8:02 AM.
 */
angular.module("myApp", [])
    .controller("myCtrl", ["$scope", function ($scope) {
        angular.extend($scope, {
            name: "Chris, Z",
            age: 28
        });
    }]);
