com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;
    var fieldComponents = com_geekAndPoke_Ngm1.fieldComponents;

    var gameBController = com_geekAndPoke_Ngm1.controllers.controller('GameBController', function ($scope, $route, $location) {
        var LINK_PROBABILITY = 0.0;


        var GROUP_INCREASE_INTERVAL = 10000;
        var MAX_NUMBER_OF_GROUPS = 10;
        var MAX_NUMBER = 100;
        var START_NUMBER_OF_BUBBLES = 20;
        var NUMBER_OF_LIFES = 1;

        var BUBBLE_FADE_OUT_TIME = 300;

        var isInNewBubblePhase = true;
        var isGameOver = false;
        var force, svg, circle, width, height, middleX, roundDisplay;
        var radius;
        var bubbles;
        var bubblesData;
        var force;
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

        function cx(x) {
            return Math.max(radius, Math.min(width - radius, x));
        }

        function cy(y) {
            return Math.max(radius, Math.min(height - radius, y));
        }

        function tick() {
            bubbles.attr("transform", function(d) { return "translate(" + cx(d.x) + "," + cy(d.y) + ")"; });
        }

        function removeNodeFromArry(nodeToRemove) {
            var i, currentNode;
            for(i = 0; i < bubblesData.nodes.length; i++) {
                currentNode = bubblesData.nodes[i];
                if(currentNode.id == nodeToRemove.id) {
                    break;
                }
            }

            if(i < bubblesData.nodes.length) {
                bubblesData.nodes.splice(i, 1);
            }
        }

        function removeBubblefromField(node) {
            var bubble = d3.select(".id-" + node.id);
            if(bubble != null) {
                bubble
                    .attr('opacity', 1)
                    .transition().duration(BUBBLE_FADE_OUT_TIME).attr('opacity', 0);
            }
        }

        function clickedOnNode(node) {
            removeNodeFromArry(node);
            removeBubblefromField(node);
            start();
        }

        function start() {
            var g;

            bubbles = bubbles.data(force.nodes(), function(d) {return d.id;});

            g = bubbles.enter()
                .append("g")
                .attr("class", function(d) {return "bubble bubble-" + d.group + " id-" + d.id})
                .attr("transform", function(d) { return "translate(" + cx(d.x) + "," + cy(d.y) + ")"; })
                .call(force.drag);

            g.append("circle")
                .attr("r", radius)
                .on("click", function(d) {
                    if (d3.event.defaultPrevented) return; // ignore drag
                    clickedOnNode(d);
                });

            g.append("text")
                .text(function (d) {
                    return d.name;
                })
                .style("font-size", radius + "px")
                .attr("dx", "-.9em")
                .attr("dy", ".35em");

            bubbles.exit().remove();

            force.on("tick", tick);
        }

        function startGame() {
            var nodes = [], links = [];
            var i, j;
            var bubbleValue, group;
            var node, link;

            for(i = 0; i < START_NUMBER_OF_BUBBLES; i++) {
                bubbleValue = Math.floor(Math.random() * MAX_NUMBER);
                group = Math.floor(Math.random() * constants.MAX_NUMBER_OF_GROUPS);
                node = {
                    name: bubbleValue,
                    group: group,
                    x: Math.floor(Math.random() * width),
                    y: Math.floor(Math.random() * height),
                    id: i
                };
                nodes.push(node);

                if(i > 0) {
                    for (j = 0; j < i; j++) {
                        if(Math.random() < LINK_PROBABILITY){
                            link = {
                                source: j,
                                target: i,
                                value: 1
                            };
                            links.push(link);
                        }
                    }
                }
            }

            bubblesData = {
                nodes: nodes,
                links: links
            };

            force = d3.layout.force()
                .charge(-500)
                .linkDistance(3*radius)
                .size([width, height]);

            force
                .nodes(bubblesData.nodes)
                .links(bubblesData.links)
                .start();

            bubbles = svg.selectAll(".bubble");
            start();
        }

        $scope.result = 'none';

        height = $(window).height();
        width = $(window).width();
        middleX = width / 2;
        radius = Math.min(width, height) / 10;


        svg = d3.select("#field").append("svg")
            .attr("width", width)
            .attr("height", height);

        lifeCtr = NUMBER_OF_LIFES;

        lastGroupIncreaseTime = (new Date()).valueOf();

        startGame();
    });

    return gameBController;
})();
