com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;

    var gameAController = com_geekAndPoke_Ngm1.controllers.controller('GameAController', ['$scope', function ($scope) {
            var GROUP_INCREASE_INTERVAL = 10000;
            var MAX_NUMBER_OF_GROUPS = 5;
            var MAX_NUMBER = 100;

            var BUBBLE_FADE_OUT_TIME = 1000;
            var BACKGROUND_FADE_IN_TIME = 100;
            var BACKGROUND_FADE_OUT_TIME = 1000;

            var isInNewBubblePhase = true;
            var force, svg, g, width, height, middleX, background;
            var currentNumber, currentGroup;
            var lastGroupIncreaseTime;
            var currentNumberOfGroups = 1;

            var lastNumbers = {};

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

            function showResult(x) {
                var nextColor;
                if(evaluate(x)) {
                    nextColor = "green";
                    background.attr("class", "win");
                    $scope.result = "Win";
                }
                else {
                    background.attr("class", "loose");
                    $scope.result = "Loose";
                }
                $scope.$apply();

/*
                colorField
                    .transition().duration(BACKGROUND_FADE_IN_TIME).attr('opacity', 0.5)
                    .transition().duration(BACKGROUND_FADE_OUT_TIME).attr('opacity', 0.0);
*/

                console.log($scope.result);
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

            function newBubble(x) {
                maybeIncreaseNumberOfGroups();

                g.remove();
                setTimeout(function() {
                    startBubble();
                }, 10);
            }

            function tick() {
                g.attr("transform", function(d) {
                    if(isInNewBubblePhase && Math.abs(d.x - middleX) < width/8) {
                        isInNewBubblePhase = false;
                        console.log('A - x: ' + d.x, 'middleX: ' + middleX);
                    }
                    if(!isInNewBubblePhase && Math.abs(d.x - middleX) > width/4) {
                        isInNewBubblePhase = true;
                        console.log('B - x: ' + d.x, 'middleX: ' + middleX);
                        console.log("call: showResult("+ d.x+")");
                        force.nodes([]);
                        force.links([]);
                        force.stop();
                        showResult(d.x);
                        g.transition().duration(BUBBLE_FADE_OUT_TIME).attr('opacity', 0);
                        setTimeout(function() {
                            newBubble(d.x);
                        }, BUBBLE_FADE_OUT_TIME);
                    }
                    return "translate(" + d.x + "," + d.y + ")";
                })
            }

            function startBubble() {
                var group = Math.floor(Math.random() * currentNumberOfGroups);
                currentNumber = Math.floor(Math.random() * (MAX_NUMBER + 1));

                var bubbles = {
                    nodes: [{name:currentNumber, group:group}],
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

                g.append("circle").attr("r", radius);

                g.append("text")
                    .text(function(d) { return d.name; })
                    .style("font-size", radius + "px")
                    .attr("dx", "-.9em")
                    .attr("dy", ".35em");

                force.on("tick", tick);
            }

            $scope.result = 'none';

            height = $(window).height();
            width = $(window).width();
            middleX = width / 2;

            svg = d3.select("#field").append("svg")
                .attr("width", width)
                .attr("height", height);

            background = svg.append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "start");

            lastGroupIncreaseTime = (new Date()).valueOf();
            $scope.level = 0;
            startBubble();
        }]
    );

    return gameAController;
})();
