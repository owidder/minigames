com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;
    var fieldComponents = com_geekAndPoke_Ngm1.fieldComponents;

    var gameBController = com_geekAndPoke_Ngm1.controllers.controller('GameBController', function ($scope, $route, $location) {
        var MAX_NUMBER = 100;
        var START_NUMBER_OF_BUBBLES = 5;

        var BUBBLE_FADE_OUT_TIME = 300;

        var svg, width, height, middleX;
        var radius;
        var bubbles;
        var bubblesData;
        var force;
        var numbers = [];

        var pointDisplay = new fieldComponents.PointDisplay($scope);

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
            if(isBiggestNumber(node.name)) {
                removeBiggestNumber();
                pointDisplay.increase();
                removeNodeFromArry(node);
                removeBubblefromField(node);
                start();
            }
            else {
                gameOver();
            }
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
                .attr("dy", ".35em")
                .on("click", function(d) {
                    if (d3.event.defaultPrevented) return; // ignore drag
                    clickedOnNode(d);
                });

            bubbles.exit().remove();

            force.on("tick", tick);
        }

        function newNumber() {
            var number = Math.floor(Math.random() * MAX_NUMBER);
            numbers.push(number);
            numbers.sort();

            return number;
        }

        function isBiggestNumber(number) {
            return (number == numbers[numbers.length-1]);
        }

        function removeBiggestNumber() {
            numbers.splice(numbers.length-1, 1);
        }

        function newBubble(id) {
            var bubbleValue, group;
            var node;

            bubbleValue = newNumber();
            group = Math.floor(Math.random() * constants.MAX_NUMBER_OF_GROUPS);
            node = {
                name: bubbleValue,
                group: group,
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height),
                id: id
            };

            return node;
        }

        function startGame() {
            var nodes = [], links = [];
            var i, j;
            var node;

            for(i = 0; i < START_NUMBER_OF_BUBBLES; i++) {
                node = newBubble(i);
                nodes.push(node);
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

        startGame();
    });

    return gameBController;
})();
