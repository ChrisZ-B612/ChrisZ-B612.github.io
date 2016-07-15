/**
 * Created by Chris, Z on 2016/1/23 16:45.
 * webpack-dev-server (http://localhost:8080/webpack-dev-server/modules.bundle)
 */
import * as math from "./math";
console.log(`2π = ${math.sum(math.pi, math.pi)}`);

//import {sum, pi} from "./math";
//console.log(`2π = ${sum(pi, pi)}`);

import ln, {pi, e} from "./mathplusplus";
console.log(`2π = ${ln(e) * pi * 2}`);