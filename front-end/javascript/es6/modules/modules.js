/**
 * Created by Chris, Z on 2016/1/23 16:45.
 */
// run 'npm run webpack' first, and referencing the modules.bundle.js in html.

import * as math from "./math";
console.log(`2π = ${math.sum(math.pi, math.pi)}`);

//import {sum, pi} from "./math";
//console.log(`2π = ${sum(pi, pi)}`);

import exp, {pi, e} from "./mathplusplus";
console.log(`e^π = ${exp(pi)}`);