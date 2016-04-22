第四章：作用域链（Scope Chain）
---

### 定义
> Scope chain is related with an execution context a chain of variable objects which is used for variables lookup at identifier resolution.

### 重点摘要
* The scope chain of a function context is **created at function call** and consists of the activation object and the internal [\[Scope\]] property of this function.

* Function life cycle is divided into a stage of creation and a stage of activation (call).

* [\[Scope\]] is a hierarchical chain of all parent variable objects, which are above the current function context; **the chain is saved to the function at its creation**.

* Identifier resolution is a process of determination to which variable object in scope chain the variable (or the function declaration) belongs.

* Closures in ECMAScript are directly related with the [\[Scope\]] property of functions. As it has been noted, [\[Scope\]] is saved at function creation and exists until the function object is destroyed. Actually, a closure is exactly a combination of a function code and its [\[Scope\]] property.

* [\[Scope\]] property of functions created via the Function constructor contains always only the global object.

* Two-dimensional scope chain lookup:
  * Activation objects do not have prototypes.
        function foo() {
          alert(x);
        }

        Object.prototype.x = 10;

        foo(); // 10

  * Global object(in some implementations but not in all) is inherited from Object.prototype.
        function foo() {

          var x = 20;

          function bar() {
            alert(x);
          }

          bar();
        }

        Object.prototype.x = 10;

        foo(); // 20

* The scope chain of the global context contains only global object. The context with code type "eval" has the same scope chain as a *calling context*.
        globalContext.Scope = [
          Global
        ];

        evalContext.Scope === callingContext.Scope;

* In ECMAScript there are two statements which can modify scope chain at runtime code execution phase. These are *with* statement and *catch* clause. When one of these cases takes place, the scope chain is schematically modified as follows: `Scope = withObject|catchObject + AO|VO + [[Scope]]`

### 参考资料
[ECMA-262-3 in detail. Chapter 4. Scope chain.](http://dmitrysoshnikov.com/ecmascript/chapter-4-scope-chain/)