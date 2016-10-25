import $ from "jquery";
import Mustache from "mustache";

export default class Header {
    constructor() {}

    render(node) {
        const text = $(node).text();

        $(node).replaceWith(
            Mustache.render(template, {text})
        );
    }
}