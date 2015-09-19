'use strict';

angular.module(__global.appName).directive("healthCounter", function(util, $interval) {
    function link(scope) {
        var TIMER_TICK_DURATION = 1000;

        var progressBar = d3.select('#bar-' + scope.counterId);
        var healthState;
        var timer;

        if(!util.isDefined(maxHealth)) {
            maxHealth = MAX_HEALTH;
        }

        function count () {

            var progress;

            healthState++;
            progress = (100 / scope.maxHealth) * healthState;
            progressBar.attr('aria-valuenow', progress).style({'width': progress + '%', 'height': height / 20 + 'px'});

            if(healthState < scope.maxHealth / 2) {
                scope.progressStyle = 'success';
            }
            else if (healthState < scope.maxHealth) {
                scope.progressStyle = 'warning';
            }
            else {
                scope.progressStyle = 'danger';
            }

            if(healthState > maxHealth) {
                reset();
                scope.roundEndEventOut.start(true);
            }
        }

        function reset() {
            $interval.cancel(timer);
            healthState = 0;
        }

        function start() {
            reset();
            count();
            timer = $interval(count, TIMER_TICK_DURATION);
        }

        scope.resetEventIn.on(reset);
        scope.startEventIn.to(start);

        d3.select('#countdown').style({'font-size': height/10 + 'px'});
        reset();
    }

    return {
        link: link,
        scope: {
            counterId: "@",
            maxHealth: "@",
            roundEndEventOut: "=",
            resetEventIn: "=",
            startEventIn: "="
        },
        restrict: "E",
        templateUrl: ""
    }
});