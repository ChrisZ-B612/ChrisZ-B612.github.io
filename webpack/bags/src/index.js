/**
 * Created by Chris, Z on 6/13/2016 8:58 AM.
 */
import "./styles.scss";

if (document.querySelectorAll("a").length) {
    require.ensure([], () => {
        const Button = require("./components/button").default;
        const button = new Button("https://www.google.com");
        button.render("a");
    });
}

// If we have a title, render the Header component on it
if (document.querySelectorAll("h1").length) {
    require.ensure([], () => {
        const Header = require("./components/header").default;
        new Header().render("h1");
    });
}