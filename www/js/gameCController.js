com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;
    var fieldComponents = com_geekAndPoke_Ngm1.fieldComponents;

    var gameCController = com_geekAndPoke_Ngm1.rootController.controller('GameCController', function ($scope, $route, $location) {
        var MAX_NUMBER = 20;
        var GROUP_SIZE = 5;
        var MAX_NUMBER_OF_BUBBLES = 30;
        var START_MIN_BUBBLE_CREATION_INTERVAL = 2000;
        var END_MIN_BUBBLE_CREATION_INTERVAL = 1000;
        var START_MAX_BUBBLE_CREATION_INTERVAL = 4000;
        var END_MAX_BUBBLE_CREATION_INTERVAL = 2000;
        var CREATION_INTERVAL_DECREASE = 500;
        var MIN_NUMBER_OF_EXTRA_BUBBLES = 5;
        var MAX_NUMBER_OF_EXTRA_BUBBLES = 7;
        var BUBBLE_THRESHOLD = 20;
        var TIME_BETWEEN_WARN_AND_CREATE_NEW_BUBBLES = 1000;

        var BUBBLE_FADE_OUT_TIME = 1000;

        var svg, width, height;
        var radius;
        var bubbles;
        var bubblesData;
        var force;
        var numbers = [];
        var totalBubbleCounter = 0;
        var warnAboutNewBubblesTimer;
        var createNewBubblesTimer;
        var currentMinBubbleCreationInterval = START_MIN_BUBBLE_CREATION_INTERVAL;
        var currentMaxBubbleCreationInterval = START_MAX_BUBBLE_CREATION_INTERVAL;

        var START_MIN_NUMBER_OF_BUBBLES = 5;
        var END_MIN_NUMBER_OF_BUBBLES = 15;
        var currentMinNumberOfBubble = START_MIN_NUMBER_OF_BUBBLES;

        var pointDisplay = new fieldComponents.PointDisplay($scope);
        var newBubblesWarningDisplay = new fieldComponents.GeneralDisplay($scope, ".new-bubbles-warning");
        newBubblesWarningDisplay.displayFadeInTime = TIME_BETWEEN_WARN_AND_CREATE_NEW_BUBBLES;

        function gameOver() {
            clearTimeout(createNewBubblesTimer);
            clearTimeout(warnAboutNewBubblesTimer);
            $scope.$root.rootData.points = pointDisplay.getPoints();
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
            bubbles.attr("transform", function(d) {
                return "translate(" + cx(d.x) + "," + cy(d.y) + ")";
            });
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

        function showWarnSign() {
            clearInterval(createNewBubblesTimer);
            newBubblesWarningDisplay.show();
            warnAboutNewBubblesTimer = setTimeout(createNewBubbles, TIME_BETWEEN_WARN_AND_CREATE_NEW_BUBBLES);
        }

        function startCreateNewBubbleTimer() {
            var interval = util.randomNumberBetweenLowerAndUpper(currentMinBubbleCreationInterval, currentMaxBubbleCreationInterval);
            createNewBubblesTimer = setInterval(showWarnSign, interval);

            if(currentMinBubbleCreationInterval > END_MIN_BUBBLE_CREATION_INTERVAL) {
                currentMinBubbleCreationInterval -= CREATION_INTERVAL_DECREASE;
            }

            if(currentMaxBubbleCreationInterval > END_MAX_BUBBLE_CREATION_INTERVAL) {
                currentMaxBubbleCreationInterval -= CREATION_INTERVAL_DECREASE;
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
            numbers.sort(function sortNumber(a, b) {return a - b;});

            return number;
        }

        function isBiggestNumber(number) {
            return (number == numbers[numbers.length-1]);
        }

        function removeBiggestNumber() {
            numbers.splice(numbers.length-1, 1);
        }

        function createNewBubbleNode() {
            var bubbleValue, group;
            var node;

            totalBubbleCounter++;
            bubbleValue = newNumber();
            group = Math.floor(numbers.length / GROUP_SIZE);
            node = {
                name: bubbleValue,
                group: group,
                x: Math.floor(Math.random() * width),
                y: Math.floor(Math.random() * height),
                id: totalBubbleCounter
            };

            return node;
        }

        function createNewBubbles() {
            var nodes = [], i;
            var numberOfExtraBubbles = 0;

            clearInterval(warnAboutNewBubblesTimer);

            nodes.push(createNewBubbleNode());

            if(numbers.length > MAX_NUMBER_OF_BUBBLES) {
                gameOver();
            }

            if(numbers.length < currentMinNumberOfBubble) {
                numberOfExtraBubbles = currentMinNumberOfBubble - numbers.length;
            }
            else if(numbers.length < BUBBLE_THRESHOLD) {
                numberOfExtraBubbles = util.randomNumberBetweenLowerAndUpper(MIN_NUMBER_OF_EXTRA_BUBBLES, MAX_NUMBER_OF_EXTRA_BUBBLES);
            }

            for(i = 0; i < numberOfExtraBubbles; i++) {
                nodes.push(createNewBubbleNode());
            }

            force.stop();
            util.pushAll(bubblesData.nodes, nodes);
            start();
            force.start();

            currentMinNumberOfBubble++;
        }

        function startGame() {
            var nodes = [], links = [];
            var i, j;
            var node;

            bubblesData = {
                nodes: nodes,
                links: links
            };

            force = d3.layout.force()
                .charge(-200)
                .gravity(1)
                .linkDistance(3*radius)
                .size([width, height]);

            force
                .nodes(bubblesData.nodes)
                .links(bubblesData.links)
                .start();

            bubbles = svg.selectAll(".bubble");

            createNewBubbles();
        }

        $scope.$root.rootData.currentGameId = constants._GAME_B_ID;

        height = $(window).height();
        width = $(window).width();
        radius = Math.min(width, height) / 10;


        svg = d3.select("#field").append("svg")
            .attr("width", width)
            .attr("height", height);

        startGame();
    });

    return gameCController;
})();
