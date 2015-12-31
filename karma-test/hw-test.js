/**
 * Created by Chris, Z on 12/30/2015 8:03 AM.
 */
describe("Hello World Example", function () {

    beforeEach(module("myApp"));

    var HelloWorldController,
        scope;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        HelloWorldController = $controller('HelloWorldController', {
            $scope: scope
        });
    }));

    it("says hello world~", function () {
        expect(scope.greeting).toEqual("Hello World~");
    });

});