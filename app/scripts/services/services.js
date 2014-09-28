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

if(typeof(com_geekAndPoke_Ngm1) !== 'undefined') {
    module.exports(com_geekAndPoke_Ngm1);
}
