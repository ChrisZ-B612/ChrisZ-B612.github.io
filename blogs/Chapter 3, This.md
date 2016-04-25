第三章：This
---

### 定义
> this is a property of the execution context. It’s a special object in which context a code is executed.
```js
activeExecutionContext = {
  VO: {...},
  this: thisValue
};
```

### 重点摘要
* *this* is directly related to the type of executable code of the context. The value is determined on entering the context and is immutable while the code is running in the context, it is not possible to assign a new value to it since *this* is not a variable.

* In the global code, *this* value is always the global object itself.

* The first (and, probably, the main) feature of *this* value in function code is that here it is not statically bound to a function.

* It is necessary to understand and remember this important point in order to be able to determine *this* value in any context without any problems. Exactly the form of a call expression, the way of calling the function, influences *this* value of a called context.

* Using pseudo-code the value of Reference type can be represented as an object with two properties: base (i.e. object to which a property belongs) and a propertyName in this base:
```js
var valueOfReferenceType = {
	base: <base object>,
    propertyName: <property name>
};
```

* Value of Reference type can be only in two cases:
  1. when we deal with an identifier;
  2. or with a property accessor.

* For getting the real value of an object from a value of Reference type there is GetValue method which in a pseudo-code can be described as follows:
```js
function GetValue(value) {

	if (Type(value) != Reference) {
    	return value;
    }

    var base = GetBase(value);

    if (base === null) {
    	throw new ReferenceError;
    }

	/**
     * The internal [[Get]] method returns the real value of object’s property,
     * including as well analysis of the inherited properties from a prototype chain.
     */
    return base.[[Get]](GetPropertyName(value));
}
```

* The general rule of determination of *this* value in a function context sounds as follows:

> The value of this in a function context is provided by the caller and determined by the current form of a call expression (how the function call is written syntactically).

> If on the left hand side from the call parentheses ( ... ), there is a value of Reference type then this value is set to the base object of this value of Reference type.

> In all other cases (i.e. with any other value type which is distinct from the Reference type), this value is always set to null. But since there is no any sense in null for this value, it is implicitly converted to global object.

* Note, in the strict mode of ES5 this value is not coerced to global object, but instead is set to undefined.

* The activation object always returns *this* value as null, consequencely, to global object.

* When function called as the constructor, the new operator calls the internal [[Construct]] method of the function which, in turn, after object creation, calls the internal [[Call]] method, all the same function, having provided as *this* value newly created object.

### 参考资料
[ECMA-262-3 in detail. Chapter 3. This.](http://dmitrysoshnikov.com/ecmascript/chapter-3-this/)