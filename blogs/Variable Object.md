变量对象
---

### 名词解释
| 名词 | 解释 |
|--------|--------|
| Global Object | 全局对象，即宿主环境的根对象，在浏览器中就是window对象 |
| Execution Context| 执行上下文，包括全局执行上下文和函数执行上下文两种 |
| Global Execution Context| 全局执行上下文，代码执行默认先进入全局执行上下文，以下简称全局上下文 |
| Function Execution Context | 函数执行上下文，调用函数时即进入被调函数的执行上下文，以下简称函数上下文 |
| Variable Object | 变量对象，执行上下文的一个属性，用来保存代码运行时的变量、函数等等 |
| Activation Object | 活动对象，函数上下文的变量对象的别名 |

### 变量对象
变量对象（Variable Object，简写成VO）是执行上下文的一个属性，用来保存代码运行时的变量、函数等等。当我们声明一个变量或者函数的时候，其实就是在变量对象上添加了一个新的属性。

例如：
```js
var a = 10;

function test(x) {
  var b = 20;
};

test(30);
```
相对应的变量对象就类似这样：
```js
// Variable object of the global context
VO(globalContext) = {
  a: 10,
  test: <reference to "test" function>
};

// Variable object of the "test" function context
VO(test) = {
  x: 30,
  b: 20
};
```
从语言的规范和实现上来讲，变量对象只是一个虚拟的实体，并不是一个真正的JavaScript对象。实际上，执行上下文中的变量对象的名称和初始化结构都不太一样。在ES5中, 变量对象的概念被替换成了*lexical environments model*。

函数上下文中的变量对象无法直接访问。但是在全局上下文中，变量对象就是全局对象，所以在全局上下文中可以通过全局对象来访问变量对象，并且全局上下文中的*this*就指向全局对象，所以在全局上下文中：`变量对象 === 全局对象 === this`。

### 全局对象
#### 定义
> Global object is the object which is created before entering any execution context; this object exists in the single copy, its properties are accessible from any place of the program, the life cycle of the global object ends with program end.

#### 初始化
初始化全局对象时，首先会添加`Math`、`String`、`Date`、`parseInt`等等属性到全局对象上。如果是在BOM中，还会添加引用全局对象自身的window属性到全局对象上，初始化后的全局对象就类似这样：
```js
global = {
	Math: <...>,
    String: <...>
    ...
    ...
    window: global
};
```

### 函数上下文
在函数的执行上下文中，变量对象也被称为活动对象。活动对象在进入函数上下文的时候就被创建，并被添加arguments属性到活动对象上，属性值是一个Arguments对象，Arguments对象包含了以下属性：
* callee - 指向当前被调用函数的引用
* length - 实际传入参数的个数
* properties-indexes - 整数，被转换成字符串。它们的值和传入的实参值一一对应，并且数据是相互共享。它们的数量等于arguments的length值。

请看以下示例：
```js
function foo(x, y, z) {

  // quantity of defined function arguments (x, y, z)
  alert(foo.length); // 3

  // quantity of really passed arguments (only x, y)
  alert(arguments.length); // 2

  // reference of a function to itself
  alert(arguments.callee === foo); // true

  // parameters sharing
  alert(x === arguments[0]); // true
  alert(x); // 10

  arguments[0] = 20;
  alert(x); // 20

  x = 30;
  alert(arguments[0]); // 30

  // however, for not passed argument z,
  // related index-property of the arguments
  // object is not shared
  z = 40;
  alert(arguments[2]); // undefined

  arguments[2] = 50;
  alert(z); // 40

}

foo(10, 20);
```
在ES5中，活动对象的概念被替换成了common and single model of lexical environments。

### 代码的执行
JavaScript代码的执行分为两个阶段：
1. **进入执行上下文阶段**；
2. **代码运行阶段**。

无论是全局上下文还是函数上下文都是如此。

