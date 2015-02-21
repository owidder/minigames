com_geekAndPoke_Ngm1.gameOverController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;
    var data = com_geekAndPoke_Ngm1.data;

    var gameOverController = com_geekAndPoke_Ngm1.rootController.controller('GameOverController', function ($scope) {
        var INSERT_TEXT_HERE_CLASS = 'insert-text-here';
        var NON_HREF_CLASS = 'non-href';
        var WITH_HREF_CLASS = 'with-href';

        var g;

        function tick() {
            g.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
        }

        var height = $(window).height();
        var width = $(window).width();

        var svg = d3.select("#field").append("svg")
            .attr("width", width)
            .attr("height", height);

        var points = $scope.$root.rootData.points;
        var currentGameId = $scope.$root.rootData.currentGameId;
        if(util.isSet(currentGameId) && currentGameId.length > 0 && util.isSet(points)) {
            data.setHighScore(currentGameId, points, $scope.$root.rootData);
        }

        if(!util.isDefined(points)) points = '0';

        var bubbles = {
            nodes: [{name:'', group:0, clazz:NON_HREF_CLASS, color:'blue'},
                {name:points, group:4, clazz:INSERT_TEXT_HERE_CLASS + ' ' + NON_HREF_CLASS, color:'green'},
                {name: 'Swypi', group:2, clazz:WITH_HREF_CLASS, href:'#/gAStart', color:'red'},
                {name: 'Touchi', group:3, clazz:WITH_HREF_CLASS, href:'#/gBStart', color:'orange'}],
            links: [
                {source:3, target:1, value:1},
                {source:3, target:2, value:1},
                {source:3, target:0, value:1},
                {source:0, target:1, value:1},
                {source:0, target:2, value:1},
                {source:1, target:2, value:1}
            ]
        };

        var radius = Math.min(width, height) / 5;

        var force = d3.layout.force()
            .charge(-150)
            .linkDistance(3*radius)
            .size([width, height]);

        force
            .nodes(bubbles.nodes)
            .links(bubbles.links)
            .start();

        g = svg.selectAll(".bubble")
            .data(bubbles.nodes)
            .enter().append("g")
            .attr("class", function (d) {
                return d.clazz
            })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(force.drag);

        d3.selectAll('.' + WITH_HREF_CLASS)
            .append('svg:a').attr('xlink:href', function(d) {return d.href}).attr('class', INSERT_TEXT_HERE_CLASS)
            .append("circle").attr("r", radius)
            .attr('ng-click', function(d) {return d.href})
            .attr('fill', function(d) {return d.color})
        ;

        d3.selectAll('.' + NON_HREF_CLASS)
            .append("circle").attr("r", radius).attr('class', INSERT_TEXT_HERE_CLASS)
            .attr('fill', function(d) {return d.color})
        ;

        d3.selectAll('.' + INSERT_TEXT_HERE_CLASS)
            .append("text")
            .text(function(d) { return d.name; })
            .style("font-size", function(d) { return Math.min(0.5*radius, (0.5*radius - 8) / this.getComputedTextLength() * 38) + "px"; })
            .style("fill", "white")
            .attr("dx", "-.9em")
            .attr("dy", ".35em");

        d3.select('.new-game');

        force.on("tick", tick);
    });

    return gameOverController;
})();
