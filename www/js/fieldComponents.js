com_geekAndPoke_Ngm1.fieldComponents = (function () {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;

    var height = $(window).height();

    function HealthCounter(aScope, aRoundEndCallBack) {
        var MAX_HEALTH = 3;
        var TIMER_TICK_DURATION = 1000;

        var progressBar = d3.select('.progress-bar');
        var scope = aScope;
        var healthState;
        var roundEndCallBack = aRoundEndCallBack;
        var timer;

        function count () {

            var progress;

            healthState++;
            progress = (100 / MAX_HEALTH) * healthState;
            progressBar.attr('aria-valuenow', progress).style({'width': progress + '%', 'height': height / 20 + 'px'});

            if(healthState < 2) {
                scope.progressStyle = 'success';
            }
            else if (healthState < MAX_HEALTH) {
                scope.progressStyle = 'warning';
            }
            else {
                scope.progressStyle = 'danger';
            }

            scope.$apply();

            if(healthState > MAX_HEALTH) {
                healthState = 0;
                roundEndCallBack(true);
            }
        }

        this.reset = function () {
            clearInterval(timer);
            healthState = 0;
        };

        this.start = function() {
            this.reset();
            count();
            timer = setInterval(count, TIMER_TICK_DURATION);
        }

        d3.select('#countdown').style({'font-size': height/10 + 'px'});
        this.reset();
    }

    function GeneralDisplay(aScope, aCssSelector, aScopeProperty) {
        var DISPLAY_FADE_IN_TIME = 200;
        var DISPLAY_FADE_OUT_TIME = 500;
        var DISPLAY_OPACITY = 0.2;

        var display;
        var scope = aScope;
        var cssSelector = aCssSelector;
        var scopeProperty = aScopeProperty;

        this.show = function(value) {
            if(util.isSet(value)) {
                scope[scopeProperty] = value;
                scope.$apply();
            }

            display
                .attr('opacity', 0.0)
                .transition().duration(DISPLAY_FADE_IN_TIME).style({'opacity': DISPLAY_OPACITY})
                .transition().duration(DISPLAY_FADE_OUT_TIME).style({'opacity': 0.0});

        };

        display = d3.select(cssSelector);
        display.style({'font-size': height/3+'px'});
        display.style({'opacity': 0});
    }

    function PointDisplay(aScope) {
        var points;

        var generalDisplay = new GeneralDisplay(aScope, ".point-display", "pointDisplay");

        this.reset = function() {
            points = 0;
        };

        this.increase = function() {
            points++;
            generalDisplay.show(points);
        };

        this.getPoints = function() {
            return points;
        };

        this.reset();
    }

    return {
        HealthCounter: HealthCounter,
        PointDisplay: PointDisplay,
        GeneralDisplay: GeneralDisplay
    }

})();