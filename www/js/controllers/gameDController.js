com_geekAndPoke_Ngm1.gameOverController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;
    var mathutil = com_geekAndPoke_Ngm1.mathutil;
    var funcs = com_geekAndPoke_Ngm1.funcs;
    var data = com_geekAndPoke_Ngm1.data;
    var fieldComponents = com_geekAndPoke_Ngm1.fieldComponents;

    var gameDController = com_geekAndPoke_Ngm1.rootController.controller('GameDController', function ($scope) {
        var bubbles, bubbles_g_enter, bubbles_g_circle_enter, bubbles_g_text_enter;
        var lines;
        var middleX, middleY;

        var CLASS_GAUGE_TEXT = "gauge-text";
        var CLASS_ANGLE_TEXT = "angle-text";
        var CLASS_NO_TEXT = "no-text";
        var CLASS_SECTOR_TEXT = "sector-text";
        var CLASS_RANDOM_NUMBER_TEXT = "random-number-text";
        var CLASS_IS_MOVING_TEXT = "is-moving-text";

        var pointDisplay = new fieldComponents.PointDisplay($scope);

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

            if(x < middleX && y < middleY) {
                alpha += Math.PI;
            }
            else if(x < middleX && y > middleY) {
                alpha = Math.PI - alpha;
            }
            else if(x > middleX && y < middleY) {
                alpha = 2*Math.PI - alpha;
            }

            node.angle = Math.round(alpha * 1000) / 1000;
        }

        function calculatePoint() {
            if(oldAngle > (Math.PI * 3/2) && angle < (Math.PI * 1/2)) {
                pointDisplay.increase();
            }
        }

        function isNearTo(point1, point2) {
            var isNearTo = false;
            var xDiff = Math.round(point1.x) - Math.round(point2.x);
            var yDiff = Math.round(point1.y) - Math.round(point2.y);
            if(Math.abs(xDiff) < 3 && Math.abs(yDiff) < 3) {
                isNearTo = true;
            }

            return isNearTo;
        }

        function getIndicesOfMaxAndMinAngle(nodes) {
            var maxAngle = -1;
            var minAngle = 10;
            var maxAngleIndex;
            var minAngleIndex;

            funcs.forEachWithIndex(nodes, function(node, index) {
                fillAngle(node);
                if(node.angle > maxAngle) {
                    maxAngle = node.angle;
                    maxAngleIndex = index;
                } else if(node.angle < minAngle) {
                    minAngle = node.angle;
                    minAngleIndex = index;
                }
            });

            return {
                maxAngle: maxAngle,
                minAngle: minAngle,
                maxAngleIndex: maxAngleIndex,
                minAngleIndex: minAngleIndex
            };
        }

        function checkOrder(nodes) {
            var lastAngle = -1;
            var lastAngleIndex = -1;
            var lastRnd = -1;
            var ctr = 0;
            var i = 0;

            $scope.bubbles = '';
            nodes.sort(function(a,b) {
                return a.rnd - b.rnd;
            });
            var maxAndMinAngle = getIndicesOfMaxAndMinAngle(nodes);

            funcs.forEachWithIndex(nodes, function(node, index) {
                fillAngle(node);
                if(node.angle < lastAngle) {
                    if(!(index == maxAndMinAngle.minAngleIndex && lastAngleIndex == maxAndMinAngle.maxAngleIndex)) {
                        ctr++;
                    }
                }
                lastAngle = node.angle;
                lastAngleIndex = index;

                $scope['bubbles' + ++i] = node.rnd + ' : ' + node.angle;
            });

            $scope.angleCtr = ctr;
            $scope.$apply();
        }

        function computeMovingCtr(nodes) {
            var isMovingCtr = 0;
            nodes.forEach(function(node) {
                var isMoving;
                if(!util.isSet(node.oldPoint)) {
                    node.oldPoint = {
                        x: node.x,
                        y: node.y
                    }
                }
                else {
                    if(!isNearTo(node, node.oldPoint)) {
                        isMovingCtr++;
                    }
                }
                node.oldPoint.x = node.x;
                node.oldPoint.y = node.y;
            });
            $scope.moveDisplay = isMovingCtr;
            $scope.$apply();
        }

        function tick() {
            bubbles.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
            bubbles.selectAll("." + CLASS_RANDOM_NUMBER_TEXT)
                .transition()
                .text(function(d) {
                    return d.rnd;
                });
            lines.attr("d", function(d) {
                    return "M" + middleX + "," + middleY + "L" + d.x + "," + d.y;
                });

            //calculatePoint();
        }

        function insertRandomNumbersIntoNodes(nodes) {
            nodes.forEach(function(node) {
                node.rnd = util.randomNumberBetweenLowerAndUpper(1, 100);
            });
        }

        var height = $(window).height();
        var width = $(window).width();
        var middleX = width / 2;
        var middleY = height / 2;

        var svg = d3.select("#field").append("svg")
            .attr("width", width)
            .attr("height", height);

        var points = $scope.$root.rootData.points;
        var currentGameId = $scope.$root.rootData.currentGameId;
        if(util.isSet(currentGameId) && currentGameId.length > 0 && util.isSet(points)) {
            data.setHighScore(currentGameId, points, $scope.$root.rootData);
        }

        if(!util.isDefined(points)) points = '0';

        var bubbleData = {
            nodes: [
                {name:'', group:0, color:'blue', clazz: CLASS_RANDOM_NUMBER_TEXT},
                {name:'', group:4, color:'green', clazz: CLASS_RANDOM_NUMBER_TEXT},
                {name:'', group:2, color:'red', clazz: CLASS_RANDOM_NUMBER_TEXT},
                {name:'', group:3, color:'orange', clazz: CLASS_RANDOM_NUMBER_TEXT},
                {name:'', group:5, color:'black', clazz: CLASS_RANDOM_NUMBER_TEXT}
            ],
            links: util.createLinkArray(5)
        };
        insertRandomNumbersIntoNodes(bubbleData.nodes);

        var maxAndMinAngle = getIndicesOfMaxAndMinAngle(bubbleData.nodes);

        setInterval(function() {
            computeMovingCtr(bubbleData.nodes);
            checkOrder(bubbleData.nodes, maxAndMinAngle);
        }, 50);

        var radius = Math.min(width, height) / 15;

        var force = d3.layout.force()
            .charge(-1500)
            .linkDistance(3*radius)
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
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(force.drag);

        bubbles_g_circle_enter = bubbles_g_enter
            .append("circle").attr("r", radius)
            .attr('fill', function(d) {return d.color});

        bubbles_g_text_enter = bubbles_g_enter
            .append("text")
            .attr("class", function(d) {
                return d.clazz;
            })
            .text('')
            .style("font-size", function(d) { return Math.min(0.2*radius, (0.2*radius - 8) / this.getComputedTextLength() * 38) + "px"; })
            .style("fill", "white")
            .attr("dx", "-.9em")
            .attr("dy", ".35em");

        bubbles.exit().remove();

        lines = svg.append("g")
            .selectAll(".line")
            .data(bubbleData.nodes);

        lines
            .enter()
            .append("path")
            .attr("class", "line");

        force.on("tick", tick);
    });

    return gameDController;
})();