#### 进入执行上下文阶段
在进入执行上下文时（此时代码还没执行），首先会初始化变量对象，初始化过程如下：
* 函数的形参（如果是函数上下文的话）：在变量对象上为每一个形参创建一个属性，属性名就是参数名，属性值就是传入的参数值，**没有传入参数值的就初始化为*undefined***；
* 函数声明（FunctionDeclaration^FD^）：在变量对象上为每一个函数声明创建一个属性，属性名就是函数名，属性值就是对函数对象的引用，如果在变量对象上已经有同名的属性存在，**那就覆盖它**。
* 变量声明（VariableDeclaration^var^）：在变量对象上为每一个变量声明创建一个属性，属性名就是变量名，**属性值初始化为undefined**，如果在变量对象上已经有同名的属性存在，**那么不予处理**。

举个栗子：
```js
function test(a, b) {
  var c = 10;
  function d() {}
  var e = function _e() {};
  (function x() {});
}

test(10); // call
```
在进入test函数的执行上下文时，它的活动对象被初始化成这样：
```js
AO(test) = {
  a: 10,
  b: undefined,
  c: undefined,
  d: <reference to FunctionDeclaration "d">
  e: undefined
};
```
注意，在活动对象中并不包含函数x，这是因为x是一个函数表达式（FunctionExpression^FE^）而不是函数声明，而函数表达式是不会保存到活动对象上的。虽然函数_e也是一个函数表达式，但是因为变量e保存了对它的引用，所以仍然可以通过变量e来访问到函数_e。

#### 代码运行阶段
进入到这个阶段，代码才开始真正的执行。上面示例中的活动对象AO(test)在本阶段完成后会被修改成这样：
```js
AO['c'] = 10;
AO['e'] = <reference to FunctionExpression "_e">;
```
因为函数x没有被保存到活动对象上，所以在代码执行的整个过程中，任何地方都无法调用到函数x。如果函数表达式没有被保存到变量上的话，那么它只能在它自己的函数体内部被调用到（即递归调用）。

### 再谈变量
很多关于JavaScript的文章甚至是书籍都宣称：在全局环境中通过var声明变量，和在函数中不使用var声明变量，两种方式都会创建全局变量。但事实并非如此，请记住：**变量只能通过var关键字来声明**。

像这样的赋值操作：
```js
a = 10;
```
只是在全局对象上创建了一个新的属性，但并不是创建了一个变量，说它不是变量是说它并不是ECMAScript标准中定义的变量。这两者的区别可以从下面的示例中看出来：
```js
alert(a); // undefined
alert(b); // "b" is not defined

b = 10;
var a = 20;
```
这一切都跟变量对象有关。我们从[代码执行的两个阶段](#代码的执行)来看一看。首先是[进入执行上下文阶段](#进入执行上下文阶段)：
```js
VO = {
  a: undefined
};
```
可以看到在这个阶段变量对象上并没有b属性，因为b根本就不是一个变量，b只会在[运行代码阶段](#运行代码阶段)被创建，但是在我们的示例中，b还没来得及被创建就因为alert(b)的调用导致运行报错进而导致程序中断。

我们把代码稍微改一改，就能看得更清楚了：
```js
alert(a); // undefined, we know why

b = 10;
alert(b); // 10, created at code execution

var a = 20;
alert(a); // 20, modified at code execution
```

还有一个关于变量的重要知识点：与普通的属性不同，变量有`{DontDelete}`属性，意味着不能通过delete操作符删除变量。
```js
a = 10;
alert(window.a); // 10

alert(delete a); // true

alert(window.a); // undefined

var b = 20;
alert(window.b); // 20

alert(delete b); // false

alert(window.b); // still 20
```
在ES5中，`{DontDelete}`被改成了[[Configurable]]，而且可以通过`Object.defineProperty`方法进行修改。

但是在eval的执行上下文中上面的规则并不适用：eval中的变量并没有被设置`{DontDelete}`属性。
```js
eval('var a = 10;');
alert(window.a); // 10

alert(delete a); // true

alert(window.a); // undefined
```
一些浏览器的debug工具就是使用eval来运行你的代码（例如Firebug），在这些debug工具中通过var声明的变量没有`{DontDelete}`属性，所以可以通过delete操作如删除它们。