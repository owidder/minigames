'use strict';

angular.module(__global.appName).controller("GameCController", function ($scope, $route, $location, constants, fieldComponents) {
    var MAX_NUMBER = 20;
    var UPPER_BOUND = 50;
    var LOWER_BOUND = 45;
    var currentSum = 0;

    var MAX_GROUP = 5;
    var START_BUBBLE_CREATION_INTERVAL = 2000;

    var cornerCounter = 0;
    var CORNER_TOP_LEFT = 0;
    var CORNER_TOP_RIGHT = 1;
    var CORNER_BOTTOM_RIGHT = 2;
    var CORNER_BOTTOM_LEFT = 3;

    var svg, width, height;
    var radius;
    var bubbles;
    var bubblesData;
    var force;

    var currentBubbleCreationInterval = START_BUBBLE_CREATION_INTERVAL;
    var BUBBLE_CREATION_INTERVAL_DECREASE = 100;
    var MIN_BUBBLE_CREATION_INTERVAL = 500;
    var createNewBubblesTimer;

    var pointDisplay = new fieldComponents.PointDisplay($scope);

    function gameOver() {
        clearTimeout(createNewBubblesTimer);
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

    function nextStartPosition() {
        var position = {

        };
        switch (cornerCounter) {
            case CORNER_TOP_LEFT:
                position.x = 0;
                position.y = 0;
                break;

            case CORNER_TOP_RIGHT:
                position.x = width;
                position.y = 0;
                break;

            case CORNER_BOTTOM_RIGHT:
                position.x = width;
                position.y = height;
                break;

            case CORNER_BOTTOM_LEFT:
                position.x = 0;
                position.y = height;
                break;
        }

        cornerCounter++;
        if(cornerCounter > 3) {
            cornerCounter = 0;
        }

        return position;
    }

    function decreaseBubbleCreationInterval() {
        if(currentBubbleCreationInterval >= MIN_BUBBLE_CREATION_INTERVAL + BUBBLE_CREATION_INTERVAL_DECREASE) {
            currentBubbleCreationInterval -= BUBBLE_CREATION_INTERVAL_DECREASE;
        }
    }

    function clickedOnNode(node) {
        if(currentSum <= LOWER_BOUND) {
            gameOver();
        }
        else {
            pointDisplay.increase();
            decreaseBubbleCreationInterval();
            bubblesData.nodes.length = 0;
            currentSum = 0;
            start();
        }
    }

    function start() {
        var g;

        bubbles = bubbles.data(force.nodes());

        g = bubbles.enter()
            .append("g")
            .attr("class", function(d) {return "bubble bubble-" + d.group})
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
        var number, diffToUpperBound;

        if(currentSum >= UPPER_BOUND) {
            gameOver();
        }

        diffToUpperBound = UPPER_BOUND - currentSum;

        if(diffToUpperBound > MAX_NUMBER || currentSum > LOWER_BOUND) {
            number = Math.max(Math.floor(Math.random() * MAX_NUMBER), 1);
        }
        else {
            number = Math.max(Math.floor(Math.random() * (UPPER_BOUND - currentSum)), 1);
        }
        currentSum += number;

        if(currentSum >= UPPER_BOUND) {
            gameOver();
            return -1;
        }

        return number;
    }

    function createNewBubbleNode() {
        var bubbleValue, group;
        var node;
        var position = nextStartPosition();

        bubbleValue = newNumber();
        if(bubbleValue >= 0) {
            group = Math.floor(Math.random() * MAX_GROUP);
            node = {
                name: bubbleValue,
                group: group,
                x: position.x,
                y: position.y
            };

            return node;
        }
        else {
            return null;
        }
    }

    function createNewBubble() {
        clearTimeout(createNewBubblesTimer);

        var node = createNewBubbleNode();

        if(node != null) {
            force.stop();
            bubblesData.nodes.push(node);
            start();
            force.start();

            createNewBubblesTimer = setTimeout(createNewBubble, currentBubbleCreationInterval);
        }
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
            .charge(-150)
            .gravity(.15)
            .linkDistance(3*radius)
            .size([width, height]);

        force
            .nodes(bubblesData.nodes)
            .links(bubblesData.links)
            .start();

        bubbles = svg.selectAll(".bubble");

        createNewBubble();
    }

    $scope.$root.rootData.currentGameId = constants._GAME_C_ID;

    height = $(window).height();
    width = $(window).width();
    radius = Math.min(width, height) / 5;


    svg = d3.select("#field").append("svg")
        .attr("width", width)
        .attr("height", height);

    startGame();
});
