第一章：执行上下文（Execution Contexts）
---

### 前言（Preface）
在本文中，我们将会介绍ECMAScript中的执行上下文（Execution Context），以及与之关系密切的不同类型的可执行代码（Executable Code）。

### 格式约定（Notational Conventions）
本文中出现的==类似这样带背景色的部分==是我个人的分析和理解，不保证其完全正确，仅供参考。

### 定义（Definition）
执行上下文的定义如下：
> Execution context (abbreviated form — EC) is the abstract concept used by ECMA-262 specification for typification and differentiation of an executable code.

从定义中我们可以看出，EC是一个虚构的概念，==引入这个概念的主要目的是为了更好地区分和描述不同类型的可执行代码==。ECMA-262标准并没有从实现的角度明确定义EC的结构和类型，这个问题留给了实现标准的ECMAScript引擎的开发者们。

从逻辑上来讲，一系列活动的EC构成了一个栈，我们姑且称它为**ECStack**。位于栈底的永远是全局上下文，而栈顶保存的是**当前活动上下文**。每当调用一个函数的时候（无论这个函数是被递归调用，还是被作为构造函数调用），编译器都会创建一个新的、基于被调函数生成的EC，并将其压入到ECStack中成为当前活动上下文。随着代码的执行，程序流不停地进入（调用函数）和离开（函数执行结束）各种类型的EC，ECStack也相应地不停地执行着进栈和出栈的操作。

### 可执行代码的类型（Types of Executable Code）
ECMAScript有三种类型的可执行代码，分别是：全局代码、函数代码以及Eval代码。

#### 全局代码（Global code）
ECMA-262-5th对全局代码的定义如下：
> Global code is source text that is treated as an ECMAScript Program. The global code of a particular Program does not include any source text that is parsed as part of a FunctionBody.

根据定义的描述，全局代码是指那些会被视为ECMAScript Program的代码部分。从实际上讲，刚开始执行外部加载的js文件或者`<script></script>`标签中包含的代码时，首先处理的就是全局代码。全局代码并不包含任何函数的代码。

程序刚开始执行时，编译器首先会处理全局代码，它会创建一个全局上下文压入到ECStack中，此时的ECStack就类似于这样：
```
ECStack = [
  globalContext
];
```

#### 函数代码（Function code）
ECMA-262-5th对函数代码的定义如下：
> Function code is source text that is parsed as part of a FunctionBody. The function code of a particular FunctionBody does not include any source text that is parsed as part of a nested FunctionBody.

> Function code also denotes the source text supplied when using the built-in **Function** object as a constructor. More precisely, the last parameter provided to the **Function** constructor is converted to a String and treated as the FunctionBody. If more than one parameter is provided to the **Function** constructor, all parameters except the last one are converted to Strings and concatenated together, separated by commas. The resulting String is interpreted as the FormalParameterList for the FunctionBody defined by the last parameter. The function code for a particular instantiation of a **Function** does not include any source text that is parsed as part of a nested FunctionBody.

第二段内容是关于Function构造函数的描述，它不是我们的重点，用一个简单的Demo示例了解一下就好了：
```js
var f = new Function("x", "y", "return x + y;");
f(3, 2);// 5
```

根据第一段内容的描述，函数代码是指那些会被解析成FunctionBody的代码部分。==说白了就是定义在函数体内部的代码==。和全局代码类似，函数代码也不包含内部函数的代码。

我们在前面已经提到过，每当调用一个函数的时候，都会有一个基于被调函数生成的、新创建的EC被压入到ECStack中。

我们来看一个例子，下面的函数在执行时递归调用了自己一次：
```js
(function foo(flag) {
  if (flag) {
    return;
  }
  foo(true);
})(false);
```
期间ECStack的变化过程如下：
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
每当函数执行结束时，==程序流离开当前执行函数对应的EC（其实就是此时位于ECStack栈顶的当前活动上下文）==，并对ECStack执行出栈操作。如此往复，直到所有的函数都调用完毕，此时ECStack就又回到刚开始时只包含全局上下文的状态，直到整个程序运行结束。

抛出一个未被捕获的异常也会导致程序流离开所有的EC（==同时ECStack不停地执行出栈操作直到程序异常结束==）：
```js
(function foo() {
  (function bar() {
    throw 'Exit from bar and foo contexts';
  })();
})();
```

#### Eval代码（Eval code）
ECMA-262-5th对Eval代码的定义如下：
> Eval code is the source text supplied to the built-in **eval** function. More precisely, if the parameter to the built-in **eval** function is a String, it is treated as an ECMAScript Program. The eval code for a particular invocation of **eval** is the global code portion of that Program.

在eval中有一个概念叫做：调用上下文（calling context），也就是当eval函数执行时所处的上下文，在eval中声明的变量和函数影响的就是这个调用上下文。看下面这个例子：
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
在ES5的严格模式下，eval的执行是在本地的沙箱环境中，所以已经不会影响调用上下文了。

在v1.7之前的老版本SpiderMonkey中，eval的第二个参数可以用来手动设置调用上下文，如果被传入的调用上下文存在的话，那么就能够修改其中的私有变量：
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
不过出于安全因素的考虑，现代的引擎已经修复了这个问题，这里仅作了解即可。

### 参考资料
1. [ECMA-262-3 in detail. Chapter 1. Execution Contexts.](http://dmitrysoshnikov.com/ecmascript/chapter-1-execution-contexts/)
2. [Executable Code and Execution Contexts](http://www.ecma-international.org/ecma-262/5.1/#sec-10)
