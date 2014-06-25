/*
 * angular-placeholder v1.1.0
 * (c) 2013 Monospaced http://monospaced.com
 * License: MIT
 */

angular.module('monospaced.placeholder', [])
    .directive('msdPlaceholder', [
    '$timeout', '$window',
    function($timeout, $window) {
      'use strict';

      var placeholderColor = '#888',
          doc = $window.document,
          isInputSupported = 'placeholder' in doc.createElement('input'),
          isTextareaSupported = 'placeholder' in doc.createElement('textarea');

      return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          var domElement = element[0],
              form = angular.element(domElement.form);

          if (domElement.nodeName !== 'TEXTAREA' &&
              domElement.nodeName !== 'INPUT') {
            return;
          }

          if (isInputSupported && isTextareaSupported) {
            // If supported, create native placeholder attribute and exit
            $timeout(function() {
              element.attr('placeholder', attrs.msdPlaceholder);
            });
            return;
          }

          if (attrs.type === 'password') {
            // Placeholder obscured in older browsers,
            // so there's no point adding to password.
            return;
          }

          function init(value) {
            if (doc.activeElement === domElement) {
              return;
            }

            if (value === '' || value === attrs.msdPlaceholder) {
              domElement.value = attrs.msdPlaceholder;
              domElement.style.color = placeholderColor;
            }
          }

          function remove() {
            if (domElement.value == attrs.msdPlaceholder) {
              domElement.value = '';
              domElement.style.color = '';
            }
          }

          function restore() {
            if (domElement.value === '') {
              domElement.value = attrs.msdPlaceholder;
              domElement.style.color = placeholderColor;
            }
          }

          function reset() {
            $timeout(function() {
              init('');
            });
          }

          $timeout(function() {
            init(domElement.value);
          });

          scope.$watch(function() {
            return ngModel.$modelValue;
          }, function(newValue) {
            init(newValue);
          });

          element.bind('focus', remove);
          element.bind('blur', restore);

          // Prevent <form> from accidentally
          // submitting the placeholder text.
          form.bind('submit', remove);
          form.bind('reset', reset);

          /*
           * destroy
           */

          scope.$on('$destroy', function() {
            element.unbind('focus', focus);
            element.unbind('blur', blur);
            form.unbind('submit', remove);
            form.unbind('reset', reset);
          });
        }
      };
    }
  ]);
