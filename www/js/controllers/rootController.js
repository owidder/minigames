com_geekAndPoke_Ngm1.rootController = (function() {
    var data = com_geekAndPoke_Ngm1.data;

    var rootController = com_geekAndPoke_Ngm1.controllers.controller('RootController', function ($scope) {
        $scope.$root.rootData = new data.ScopeRootData();
    });

    return rootController;
})();
