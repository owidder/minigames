'use strict';

module.exports = function(ns) {
    ns.gameOverCtrl = ns.services.controller('GameOverCtrl', function ($scope, AppContext) {
        ns.util.clearTimer(AppContext);

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

        var points = AppContext.points;
        var rounds = AppContext.rounds;

        if(!ns.util.isDefined(points)) points = '-';
        if(!ns.util.isDefined(rounds)) rounds = '-';

        var bubbles = {
            nodes: [{name:'P:' + points, group:0, clazz:INSERT_TEXT_HERE_CLASS + ' ' + NON_HREF_CLASS, color:'green'},
                {name:'R:' + rounds, group:4, clazz:INSERT_TEXT_HERE_CLASS + ' ' + NON_HREF_CLASS, color:'blue'},
                {name: 'New Game', group:2, clazz:WITH_HREF_CLASS, href:'#/g1', color:'red'},
                {name: 'Menu', group:3, clazz:WITH_HREF_CLASS, href:'#/menu', color:'orange'}],
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
            .style({'font-size': function (d) {
                return Math.min(0.5 * radius, (0.5 * radius - 8) / this.getComputedTextLength() * 45) + "px";
            },
                'font-family': 'Courier'
            })
            .attr('fill', 'white')
            .attr("dx", "-1.8em")
            .attr("dy", ".35em");

        d3.select('.new-game');

        force.on("tick", tick);
    });
};
