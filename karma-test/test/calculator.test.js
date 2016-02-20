/*
 * Unit tests for src/calculator.js
 */

describe('Calculator', function () {

    // call the init function of calculator to register DOM elements
    beforeEach(function () {
        fixture.setBase('karma-test/fixture');//fixture.base = 'karma-test/fixture';
        fixture.load('calculator.fixture.html');
        window.calculator.init();
    });

    // remove the html fixture from the DOM
    afterEach(function () {
        fixture.cleanup();
    });

    it('should return 3 for 1 + 2', function () {
        document.getElementById('x').value = 1;
        document.getElementById('y').value = 2;
        document.getElementById('add').click();
        expect(document.getElementById('result').innerHTML).toBe('3');
    });

    it('should calculate zero for invalid x value', function () {
        document.getElementById('x').value = 'hello';
        document.getElementById('y').value = 2;
        document.getElementById('add').click();
        expect(document.getElementById('result').innerHTML).toBe('0');
    });

    it('should calculate zero for invalid y value', function () {
        document.getElementById('x').value = 1;
        document.getElementById('y').value = 'goodbye';
        document.getElementById('add').click();
        expect(document.getElementById('result').innerHTML).toBe('0');
    });

});