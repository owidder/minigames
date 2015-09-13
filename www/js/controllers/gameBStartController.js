com_geekAndPoke_Ngm1.menuController = (function() {

    var gameStartController = com_geekAndPoke_Ngm1.controllers.controller('GameBStartController', function ($scope) {
        $scope.gameId = "gB";
        $scope.gameName = "Touchi";

        $scope.highscore = $scope.$root.rootData.highscore_B;
        $scope.bgClass = "bg_orange";
        $scope.section1 = "Kill the bubbles by touching them.\n" +
            "But only the bubbles with the highest numbers!\n" +
            "Dont let there be more than 30 bubbles!";
        $scope.section2 = "BEWARE THE CLOUD!!! It heralds fresh bubbles.";
    });

    return gameStartController;
})();
