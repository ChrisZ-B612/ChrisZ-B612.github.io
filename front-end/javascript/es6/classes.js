/**
 * Created by Chris, Z on 2016/1/20 20:22.
 * Supported in Chrome & Firefox
 */
"use strict";

class Fruit {
    constructor(name) {
        this.name = name;
    }

    hi() {
        return `Hi ${this.name}`;
    }

    get getName() {
        return this.name;
    }

    set setName(name) {
        this.name = name;
    }

    static toString() {
        return "class Fruit";
    }
}

class Apple extends Fruit {
    constructor(name, color) {
        super(name);
        this.color = color;
    }

    hi() {
        return `${super.hi()}, your color is ${this.getColor}.`;// without parentheses
    }


    get getColor() {
        return this.color;
    }

    set setColor(color) {
        this.color = color;
    }

    static toString() {
        return "class Apple";
    }
}

var fuji = new Apple("fuji", "red");
console.log(Fruit.toString());
console.log(Apple.toString());
console.log(fuji.hi());