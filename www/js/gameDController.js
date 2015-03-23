com_geekAndPoke_Ngm1.gameOverController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;
    var data = com_geekAndPoke_Ngm1.data;
    var fieldComponents = com_geekAndPoke_Ngm1.fieldComponents;

    var gameDController = com_geekAndPoke_Ngm1.rootController.controller('GameDController', function ($scope) {
        var bubbles, bubbles_g_enter, bubbles_g_circle_enter, bubbles_g_text_enter;
        var lines;
        var middleX, middleY;
        var oldAngle;
        var currentSector;

        var CLASS_GAUGE_TEXT = "gauge-text";
        var CLASS_ANGLE_TEXT = "angle-text";
        var CLASS_NO_TEXT = "no-text";
        var CLASS_SECTOR_TEXT = "sector-text";

        var pointDisplay = new fieldComponents.PointDisplay($scope);

        function gameOver() {
            $scope.$root.rootData.points = pointDisplay.getPoints();
            $location.path('/gameOver');
            $scope.$apply();
        }

        function fillAngleAndSector(d) {
            var x = d.x;
            var y = d.y;
            var diffX = Math.abs(x - middleX);
            var diffY = Math.abs(y - middleY);
            var tanAlpha = diffY / diffX;
            var alpha = Math.atan(tanAlpha);

            if(x < middleX && y < middleY) {
                alpha += Math.PI;
                d.sector = 0;
            }
            else if(x < middleX && y > middleY) {
                alpha = Math.PI - alpha;
                d.sector = 1;
            }
            else if(x > middleX && y < middleY) {
                alpha = 2*Math.PI - alpha;
                d.sector = 2;
            }
            else {
                d.sector = 3;
            }

            d.angle = Math.round(alpha * 1000) / 1000;;
        }

        function calculatePoint() {
            if(oldAngle > (Math.PI * 3/2) && angle < (Math.PI * 1/2)) {
                pointDisplay.increase();
            }
        }

        function tick() {
            bubbles.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
            bubbles.selectAll("." + CLASS_ANGLE_TEXT)
                .transition()
                .text(function(d) {
                    fillAngleAndSector(d);
                    return d.angle;
                });
            lines.attr("d", function(d) {
                    return "M" + middleX + "," + middleY + "L" + d.x + "," + d.y;
                });

            calculatePoint();
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
                {name:'', group:0, color:'blue', clazz: CLASS_GAUGE_TEXT},
                {name:'', group:4, color:'green', clazz: CLASS_ANGLE_TEXT},
                {name:'', group:2, color:'red', clazz: CLASS_SECTOR_TEXT},
                {name:'', group:3, color:'orange', clazz: CLASS_NO_TEXT},
                {name:'', group:5, color:'black', clazz: CLASS_NO_TEXT}
            ],
            links: util.createLinkArray(5)
        };

        var radius = Math.min(width, height) / 15;

        var force = d3.layout.force()
            .charge(-150)
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
