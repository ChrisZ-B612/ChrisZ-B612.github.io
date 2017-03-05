const pug = require("pug");

const compiledFunction = pug.compileFile("movie-card.jade");

var html1 = compiledFunction({name: "Chris"});

var html2 = compiledFunction({name: "Ginny"});

var html3 = pug.renderFile("movie-card.jade", {name: "James", pretty: true});

console.log(html3);