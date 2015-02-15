com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;
    var fieldComponents = com_geekAndPoke_Ngm1.fieldComponents;

    var gameAController = com_geekAndPoke_Ngm1.controllers.controller('GameBController', function ($scope, $route, $location) {
        var GROUP_INCREASE_INTERVAL = 10000;
        var MAX_NUMBER_OF_GROUPS = 10;
        var MAX_NUMBER = 100;
        var NUMBER_OF_LIFES = 1;

        var BUBBLE_FADE_OUT_TIME = 300;

        var isInNewBubblePhase = true;
        var isGameOver = false;
        var force, svg, g, circle, width, height, middleX, roundDisplay;
        var lifeCtr;
        var currentNumber, currentGroup;
        var lastGroupIncreaseTime;
        var currentNumberOfGroups = 1;

        var lastNumbers = {};

        var pointDisplay = new fieldComponents.PointDisplay($scope);
        var healthCounter = new fieldComponents.HealthCounter($scope, roundEnd);

        function evaluate(x) {
            var lastNumber;
            lastNumber = lastNumbers[currentGroup];
            lastNumbers[currentGroup] = currentNumber;
            if(typeof(lastNumber) === 'undefined') {
                return true;
            }

            if(!util.isNumeric(lastNumber)) {
                return true;
            }
            else if(x < middleX) {
                return (currentNumber <= lastNumber);
            }
            else {
                return (currentNumber >= lastNumber);
            }
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
            healthCounter.reset();
            force.nodes([]);
            force.links([]);
            force.stop();
        }

        function roundEnd(isTimeOut, x) {
            var passed;

            isInNewBubblePhase = true;

            resetAnimations();
            passed = (!isTimeOut && evaluate(x));

            circle
                .attr('opacity', 1)
                .transition().duration(BUBBLE_FADE_OUT_TIME).attr('opacity', 0);

            if(!passed) {
                lifeCtr--;

                if(lifeCtr <= 0) {
                    gameOver();
                    return;
                }

            }
            else {
                pointDisplay.increase();
            }

            $scope.$apply();

            maybeIncreaseNumberOfGroups();
            startBubble(BUBBLE_FADE_OUT_TIME);
        }

        function gameOver() {
            $scope.$root.points = pointDisplay.getPoints();
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
            if(util.isDefined(g)) {
                g.remove();
            }

            setTimeout(function() {
                var bubbletext;

                currentGroup = Math.floor(Math.random() * currentNumberOfGroups);

                currentNumber = Math.floor(Math.random() * (MAX_NUMBER + 1));
                bubbletext = currentNumber;

                var bubbles = {
                    nodes: [{name:bubbletext, group:currentGroup}],
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

                healthCounter.start();
            }, delay);
        }

        $scope.result = 'none';

        height = $(window).height();
        width = $(window).width();
        middleX = width / 2;

        svg = d3.select("#field").append("svg")
            .attr("width", width)
            .attr("height", height);

        lifeCtr = NUMBER_OF_LIFES;

        lastGroupIncreaseTime = (new Date()).valueOf();
        $scope.level = 0;

        $scope.rounds = 0;

        rounds = d3.select('#rounds');

        startBubble(BUBBLE_FADE_OUT_TIME);
    });

    return gameAController;
})();
