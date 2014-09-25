com_geekAndPoke_Ngm1.gameOverController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;

    var gameOverController = com_geekAndPoke_Ngm1.controllers.controller('GameOverController', function ($scope) {
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

        var text = 'P: ' + $scope.$root.points + ' - R: ' + $scope.$root.rounds;

        var bubbles = {
            nodes: [{name:'P:' + $scope.points, group:0, clazz:'menu-circle non-href', color:'green'},
                {name:'R:' + $scope.rounds, group:4, clazz:'menu-circle non-href', color:'blue'},
                {name: 'New Game', group:2, clazz:'menu-circle with-href', href:'#/g1', color:'red'},
                {name: '', group:3, clazz:'menu-circle non-href', href:'#', color:'orange'}],
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

        d3.selectAll('.with-href')
            .append('svg:a').attr('xlink:href', function(d) {return d.href})
            .append("circle").attr("r", radius)
            .attr('ng-click', function(d) {return d.href})
            .attr('fill', function(d) {return d.color})
        ;

        d3.selectAll('.non-href')
            .append("circle").attr("r", radius)
            .attr('fill', function(d) {return d.color})
        ;

        d3.selectAll('.menu-circle')
            .append("text")
            .text(function(d) { return d.name; })
            .style("font-size", function(d) { return Math.min(0.5*radius, (0.5*radius - 8) / this.getComputedTextLength() * 38) + "px"; })
            .attr("dx", "-.9em")
            .attr("dy", ".35em");

        d3.select('.new-game');

        force.on("tick", tick);
    });

    return gameAController;
})();
