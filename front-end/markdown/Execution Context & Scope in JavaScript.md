Execution Context & Scope in JavaScript
---

#### What is the Execution Context?
JavaScript code has 3 run environments:
1. Global - The default environment where your code is executed for the first time
2. Function - Whenever the flow of execution enters a function body
3. Eval - Text to be evaluated inside the internal eval function

==Each function call creates a new Execution Context==
#### Execution Context Stack
The JavaScript interperter is ==single-threaded==, which means only one task can be executed one time.
![An abstract view of a single-threaded stack](http://davidshariff.com/blog/wp-content/uploads/2012/06/ecstack.jpg)

Below is an example of a recursive function and the its execution stack:
```js
(function foo (i) {
    if (i === 3) {
        return;
    }
    else {
        foo(++i);
    }
}(0));
```
![The code simply calls itself 3 times, incrementing the value of i by 1. Each time the function foo is called, a new execution context is created. Once a context has finished executing, it pops off the stack and control returns to the context below it until the global context is reached again.](http://davidshariff.com/blog/wp-content/uploads/2012/06/es1.gif)

#### Execution Context in Detail
Every call to an execution context creation has 2 stages:
1. **Creation Stage** [Scan the function before execution]
  * Create the [Scope Chain](http://davidshariff.com/blog/javascript-scope-chain-and-closures/)
  * Create Activation / Variable Object [AO/VO]
    * Create the `arguments` object and formal parameters
    * Create function declarations, overwrite if function name already existed
    * Create variable declarations, do nothing if variable name already existed.
  * Determine the value of `this`
2. **Execution Stage**
  * Assign values, references to functions and execute code

Consider each execution context conceptually as an object with 3 properties:
```js
executionContextObj = {
    scopeChain: {/* variableObject + all parent execution context's variableObject */},
    variableObject: {/* function arguments / parameters, inner variable and function declarations */},
    this: {}
}
```
#### Lexical Scope(TODO)

#### Closure
A closure, as Crockford says, is simply:
> An inner function always has access to the vars and parameters of its outer function, even after the outer function as returned...

**Performance concerns**
* Depth Scope Chain
* Garbage Collection
* Circular References

#### Summary
It's simple.

#### References
[What is the Execution Context & Stack in JavaScript?](http://davidshariff.com/blog/what-is-the-execution-context-in-javascript/)
[Identifier Resolution and Closures in the JavaScript Scope Chain](http://davidshariff.com/blog/javascript-scope-chain-and-closures)