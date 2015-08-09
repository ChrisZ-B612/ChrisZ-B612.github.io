//--------------------------------------------------------------------------
//
//  Classify.js v0.10.8
//  http://classify.petebrowne.com/
//
//  Copyright (c) 2010, Pete Browne
//
//--------------------------------------------------------------------------

(function() {

	// ----------------------------------
	// Constants
	// ----------------------------------

	var FUNCTION = 'function', STRING = 'string',

	// ----------------------------------
	// Internal Properties
	// ----------------------------------

	// The namespace where the keyword methods will be attached to.
	// 关键方法所在的命名空间，在浏览器中就是Window，包括：def, classify, module, include, extend, alias。
	namespace = this,

	// The current scope to define Classes, Modules, and Methods on.
	// 定义类、模块和方法时的上下文。
	currentObject = namespace,

	// The current Class to define Methods on.
	// 定义方法时所在的类。
	currentClass = null,
 
	// Flag to signal when we are initializing a superclass during inheritance
	// 一个在实现继承时会被用到的临时标识位，下面会讲到它的用途。
	inheriting = false;

	// ----------------------------------
	// Internal Methods
	// ----------------------------------

	// Builds a new Class, with optional inheritance.
	// 定义一个类，可以选择继承另一个类作为它的父类。
	function buildClass(name, superclass) {
		// *_*这个就是使用Classify定义的类的本质，就是一个名为Class的很简单的一个函数。
		function Class() {
			/**
			 * inheriting标识位在这里被使用，首先我们可以通过定义一个名为initialize的方法来作为类的构造函数，
			 * 而当要创建一个类并指定了它的父类时，会通过Class.prototype = new superclass()来创建一个父类的实例并将其赋给
			 * 子类的prototype属性来建立继承的关系，此时被创建出来的父类对象是不应该走它的initialize方法的，所以这里可以
			 * 通过控制inheriting的true/false来区分一个类被创建时是应该走initialize构造函数（正常使用时）还是不应该走initialize构造函数（继承时）。
			 */
			if (!inheriting && typeof this.initialize == FUNCTION) {
				this.initialize.apply(this, arguments);
			}
		}

		if (superclass != null) {
			inheriting = true;//开启标志位。
			Class.prototype = new superclass();
			for ( var method in superclass) {//*_*子类会继承父类的类方法。
				if (typeof superclass[method] == FUNCTION) {
					namespace.def(Class, method, superclass[method]);
				}
			}
			inheriting = false;//关闭标志位。
		}

		Class.superclass = superclass;//*_*将父类的引用保存到子类的superclass属性中，这个非常有用！
		Class.prototype.constructor = Class;//如果有继承，那么将prototype的constructor指向正确的值。
		Class.prototype.toString = function() {//添加实例对象的toString方法。
			return '[object ' + this.constructor.toString() + ']';
		};

		addName(currentObject, Class, name);//添加类方法toString，一个有用的方法。

		return Class;
	}

	// Builds a new module.
	// *_*创建一个新的模块，其实就是一个带toString方法的简单对象。
	function buildModule(name) {
		return addName(currentObject, {}, name);
	}

	// Adds a toString method that returns the name of the object
	// 添加一个toString方法，主要用到了闭包。
	function addName(currentObject, object, name) {
		object.toString = function(includeModules) {
			if (includeModules === false || currentObject == null || currentObject === namespace) {
				return name;
			} else {
				return currentObject + '.' + name;
			}
		};
		return object;
	}

	// Add the given methods to the object.
	function addDefinition(withClass, withObject, definition) {
		if (withObject == null || definition == null) {
			return;
		}

		// 将currentClass和currentObject临时存起来。
		var oldClass = currentClass, oldObject = currentObject;

		// 改变上下文。
		currentClass = withClass;
		currentObject = withObject;

		if (typeof definition == FUNCTION) {
			definition.call(withObject);//进入类定义方法。
		} else {
			for ( var name in definition) {
				if (!(/^(constructor|prototype|toString|valueOf)$/).test(name)) {
					namespace.def(name, definition[name]);
				}
			}
		}

		// 恢复上下文。
		currentClass = oldClass;
		currentObject = oldObject;
	}

	// If necessary add a `callSuper` method to access the superclass's method.
	// *_*子方法中的callSuper能够访问父类方法的本质，其实就是通过一个闭包来代理子方法，闭包中保存了子方法和父方法的原实现。
	function addCallSuper(definition, superDefinition) {
		if (typeof superDefinition == FUNCTION && callsSuper(definition)) {
			return function() {
				//如果子类中恰好也定义了一个callSuper方法，那么暂时先将它保存起来以避免冲突。
				var defArgs = arguments, oldSuper = this.callSuper, result;

				this.callSuper = function() {
					//如果callSuper调用时指定了参数，那么就使用指定的参数调用父方法，否则就默认使用原参数，非常地灵活方便。
					return superDefinition.apply(this, arguments.length ? arguments : defArgs);
				};

				result = definition.apply(this, defArgs);
				this.callSuper = oldSuper;//还原callSuper。

				return result;
			};
		}

		return definition;
	}

	// Test to see if a function contains a call to `callSuper`
	// 测试子方法中是否调用了父方法。
	function callsSuper(method) {
		return (/\bthis\.callSuper\b/).test(method.toString());
	}

	// ----------------------------------
	// Public Methods
	// ----------------------------------

	// Defines a new method. The method will be defined on the _current scope_,
	// which will be either the `window`, a Class, or Module. Within the method definition,
	// `this` will refer to the _current scope_. Optionally, you can set the object to
	// define the method on as the first argument.
	/**
	 * 定义一个方法。该方法会被定义在当前上下文中，可能是window、一个类或一个模块。在方法定义中，this会
	 * 指向当前上下文。你也可以在第一个参数中指定方法被定义的对象。
	 */
	namespace.def = function(object, name, definition) {
		// 参数归位，下面很多地方都这样使用。
		if (definition == null) {
			definition = name;
			name = object;
			object = currentClass || currentObject;//方法会被定义在当前类或当前对象中。
		}

		object[name] = addCallSuper(definition, object[name]);

		return object[name];
	};

	// Creates a new Class. The Class will be defined on the _current scope_,
	// which will be either the `window` or a Module. Optionally you can pass in a
	// Superclass as the first argument.
	// 定义一个类。该类会被定义在当前上下文中，可能是window或一个模块。你也可以在第一个参数中指定它的父类。
	namespace.classify = function(superclass, object, definition) {
		if (definition == null) {
			definition = object;
			object = superclass;
			superclass = null;//无父类。
		}

		//这里可以通过设置一个字符串参数来创建一个新类或者直接获取一个已存在的类。
		if (typeof object == STRING) {
			if (currentObject[object] == null) {//如果类之前没被定义过，那么定义一个。
				currentObject[object] = buildClass(object, superclass);
			}
			object = currentObject[object];
		}
		
		//甚至可以直接指定某个已经存在的类进行增强。
		addDefinition(object.prototype, object, definition);//开始创建类。

		return object;
	};

	// Creates a new Module. Modules can be used as namespaces for other Modules
	// and Classes. They can also be used as a collection of method definitions
	// to be included into other Classes.
	/**
	 * 创建一个模块。模块不仅可以作为其他模块和类的命名空间，还可以在其中定义一系列方法后引入到其他类中作为类方法或成员方法使用。
	 */
	namespace.module = function(object, definition) {
		if (typeof object == STRING) {
			if (currentObject[object] == null) {//创建一个新模块
				currentObject[object] = buildModule(object);
			}
			object = currentObject[object];//如果currentObject[object] !== null，那么可以直接获取一个已存在的模块
		}

		/**
		 * 指定第一个参数为null，使得definition中的新方法会被定义在当前模块中，
		 * 指定第二个参数为当前模块，使得definition中的新类和新模块会被定义在当前模块中。
		 */
		addDefinition(null, object, definition);

		return object;
	};

	// Includes the given Module methods into either the current Class or, optionally,
	// the given Class Definition. The included methods will be available on the instance of the Class.
	/**
	 * 将模块中的方法引入到当前类或指定类中作为成员方法。
	 */
	namespace.include = function(object, definition) {
		if (definition == null) {
			definition = object;
			object = currentClass || currentObject;
		} else if (typeof object == STRING) {
			/**
			 * *_*这里有问题，跟API上的说明不符。
			 * 经测试：通过include将Module中定义的方法引入到一个已定义的Class中时，
			 * Module中的方法会成为被引入Class的类函数而不是成员函数，
			 * 所以如果要将模块中的方法引入到类中的话只能通过第一种方式做到。
			 */
			object = currentObject[object];
		}

		addDefinition(currentClass, object, definition);
	};

	// Extends the current Class or, optionally, the given Class Definition with the given
	// Module methods. The methods will be available as Class methods.
	/**
	 * 将模块中的方法引入到当前类或指定类中作为类方法。
	 */
	namespace.extend = function(object, definition) {
		if (definition == null) {
			definition = object;
			object = currentObject;
		} else if (typeof object == STRING) {
			object = currentObject[object];
		}

		addDefinition(null, object, definition);
	};

	// Creates a alias for the given Method, Class, or Module definition.
	/**
	 * 毫无用处的alias方法:(
	 */
	namespace.alias = function(alias, method) {
		var object = currentClass || currentObject;

		object[alias] = object[method];
	};

})();
