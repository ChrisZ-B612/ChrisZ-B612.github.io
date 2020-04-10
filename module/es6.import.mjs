// node --experimental-modules es6.import.mjs
import {a} from './es6.export.mjs';

setInterval(() => {
    console.log(`es6.import: ${a}`);
}, 1000);
