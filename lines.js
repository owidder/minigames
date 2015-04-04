        function tick() {
            lines.attr("d", function(d) {
                    return "M" + middleX + "," + middleY + "L" + d.x + "," + d.y;
                });
        }

...

            lines = svg.append("g")
                .selectAll(".line")
                .data(bubbleData.nodes);

            lines
                .enter()
                .append("path")
                .attr("class", "line");

