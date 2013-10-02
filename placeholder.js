/*
 * angular-placeholder v1.0.0
 * (c) 2013 Monospaced http://monospaced.com
 * License: MIT
 */

angular.module('monospaced.placeholder', [])
  .directive('msdPlaceholder', ['$timeout', '$window', function($timeout, $window){
    'use strict';

    var placeholderColor = '#888';

    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel){
        var doc = $window.document,
            domElement = element[0];

        if (domElement.nodeName !== 'TEXTAREA' &&
            domElement.nodeName !== 'INPUT' ||
            attrs.type === 'password') {
          return;
        }

        var isInputSupported = 'placeholder' in doc.createElement('input'),
            isTextareaSupported = 'placeholder' in doc.createElement('textarea');

        if (isInputSupported && isTextareaSupported) {
          $timeout(function(){
            element.attr('placeholder', attrs.msdPlaceholder);
          });
          return;
        }

        function init(value){
          if (doc.activeElement === domElement) {
            return;
          }

          if (value === '' || value === attrs.msdPlaceholder) {
            domElement.value = attrs.msdPlaceholder;
            domElement.style.color = placeholderColor;
          }
        }

        function focus(){
          if (domElement.value == attrs.msdPlaceholder) {
            domElement.value = '';
            domElement.style.color = '';
          }
        }

        function blur(){
          if (domElement.value === '') {
            domElement.value = attrs.msdPlaceholder;
            domElement.style.color = placeholderColor;
          }
        }

        $timeout(function(){
          init(domElement.value);
        });

        scope.$watch(function(){
          return ngModel.$modelValue;
        }, function(newValue){
          init(newValue);
        });

        element.bind('focus', focus);
        element.bind('blur', blur);

        /*
         * destroy
         */

        scope.$on('$destroy', function(){
          element.unbind('focus', focus);
          element.unbind('blur', blur);
        });
      }
    };
  }]);
