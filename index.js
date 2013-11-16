"use strict";

function bindings(filter, root) {

	if ( !('querySelectorAll' in document && 'defineProperty' in Object && 'reduce' in Array.prototype) ) {
		return {};
	}
	root = root || document;

	var bindingsObject = {};
	var selector = (filter) ? '[data-bind^="'+filter+'."]' : '[data-bind]';
	var elements = $(selector, root);

	elements.forEach(appendToBindingsObject, bindingsObject);

	function appendToBindingsObject(element) {
		var binding = element.getAttribute('data-bind');
		if ( filter ) binding = binding.split(filter+'.')[1];
		var bindingStrings = binding.split('.');

		bindingStrings.reduce(convertStringToObject, this);

		function convertStringToObject(object, string, index, arrayOfStrings) {
			if ( index === arrayOfStrings.length-1 ) {
				addGettersAndSetters(object, string);
			}
			if (!object[string]) {
				object[string] = {};
			}
			return object[string];
		}

		function addGettersAndSetters(object, property) {
			Object.defineProperty(object, property, {
				get: function() {
					if (!element.parentNode) {
						delete object[property];
						return undefined;
					}
					return element.innerHTML;
				},
				set: function(value) {
					if (!element.parentNode) {
						delete object[property];
						throw new Error('element is not part of the dom');
					}
					element.innerHTML = value;
				},
				enumerable: true,
				configurable: true
			});
		}
	}

	return bindingsObject;
}

function $(selector, root) {
	root = root || document;
	return Array.prototype.slice.call(root.querySelectorAll(selector));
}

module.exports = bindings;
