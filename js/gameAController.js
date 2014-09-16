com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;

    var isInNewBubblePhase = true;

    var gameAController = com_geekAndPoke_Ngm1.controllers.controller('GameAController', ['$scope', function ($scope) {
            var currentVal = 0;

            function createNextBubble() {
                currentVal++;
                $scope.bubbles = {
                    nodes: [{name:currentVal, group:0}],
                    links: []
                };
            }

            $scope.$on('new-bubble', function(evt) {
                createNextBubble();
            });

            createNextBubble();
        }]
    );

    gameAController.directive('gameA', function() {
        var link = function(scope, element, attr) {
            var GET_XY_RE = /translate\((.*)\,(.*)\)/;

            scope.$watch('bubbles', function(bubbles) {
                if(typeof(bubbles) === 'undefined') {
                    return;
                }

                var height = $(window).height(),
                    width = $(window).width();

                var middleX = width / 2;

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
                    .attr("class", function (d) {
                        return "bubble bubble-" + d.group
                    })
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .call(force.drag);

                var radius = Math.min(width, height) / 3;

                var bubbles = g
                    .append("circle")
                    .attr("r", radius);

                var bubblesText = g.append("text")
                    .text(function(d) { return d.name; })
                    .style("font-size", radius + "px")
                    .attr("dx", "-.9em")
                    .attr("dy", ".35em");

                force.on("tick", function() {
                    g.attr("transform", function(d) {
                        if(isInNewBubblePhase && Math.abs(d.x - middleX) < 10) {
                            isInNewBubblePhase = false;
                        }
                        if(!isInNewBubblePhase && Math.abs(d.x - middleX) > width/4) {
                            isInNewBubblePhase = true;
                            force.nodes([]);
                            force.links([]);
                            force.stop;
                            svg.remove();
                            scope.$parent.$broadcast('new-bubble');
                        }
                        return "translate(" + d.x + "," + d.y + ")";
                    })
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
