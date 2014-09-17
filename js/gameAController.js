com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;

    var isInNewBubblePhase = true;
    var force, svg, g, width, height, middleX;

    var gameAController = com_geekAndPoke_Ngm1.controllers.controller('GameAController', ['$scope', function ($scope) {
            var currentVal = 0;

            function newBubble() {
                force.nodes([]);
                force.links([]);
                force.stop();
                svg.remove();
                setTimeout(function() {
                    startBubble();
                }, 10);
            }

            function tick() {
                g.attr("transform", function(d) {
                    if(isInNewBubblePhase && Math.abs(d.x - middleX) < 10) {
                        isInNewBubblePhase = false;
                    }
                    if(!isInNewBubblePhase && Math.abs(d.x - middleX) > width/4) {
                        isInNewBubblePhase = true;
                        setTimeout(function() {
                            newBubble();
                        }, 10);
                    }
                    return "translate(" + d.x + "," + d.y + ")";
                })
            }

            function startBubble() {
                svg = d3.select("body").append("svg")
                    .attr("width", width)
                    .attr("height", height);

                currentVal++;
                var bubbles = {
                    nodes: [{name:currentVal, group:0}],
                    links: []
                };

                force = d3.layout.force()
                    .charge(-150)
                    .linkDistance(10)
                    .size([width, height]);

                force
                    .nodes(bubbles.nodes)
                    .links(bubbles.links)
                    .start();

                g = svg.selectAll(".bubble")
                    .data(bubbles.nodes)
                    .enter().append("g")
                    .attr("class", function (d) {
                        return "bubble bubble-" + d.group
                    })
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .call(force.drag);

                var radius = Math.min(width, height) / 3;

                g.append("circle").attr("r", radius);

                g.append("text")
                    .text(function(d) { return d.name; })
                    .style("font-size", radius + "px")
                    .attr("dx", "-.9em")
                    .attr("dy", ".35em");

                force.on("tick", tick);
            }

            height = $(window).height();
            width = $(window).width();
            middleX = width / 2;

            startBubble();
        }]
    );

    return gameAController;
})();
