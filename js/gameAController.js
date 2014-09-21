com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;

    var gameAController = com_geekAndPoke_Ngm1.controllers.controller('GameAController', ['$scope', function ($scope) {
            var GROUP_INCREASE_INTERVAL = 10000;
            var MAX_NUMBER_OF_GROUPS = 5;
            var MAX_NUMBER = 100;

            var BUBBLE_FADE_OUT_TIME = 500;
            var BACKGROUND_FADE_IN_TIME = 100;
            var BACKGROUND_FADE_OUT_TIME = 500;

            var isInNewBubblePhase = true;
            var force, svg, g, circle, width, height, middleX, background, lastColor;
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
                    $scope.result = "Win";
                }
                else {
                    nextColor = "red";
                    $scope.result = "Loose";
                }
                $scope.$apply();

                if(nextColor !== lastColor) {
                    lastColor = nextColor;
                    background
                        .attr('opacity', 0.1)
                        .transition().duration(BACKGROUND_FADE_OUT_TIME).attr('opacity', 0.0)
                        .attr('fill', nextColor)
                        .transition().duration(BACKGROUND_FADE_IN_TIME).attr('opacity', 0.1);
                }

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
                }, 0);
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
                        circle
                            .attr('opacity', 1)
                            .transition().duration(BUBBLE_FADE_OUT_TIME).attr('opacity', 0);
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

                circle = g.append("circle").attr("r", radius);

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
                .attr("fill", "white")
                .attr("width", width)
                .attr("height", height)
                .attr('opacity', 0.0);

            lastGroupIncreaseTime = (new Date()).valueOf();
            $scope.level = 0;
            startBubble();
        }]
    );

    return gameAController;
})();
