com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;

    var gameAController = com_geekAndPoke_Ngm1.controllers.controller('GameAController', ['$scope', function ($scope) {
            var bubbles = {
                nodes: [
                    {name:"10", group:0},
                    {name:"20", group:1}
                ],
                links: [
                    {source:0, target:1, value:1}
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

                var height = 1000,
                    width = 500;

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
                    d3.selectAll("svg .node").remove();
                    d3.selectAll("svg .link").remove();
                }

                force
                    .nodes(bubbles.nodes)
                    .links(bubbles.links)
                    .start();

                var link = svg.selectAll(".link")
                    .data(bubbles.links)
                    .enter().append("line")
                    .attr("class", "link")
                    .style("stroke-width", function(d) { return Math.sqrt(d.value); });

                var node = svg.selectAll(".node")
                    .data(bubbles.nodes)
                    .enter().append("circle")
                    .attr("r", 50)
                    .style("fill", function(d) { return color(d.group); })
                    .call(force.drag);

                node.append("title")
                    .text(function(d) { return d.name; });

                force.on("tick", function() {
                    link.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

                    node.attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });
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
