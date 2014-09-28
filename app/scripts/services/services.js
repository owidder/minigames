'use strict';

module.exports = function(ns) {
    ns.services =
        angular.module('services', []).factory('AppContext', function() {
        return {
            points:0,
            rounds:0
        }
    });
};
