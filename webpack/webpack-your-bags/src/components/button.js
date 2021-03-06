import $ from "jquery";
import Mustache from "mustache";

export default class Button {
    constructor(link) {
        this.link = link;
    }

    onClick(event) {
        alert(this.link);
        event.preventDefault();
    }

    render(node) {
        const text = $(node).text(), link = $(node).attr("href");

        $(node).replaceWith(
            Mustache.render(template, {text, link})
        );

        $(".button").click(this.onClick.bind(this));
    }
}