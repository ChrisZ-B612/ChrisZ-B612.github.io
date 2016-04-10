第一章：执行上下文（Execution Context）
---

### 前言
在本文中，我们将会介绍ECMAScript中的执行上下文（Execution Context）以及与之相关联的不同类型的可执行代码（Executable Code）。

### 定义
执行上下文的定义如下：
> Execution context (abbreviated form — EC) is the abstract concept used by ECMA-262 specification for typification and differentiation of an executable code.

ECMA标准并没有从实现的角度定义EC具体的结构和类型，这个问题留给了实现ECMA标准的ECMAScript引擎的开发者们。

从逻辑上来讲，一系列活动的EC构成了一个栈，我们姑且称它为**ECStack**。位于栈底的永远是全局上下文，而栈顶保存的是当前活动上下文。每当调用一个函数的时候（无论这个函数是被递归调用，还是被作为构造器调用），编译器都会创建一个新的、与被调函数相关联的EC，并将其压入到ECStack中。随着程序流进入各种类型的EC和执行结束退出，ECStack也相应地执行着进栈和出栈的操作。

### 可执行代码的类型
#### 全局代码（Global code）
刚开始执行外部加载的js文件或者`<script>...</script>`标签中包含的代码时，首先处理的就是全局代码。全局代码并不包含任何函数内部的代码。程序刚开始执行时的ECStack类似这样：
```
ECStack = [
  globalContext
];
```

#### 函数代码（Function code）
前面已经提到过，每当调用一个函数时都会有一个新的EC被压入到ECStack中。和全局代码类似，函数代码也不包含内部函数的代码。

我们来看一个例子，下面的函数在执行时递归调用了自己一次：
```js
(function foo(flag) {
  if (flag) {
    return;
  }
  foo(true);
})(false);
```
相应地ECStack的变化过程如下：
```
// first activation of foo
ECStack = [
  <foo> functionContext,
  globalContext
];

// recursive activation of foo
ECStack = [
  <foo> functionContext – recursively,
  <foo> functionContext,
  globalContext
];
```
每当函数执行结束时，程序流离开当前执行函数对应的EC，并对ECStack执行出栈操作。如此往复，直到所有的函数都调用完毕，此时ECStack就又只包含全局上下文globalContext，直到程序运行结束。

抛出一个未被捕获的异常也会导致所有的EC执行结束。
```js
(function foo() {
  (function bar() {
    throw 'Exit from bar and foo contexts';
  })();
})();
```

#### Eval代码（Eval code）
在eval中有一个概念叫做：调用上下文（calling context），也就是当eval函数执行时所处的上下文，可能是全局上下文，也可能是某个函数的上下文。在eval中声明的变量和函数影响的就是这个调用上下文。看下面这个例子：
```
// influence global context
eval('var x = 10');

(function foo() {
  // and here, variable "y" is
  // created in the local context
  // of "foo" function
  eval('var y = 20');
})();

alert(x); // 10
alert(y); // "y" is not defined
```
ECStack的变化过程如下：
```js
ECStack = [
  globalContext
];

// eval('var x = 10');
ECStack.push({
  context: evalContext,
  callingContext: globalContext
});

// eval exited context
ECStack.pop();

// foo funciton call
ECStack.push(<foo> functionContext);

// eval('var y = 20');
ECStack.push({
  context: evalContext,
  callingContext: <foo> functionContext
});

// return from eval
ECStack.pop();

// return from foo
ECStack.pop();
```
在ES5的严格模式中，eval的执行是在本地的沙箱环境中，所以已经不会影响调用上下文了。

在v1.7之前的老版本的SpiderMonkey中，可以通过eval的第二个参数手动设置调用上下文，如果被传入的调用上下文存在的话，那么就能够修改其中的私有变量：
```js
function foo() {
  var x = 1;
  return function () { alert(x); };
};

var bar = foo();

bar(); // 1

eval('x = 2', bar); // pass context, influence internal var "x"

bar(); // 2
```
不过出于安全因素的考虑，现代的引擎已经修复了这个问题。