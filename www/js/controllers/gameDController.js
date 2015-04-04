com_geekAndPoke_Ngm1.gameDController = (function () {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;
    var mathutil = com_geekAndPoke_Ngm1.mathutil;
    var funcs = com_geekAndPoke_Ngm1.funcs;
    var data = com_geekAndPoke_Ngm1.data;
    var fieldComponents = com_geekAndPoke_Ngm1.fieldComponents;

    var gameDController = com_geekAndPoke_Ngm1.rootController.controller('GameDController', function ($scope, $location) {
        var bubbles, bubbles_g_enter, bubbles_g_circle_enter, bubbles_g_text_enter;
        var middleX, middleY;

        var CLASS_RANDOM_NUMBER = "random-number-bubble";
        var CLASS_BUZZER = "buzzer-bubble";

        var pointDisplay = new fieldComponents.PointDisplay($scope);
        var healthCounter = new fieldComponents.HealthCounter($scope, gameOver, 10);

        var height = $(window).height();
        var width = $(window).width();
        var middleX = width / 2;
        var middleY = height / 2;

        var radius = Math.min(width, height) / 6;
        var bubbleData;

        start();

        function gameOver() {
            $scope.$root.rootData.points = pointDisplay.getPoints();
            $location.path('/gameOver');
            $scope.$apply();
        }

        function fillAngle(node) {
            var x = node.x;
            var y = node.y;
            var diffX = Math.abs(x - middleX);
            var diffY = Math.abs(y - middleY);
            var tanAlpha = diffY / diffX;
            var alpha = Math.atan(tanAlpha);

            if (x < middleX && y < middleY) {
                alpha += Math.PI;
            }
            else if (x < middleX && y > middleY) {
                alpha = Math.PI - alpha;
            }
            else if (x > middleX && y < middleY) {
                alpha = 2 * Math.PI - alpha;
            }

            node.angle = Math.round(alpha * 1000) / 1000;
        }

        function checkAscending(nodes) {
            var isInOrder = true;
            var maxRnd = -1;

            funcs.forEachWithIndex(nodes, function (node, index) {
                if (node.rnd > maxRnd) {
                    maxRnd = node.rnd;
                }
            });

            funcs.forEachOrderedTuple(nodes, function (node1, node2, index) {
                if (node2.rnd < node1.rnd) {
                    if (node1.rnd != maxRnd) {
                        isInOrder = false;
                    }
                }
                return isInOrder;
            }, true);

            return isInOrder;
        }

        function checkDescending(nodes) {
            var isInOrder = true;
            var minRnd = Number.MAX_VALUE;

            funcs.forEachWithIndex(nodes, function (node, index) {
                if (node.rnd < minRnd) {
                    minRnd = node.rnd;
                }
            });

            funcs.forEachOrderedTuple(nodes, function (node1, node2, index) {
                if (node2.rnd > node1.rnd) {
                    if (node1.rnd != minRnd) {
                        isInOrder = false;
                    }
                }
                return isInOrder;
            }, true);

            return isInOrder;
        }

        function checkOrder(nodes) {
            var isInOrder;

            nodes.forEach(function (node) {
                fillAngle(node);
            });
            nodes.sort(function (a, b) {
                return a.angle - b.angle;
            });

            isInOrder = checkAscending(nodes);
            if (!isInOrder) {
                isInOrder = checkDescending(nodes);
            }

            $scope.isInOrder = (isInOrder ? "yep" : "nope");
            $scope.$apply();

            return isInOrder;
        }

        function tick() {
            bubbles.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        }

        function insertRandomNumbersIntoNodes(nodes) {
            var nodesWithNumberArray = [];
            nodes.forEach(function (node) {
                if (node.textclass == CLASS_RANDOM_NUMBER) {
                    node.rnd = util.randomNumberBetweenLowerAndUpper(1, 100);
                    nodesWithNumberArray.push(node);
                }
            });

            return nodesWithNumberArray;
        }

        function clickedOnBuzzer() {
            healthCounter.reset();
            if (checkOrder(bubbleData.nodes)) {
                pointDisplay.increase();
                start();
            }
            else {
                gameOver();
            }
        }

        function start() {
            util.clearSvg();

            var svg = d3.select("#field").append("svg")
                .attr("width", width)
                .attr("height", height);


            bubbleData = {
                nodes: [
                    {name: '', group: 0, color: 'blue', textclass: CLASS_RANDOM_NUMBER},
                    {name: '', group: 4, color: 'green', textclass: CLASS_RANDOM_NUMBER},
                    {name: '', group: 2, color: 'red', textclass: CLASS_RANDOM_NUMBER},
                    {name: '', group: 3, color: 'orange', textclass: CLASS_RANDOM_NUMBER},
                    {name: '', group: 5, color: 'black', textclass: CLASS_RANDOM_NUMBER},
                    {name: '', group: 6, color: 'gray', circleclass: CLASS_BUZZER}
                ],
                links: util.createLinkArray(6)
            };
            var nodesWithNumberArray = insertRandomNumbersIntoNodes(bubbleData.nodes);

            var force = d3.layout.force()
                .charge(-1500)
                .linkDistance(3 * radius)
                .size([width, height]);

            force
                .nodes(bubbleData.nodes)
                .links(bubbleData.links)
                .start();

            bubbles = svg.selectAll(".bubble")
                .data(bubbleData.nodes);

            bubbles_g_enter = bubbles
                .enter().append("g")
                .attr("class", "bubble")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .call(force.drag);

            bubbles_g_circle_enter = bubbles_g_enter
                .append("circle")
                .attr("r", radius)
                .attr("class", function (d) {
                    return d.circleclass;
                })
                .attr('fill', function (d) {
                    return d.color
                });

            bubbles_g_text_enter = bubbles_g_enter
                .append("text")
                .attr("class", function (d) {
                    return d.textclass;
                })
                .text('')
                .style("font-size", function (d) {
                    return Math.min(radius, (radius - 8) / this.getComputedTextLength() * 38) + "px";
                })
                .style("fill", "white")
                .attr("dx", "-.9em")
                .attr("dy", ".35em");

            bubbles.selectAll("." + CLASS_RANDOM_NUMBER)
                .text(function (d) {
                    return d.rnd;
                });

            bubbles.selectAll('.' + CLASS_BUZZER)
                .on('click', function () {
                    clickedOnBuzzer();
                });

            bubbles.exit().remove();

            force.on("tick", tick);

            healthCounter.start();
        }

        setInterval(function () {
            checkOrder(bubbleData.nodes);
        }, 100);

    });

    return gameDController;
})();
