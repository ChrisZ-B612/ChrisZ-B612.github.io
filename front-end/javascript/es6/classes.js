/**
 * Created by Chris, Z on 2016/1/20 20:22.
 */
"use strict";// Block-scoped declarations (let, const, function, class) not yet supported outside strict mode

class fruit {
    constructor(name) {
        this.name = name;
    }

    hi() {
        return this.name;
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
        return super.hi() + " > " + super.hi();
    }

    get getColor() {
        return this.color;
    }

    set setColor(color) {
        this.color = color;
    }
}

var app = new apple("Fuji", "red");
//TODO:: Tests failed