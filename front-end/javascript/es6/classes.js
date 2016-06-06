/**
 * Created by Chris, Z on 2016/1/20 20:22.
 * Supported in Chrome & Firefox
 */
"use strict";

class fruit {
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
        return "class fruit";
    }
}

class apple extends fruit {
    constructor(name, color) {
        super(name);
        this.color = color;
    }

    hi() {
        return super.hi() + `, your color is ${this.getColor}.`;
    }

    get getColor() {
        return this.color;
    }

    set setColor(color) {
        this.color = color;
    }

    static toString() {
        return "class apple";
    }
}

var fuji = new apple("Fuji", "red");
console.log(fruit.toString());
console.log(apple.toString());
console.log(fuji.hi());
