com_geekAndPoke_Ngm1.gameOverController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;
    var data = com_geekAndPoke_Ngm1.data;

    var gameDController = com_geekAndPoke_Ngm1.rootController.controller('GameDController', function ($scope) {
        var bubbles, bubbles_g_enter, bubbles_g_circle_enter, bubbles_g_text_enter;
        var lines;
        var middleX, middleY;

        function angle(x, y) {
            var diffX = Math.abs(x - middleX);
            var diffY = Math.abs(y - middleY);
            var tanAlpha = diffY / diffX;
            var alpha = Math.atan(tanAlpha);

            if(x < middleX && y < middleY) {
                alpha += (Math.PI * 3 / 2);
            }

            return Math.round(alpha * 1000) / 1000;
        }

        function tick() {
            bubbles.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
            bubbles.selectAll("text")
                .transition()
                .text(function(d) {
                    return angle(d.x, d.y);
                });
            lines.attr("d", function(d) {
                    return "M" + middleX + "," + middleY + "L" + d.x + "," + d.y;
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
                {name:'', group:0, color:'blue'},
                {name:'', group:4, color:'green'},
                {name:'', group:2, color:'red'},
                {name:'', group:3, color:'orange'},
                {name:'', group:5, color:'black'}
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
