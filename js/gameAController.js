com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;

    var gameAController = com_geekAndPoke_Ngm1.controllers.controller('GameAController', ['$scope', function ($scope) {
            var bubbles = {
                nodes: [
                    {name:"10", group:0}
                ],
                links: [
                ]
            };

            $scope.bubbles = bubbles;
        }]
    );

    gameAController.directive('gameA', function() {
        var link = function(scope, element, attr) {
            scope.$watch('bubbles', function(bubbles) {
                if(typeof(bubbles) === 'undefined') {
                    return;
                }

                var height = $(window).height(),
                    width = $(window).width();

                var color = d3.scale.category20();

                var force = d3.layout.force()
                    .charge(-150)
                    .linkDistance(10)
                    .size([width, height]);

                var svg = d3.select("svg");

                if(svg.empty()) {
                    svg = d3.select("body").append("svg")
                        .attr("width", width)
                        .attr("height", height);
                }
                else {
                    d3.selectAll("svg .bubble").remove();
                }

                force
                    .nodes(bubbles.nodes)
                    .links(bubbles.links)
                    .start();

                var g = svg.selectAll(".bubble")
                    .data(bubbles.nodes)
                    .enter().append("g")
                    .attr("class", "bubble")
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .call(force.drag);

                var bubbles = g
                    .append("circle")
                    .attr("r", Math.min(width, height) / 3)
                    .style("fill", function(d) { return color(d.group); });

                var bubblesText = g.append("text")
                    .text(function(d) { return d.name; })
                    .style("font-size", function(d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
                    .attr("dy", ".35em");

                force.on("tick", function() {
                    g.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                });
            });
        };

        var ret = {
            link: link,
            restrict: 'E'
        };
        return ret;
    });

    return gameAController;
})();
