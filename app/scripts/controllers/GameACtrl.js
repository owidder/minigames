'use strict';

module.exports = function(ns) {
    ns.gameACtrl = ns.services.controller('GameACtrl', function ($scope, $route, $location, AppContext) {
        ns.util.clearTimer(AppContext);

        var GROUP_INCREASE_INTERVAL = 10000;
        var MAX_NUMBER_OF_GROUPS = 5;
        var MAX_NUMBER = 100;
        var MAX_HEALTH = 5;
        var TIMER_TICK_DURATION = 1000;
        var NUMBER_OF_LIFES = 3;
        var COLOR_HIGHLIGHT_IN = 500;
        var COLOR_HIGHLIGHT_OUT = 500;

        var BUBBLE_FADE_OUT_TIME = 300;
        var THUMB_FADE_IN_TIME = 200;
        var THUMB_FADE_OUT_TIME = 500;
        var THUMB_OPACITY = 0.2;

        var isInNewBubblePhase = true;
        var isGameOver = false;
        var force, svg, g, circle, width, height, middleX, thumbsUp, thumbsDown;
        var progressBar;
        var healthState = 0, lifeCtr;
        var currentNumber, currentGroup;
        var points, rounds;
        var lastGroupIncreaseTime;
        var currentNumberOfGroups = 1;

        var lastNumbers = {};

        function computePossiblePoints() {
            $scope.clock = MAX_HEALTH - healthState;
            $scope.currentNumber = currentNumber;
            $scope.possiblePoints = $scope.clock * currentNumber;
        }

        function healthCounter() {
            var progress;
            progress = (100 / MAX_HEALTH) * healthState;
            progressBar.attr('aria-valuenow', progress).style({'width': progress + '%', 'height': height / 20 + 'px'});

            console.log('progress: ' + progress);

            if(healthState < MAX_HEALTH/2) {
                $scope.progressStyle = 'success';
            }
            else if (healthState < 2*MAX_HEALTH/3) {
                $scope.progressStyle = 'warning';
            }
            else {
                $scope.progressStyle = 'danger';
            }

            computePossiblePoints();
            $scope.$apply();

            healthState++;
            if(healthState > MAX_HEALTH) {
                healthState = 0;
                roundEnd(true);
            }
        }

        function evaluate(x) {
            var lastNumber;
            lastNumber = lastNumbers[currentGroup];
            lastNumbers[currentGroup] = currentNumber;
            if(typeof(lastNumber) === 'undefined') {
                return true;
            }
            if(x < middleX) {
                return (currentNumber <= lastNumber);
            }
            else {
                return (currentNumber >= lastNumber);
            }
        }

        function showResult(isTimeOut, x) {
            var thumb, result;
            if(!isTimeOut && evaluate(x)) {
                thumb = thumbsUp;
                result = true;
            }
            else {
                thumb = thumbsDown;
                result = false;
            }

            thumb
                .attr('opacity', 0.0)
                .transition().duration(THUMB_FADE_IN_TIME).style({'opacity': THUMB_OPACITY})
                .transition().duration(THUMB_FADE_OUT_TIME).style({'opacity': 0.0});

            return result;
        }

        function maybeIncreaseNumberOfGroups() {
            if(currentNumberOfGroups >= MAX_NUMBER_OF_GROUPS) {
                return;
            }
            var currentMillis = (new Date()).valueOf();
            if(currentMillis - lastGroupIncreaseTime > GROUP_INCREASE_INTERVAL) {
                lastGroupIncreaseTime = currentMillis;
                currentNumberOfGroups++;
                $scope.level = currentNumberOfGroups - 1;
                $scope.$apply();
            }
        }

        function resetAnimations() {
            ns.util.clearTimer(AppContext);
            force.nodes([]);
            force.links([]);
            force.stop();
        }

        function colorHighlight(node, fromColor, toColor) {
            node
                .style({'color': fromColor})
                .transition().duration(COLOR_HIGHLIGHT_IN).style({'color': toColor})
                .transition().duration(COLOR_HIGHLIGHT_OUT).style({'color': fromColor});
        }

        function roundEnd(isTimeOut, x) {
            var result;

            isInNewBubblePhase = true;

            resetAnimations();
            result = showResult(isTimeOut, x);

            circle
                .attr('opacity', 1)
                .transition().duration(BUBBLE_FADE_OUT_TIME).attr('opacity', 0);

            if(!result) {
                $scope.points = Math.max(0, $scope.points - $scope.possiblePoints);
                lifeCtr--;
                $($('.life')[lifeCtr]).css('opacity', 0);

                if(lifeCtr <= 0) {
                    gameOver();
                    return;
                }

                colorHighlight(points, 'black', 'red');
            }
            else {
                $scope.points += $scope.possiblePoints;
                $scope.rounds++;

                colorHighlight(points, 'black', 'green');
                colorHighlight(rounds, 'black', 'green');
            }

            $scope.$apply();

            maybeIncreaseNumberOfGroups();
            startBubble(BUBBLE_FADE_OUT_TIME);
        }

        function gameOver() {
            AppContext.points = $scope.points;
            AppContext.rounds = $scope.rounds;
            $location.path('/gameOver');
            $scope.$apply();
        }

        function tick() {
            g.attr("transform", function(d) {
                if(!isGameOver) {
                    if(isInNewBubblePhase && Math.abs(d.x - middleX) < width/8) {
                        isInNewBubblePhase = false;
                    }
                    if(!isInNewBubblePhase && Math.abs(d.x - middleX) > width/4) {
                        roundEnd(false, d.x);
                    }
                }
                return "translate(" + d.x + "," + d.y + ")";
            })
        }

        function startBubble(delay) {
            if(ns.util.isDefined(g)) {
                g.remove();
            }

            setTimeout(function() {
                currentGroup = Math.floor(Math.random() * currentNumberOfGroups);
                currentNumber = Math.floor(Math.random() * (MAX_NUMBER + 1));

                var bubbles = {
                    nodes: [{name:currentNumber, group:currentGroup}],
                    links: []
                };

                force = d3.layout.force()
                    .charge(-150)
                    .linkDistance(10)
                    .size([width, height]);

                force
                    .nodes(bubbles.nodes)
                    .links(bubbles.links)
                    .start();

                g = svg.selectAll(".bubble")
                    .data(bubbles.nodes)
                    .enter().append("g")
                    .attr("class", function (d) {
                        return "bubble bubble-" + d.group
                    })
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .call(force.drag);

                var radius = Math.min(width, height) / 3;

                circle = g.append("circle").attr("r", radius);

                g.append("text")
                    .text(function(d) { return d.name; })
                    .style("font-size", radius + "px")
                    .attr("dx", "-.9em")
                    .attr("dy", ".35em");

                force.on("tick", tick);

                healthState = 0;
                computePossiblePoints();
                $scope.$apply();
                ns.util.clearTimer(AppContext);
                ns.util.storeTimer(AppContext, setInterval(healthCounter, TIMER_TICK_DURATION));
            }, delay);
        }

        $scope.result = 'none';

        height = $(window).height();
        width = $(window).width();
        middleX = width / 2;

        svg = d3.select("#field").append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.selectAll('.thumb').style({'font-size': height+'px'});
        thumbsDown = d3.select(".thumb.loose");
        thumbsUp = d3.select('.thumb.win');

        thumbsDown.style({'opacity': 0});
        thumbsUp.style({'opacity': 0});

        progressBar = d3.select('.progress-bar');

        lifeCtr = NUMBER_OF_LIFES;

        lastGroupIncreaseTime = (new Date()).valueOf();
        $scope.level = 0;

        $scope.points = 0;
        $scope.maxClock = MAX_HEALTH;
        $scope.rounds = 0;

        points = d3.select('#points');
        rounds = d3.select('#rounds');

        d3.select('#countdown').style({'font-size': height/10 + 'px'});

        startBubble();
    });
};
