/**
 * Created by Chris, Z on 12/30/2015 8:03 AM.
 */
describe("Hello, Karma & Jasmine", function () {

    beforeEach(module("myApp"));

    var myCtrl, scope;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        myCtrl = $controller("myCtrl", {
            $scope: scope
        });
    }));

    it("is Chris, Z", function () {
        expect(scope.name).toBe("Chris, Z");
        expect(scope.age).toEqual(28);
    });

});