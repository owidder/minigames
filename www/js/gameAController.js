com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;

    var gameAController = com_geekAndPoke_Ngm1.controllers.controller('GameAController', function ($scope, $route, $location) {
        var GROUP_INCREASE_INTERVAL = 10000;
        var MAX_NUMBER_OF_GROUPS = 10;
        var MAX_NUMBER = 100;
        var MAX_HEALTH = 3;
        var TIMER_TICK_DURATION = 1000;
        var NUMBER_OF_LIFES = 1;
        var COLOR_HIGHLIGHT_IN = 500;
        var COLOR_HIGHLIGHT_OUT = 500;

        var NON_NUMBER_PROBABILITY = 0.00;
        var NON_NUMBERS = ['#', '*', '+', '?', '$', '='];

        var BUBBLE_FADE_OUT_TIME = 300;
        var DISPLAY_FADE_IN_TIME = 200;
        var DISPLAY_FADE_OUT_TIME = 500;
        var DISPLAY_OPACITY = 0.2;

        var isInNewBubblePhase = true;
        var isGameOver = false;
        var force, svg, g, circle, width, height, middleX, roundDisplay;
        var progressBar, timer;
        var healthState = 0, lifeCtr;
        var currentNumber, currentGroup;
        var nonNumber;
        // var points;
        var rounds;
        var lastGroupIncreaseTime;
        var currentNumberOfGroups = 1;

        var lastNumbers = {};

        function healthCounter() {
            var progress;

            healthState++;
            progress = (100 / MAX_HEALTH) * healthState;
            progressBar.attr('aria-valuenow', progress).style({'width': progress + '%', 'height': height / 20 + 'px'});

            if(healthState < 2) {
                $scope.progressStyle = 'success';
            }
            else if (healthState < MAX_HEALTH) {
                $scope.progressStyle = 'warning';
            }
            else {
                $scope.progressStyle = 'danger';
            }

            $scope.$apply();

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

        function showResult(isTimeOut, x) {
            var result;

            if(nonNumber) {
                result = isTimeOut;
            }
            else {
                result = (!isTimeOut && evaluate(x));
            }

            roundDisplay
                .attr('opacity', 0.0)
                .transition().duration(DISPLAY_FADE_IN_TIME).style({'opacity': DISPLAY_OPACITY})
                .transition().duration(DISPLAY_FADE_OUT_TIME).style({'opacity': 0.0});

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
            clearInterval(timer);
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
                // $scope.points = Math.max(0, $scope.points - currentNumber);
                lifeCtr--;
                // $($('.life')[lifeCtr]).css('opacity', 0);

                if(lifeCtr <= 0) {
                    gameOver();
                    return;
                }

                // colorHighlight(points, 'black', 'red');
            }
            else {
                // $scope.points += currentNumber;
                $scope.rounds++;

                // colorHighlight(points, 'black', 'green');
                colorHighlight(rounds, 'black', 'green');
            }

            $scope.$apply();

            maybeIncreaseNumberOfGroups();
            startBubble(BUBBLE_FADE_OUT_TIME);
        }

        function gameOver() {
            // $scope.$root.points = $scope.points;
            $scope.$root.rounds = $scope.rounds;
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
                var bubbletext, symbolIndex;

                currentGroup = Math.floor(Math.random() * currentNumberOfGroups);

                if(Math.random() > NON_NUMBER_PROBABILITY) {
                    currentNumber = Math.floor(Math.random() * (MAX_NUMBER + 1));
                    nonNumber = false;
                    bubbletext = currentNumber;
                }
                else {
                    nonNumber = true;
                    symbolIndex = Math.floor(Math.random() * NON_NUMBERS.length);
                    bubbletext = NON_NUMBERS[symbolIndex];
                }

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

                healthState = 0;
                healthCounter();
                timer = setInterval(healthCounter, TIMER_TICK_DURATION);
            }, delay);
        }

        $scope.result = 'none';

        height = $(window).height();
        width = $(window).width();
        middleX = width / 2;

        svg = d3.select("#field").append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.selectAll('.display').style({'font-size': height/2+'px'});
        roundDisplay = d3.select(".round-display");

        roundDisplay.style({'opacity': 0});

        progressBar = d3.select('.progress-bar');

        lifeCtr = NUMBER_OF_LIFES;

        lastGroupIncreaseTime = (new Date()).valueOf();
        $scope.level = 0;

        // $scope.points = 0;
        $scope.rounds = 0;

        // points = d3.select('#points');
        rounds = d3.select('#rounds');

        d3.select('#countdown').style({'font-size': height/10 + 'px'});

        startBubble();
    });

    return gameAController;
})();
