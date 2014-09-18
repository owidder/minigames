com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;

    var gameAController = com_geekAndPoke_Ngm1.controllers.controller('GameAController', ['$scope', function ($scope) {
            var GROUP_INCREASE_INTERVAL = 10000;
            var MAX_NUMBER_OF_GROUPS = 5;
            var MAX_NUMBER = 100;

            var isInNewBubblePhase = true;
            var force, svg, g, width, height, middleX;
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
                if(evaluate(x)) {
                    $("#field").style("background-color: red");
                    $scope.result = "Win";
                }
                else {
                    $("#field").style("background-color: green");
                    $scope.result = "Loose";
                }
                $scope.$apply();

                $("#field").fadeIn(500);
                $("#field").fadeOut(500);

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
                    $scope.apply();
                }
            }

            function newBubble(x) {
                maybeIncreaseNumberOfGroups();
                showResult(x);

                force.nodes([]);
                force.links([]);
                force.stop();
                svg.remove();
                setTimeout(function() {
                    startBubble();
                }, 10);
            }

            function tick() {
                g.attr("transform", function(d) {
                    if(isInNewBubblePhase && Math.abs(d.x - middleX) < width/4) {
                        isInNewBubblePhase = false;
                    }
                    if(!isInNewBubblePhase && Math.abs(d.x - middleX) > width/4) {
                        isInNewBubblePhase = true;
                        setTimeout(function() {
                            newBubble(d.x);
                        }, 10);
                    }
                    return "translate(" + d.x + "," + d.y + ")";
                })
            }

            function startBubble() {
                svg = d3.select("body").append("svg")
                    .attr("width", width)
                    .attr("height", height);

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

            height = $(window).height();
            width = $(window).width();
            middleX = width / 2;

            $scope.height = height;
            $scope.width = width;

            lastGroupIncreaseTime = (new Date()).valueOf();
            $scope.level = 0;
            startBubble();
        }]
    );

    return gameAController;
})();
