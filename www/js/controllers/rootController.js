'use strict';

angular.module(__global.appName).controller('RootController', function ($scope, data) {
    $scope.$root.rootData = new data.ScopeRootData();
});
