//--------------------------------------------------------------------------
//
//  Classify.js v@VERSION
//  http://classify.petebrowne.com/
//
//  Copyright (c) 2010, Pete Browne
//
//--------------------------------------------------------------------------

(function() {

  //----------------------------------
  //  Constants
  //----------------------------------

  var FUNCTION  = 'function',
  STRING        = 'string',

  //----------------------------------
  //  Internal Properties
  //----------------------------------

  // The namespace where the keyword methods will be attached to.
  namespace = this,

  // The current scope to define Classes, Modules, and Methods on.
  currentObject = namespace,

  // The current Class to define Methods on.
  currentClass = null,

  // Flag to signal when we are initializing a superclass during inheritance
  inheriting = false;

  //----------------------------------
  //  Internal Methods
  //----------------------------------

  // Builds a new Class, with optional inheritance.
  function buildClass(name, superclass) {
    function Class() {
      if (!inheriting && typeof this.initialize == FUNCTION) {
        this.initialize.apply(this, arguments);
      }
    }

    if (superclass != null) {
      inheriting = true;
      Class.prototype = new superclass();
      Class.prototype.constructor = Class;
      for (var method in superclass) {
        if (typeof superclass[method] == FUNCTION) {
          namespace.def(Class, method, superclass[method]);
        }
      }
      inheriting = false;
    }

    Class.superclass            = superclass;
    Class.prototype.toString    = function() {
      return '[object ' + this.constructor.toString() + ']';
    };

    addName(currentObject, Class, name);

    return Class;
  }

  // Builds a new module.
  function buildModule(name) {
    return addName(currentObject, {}, name);
  }

  // Adds a toString method that returns the name of the object
  function addName(currentObject, object, name) {
    object.toString = function(includeModules) {
      if (includeModules === false || currentObject === namespace) {
        return name;
      }
      else {
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

    var oldClass  = currentClass,
        oldObject = currentObject;

    currentClass  = withClass;
    currentObject = withObject;

    if (typeof definition == FUNCTION) {
      definition.call(withObject);
    }
    else {
      for (var name in definition) {
        if (!(/^(constructor|prototype|toString|valueOf)$/).test(name)) {
          namespace.def(name, definition[name]);
        }
      }
    }

    currentClass  = oldClass;
    currentObject = oldObject;
  }

  // If necessary add a `callSuper` method to access the superclass's method.
  function addCallSuper(definition, superDefinition) {
    if (typeof superDefinition == FUNCTION && callsSuper(definition)) {
      return function() {
        var defArgs  = arguments,
            oldSuper = this.callSuper,
            result;

        this.callSuper = function() {
          return superDefinition.apply(this, arguments.length ? arguments : defArgs);
        };

        result = definition.apply(this, defArgs);
        this.callSuper = oldSuper;

        return result;
      };
    }

    return definition;
  }

  // Test to see if a function contains a call to `callSuper`
  function callsSuper(method) {
    return (/\b\w+\.callSuper\b/).test(method.toString());
  }

  //----------------------------------
  //  Public Methods
  //----------------------------------

  // Defines a new method. The method will be defined on the _current scope_, which will
  // be either the `window`, a Class, or Module. Within the method definition, `this` will
  // refer to the _current scope_. Optionally, you can set the object to define the method on as the
  // first argument.
  namespace.def = function(object, name, definition) {
    if (definition == null) {
      definition = name;
      name       = object;
      object     = currentClass || currentObject;
    }

    object[name] = addCallSuper(definition, object[name]);

    return object[name];
  };

  // Creates a new Class. The Class will be defined on the _current scope_, which will
  // be either the `window` or a Module. Optionally you can pass in a Superclass as the first argument.
  namespace.classify = function(superclass, object, definition) {
    if (definition == null) {
      definition = object;
      object     = superclass;
      superclass = null;
    }

    if (typeof object == STRING) {
      if (currentObject[object] == null) {
        superclass = typeof superclass == STRING ? currentObject[superclass] : superclass;
        currentObject[object] = buildClass(object, superclass);
      }
      object = currentObject[object];
    }

    addDefinition(object.prototype, object, definition);

    return object;
  };

  // Creates a new Module. Modules can be used as namespaces for other Modules
  // and Classes. They can also be used as a collection of method definitions
  // to be included into other Classes.
  namespace.module = function(object, definition) {
    if (typeof object == STRING) {
      if (currentObject[object] == null) {
        currentObject[object] = buildModule(object);
      }
      object = currentObject[object];
    }

    addDefinition(null, object, definition);

    return object;
  };

  // Includes the given Module methods into either the current Class or, optionally, the
  // given Class Definition. The included methods will be available on the instance of the Class.
  namespace.include = function(object, definition) {
    var withClass;
    if (definition == null) {
      definition = object;
      object     = currentClass || currentObject;
      withClass  = currentClass;
    } else {
      object = typeof object == STRING ? currentObject[object] : object;
      withClass = object.prototype;
    }

    addDefinition(withClass, object, definition);
  };

  // Extends the current Class or, optionally, the given Class Definition with the given
  // Module methods. The methods wil be available as Class methods.
  namespace.extend = function(object, definition) {
    if (definition == null) {
      definition = object;
      object     = currentObject;
    }
    else if (typeof object == STRING) {
      object = currentObject[object];
    }

    addDefinition(null, object, definition);
  };

  // Creates a alias for the given Method, Class, or Module definition.
  namespace.alias = function(alias, definition) {
    var object;
    if (typeof alias != STRING || definition == null) return;
    if (typeof definition == STRING) {
      object = currentClass || currentObject;
      definition = object[definition];
    } else {
      object = namespace;
    }
    object[alias] = definition;
  };

})();
