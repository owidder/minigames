'use strict';

angular.module(com_eosItServices_Dep.moduleName).factory('SimpleEvent', function() {

    return function() {
        var listeners = [];

        this.on = function(listener) {
            listeners.push(listener);
        };

        this.isSet = function() {
            return (listeners.length > 0);
        };

        this.start = function() {
            listeners.forEach(function(listener) {
                listener(arguments);
            });
        };
    }
});
