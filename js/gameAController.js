com_geekAndPoke_Ngm1.gameAController = (function() {
    var constants = com_geekAndPoke_Ngm1.const;
    var util = com_geekAndPoke_Ngm1.util;

    var gameAController = com_geekAndPoke_Ngm1.controllers.controller('GameAController', function ($scope, $route, $location) {
        var GROUP_INCREASE_INTERVAL = 10000;
        var MAX_NUMBER_OF_GROUPS = 5;
        var MAX_NUMBER = 100;
        var MAX_HEALTH = 5;
        var TIMER_TICK_DURATION = 1000;
        var NUMBER_OF_LIFES = 3;
        var COLOR_HIGHLIGHT_IN = 500;
        var COLOR_HIGHLIGHT_OUT = 500;

        var BUBBLE_FADE_OUT_TIME = 300;
        var THUMB_FADE_IN_TIME = 200;
        var THUMB_FADE_OUT_TIME = 500;
        var THUMB_OPACITY = 0.2;

        var isInNewBubblePhase = true;
        var isGameOver = false;
        var force, svg, g, circle, width, height, middleX, thumbsUp, thumbsDown;
        var progressBar, timer;
        var healthState = 0, lifeCtr;
        var currentNumber, currentGroup;
        var points, rounds;
        var lastGroupIncreaseTime;
        var currentNumberOfGroups = 1;

        var lastNumbers = {};

        function healthCounter() {
            var progress;
            progress = (100 / MAX_HEALTH) * healthState;
            progressBar.attr('aria-valuenow', progress).style({'width': progress + '%', 'height': height / 20 + 'px'});

            console.log('progress: ' + progress);

            if(healthState < MAX_HEALTH/2) {
                $scope.progressStyle = 'success';
            }
            else if (healthState < 2*MAX_HEALTH/3) {
                $scope.progressStyle = 'warning';
            }
            else {
                $scope.progressStyle = 'danger';
            }

            $scope.$apply();

            healthState++;
            if(healthState > MAX_HEALTH) {
                healthState = 0;
                roundEnd(true);
            }
        }

        function evaluate(x) {
            var lastNumber;
            lastNumber = lastNumbers[currentGroup];
            lastNumbers[currentGroup] = currentNumber;
            if(typeof(lastNumber) === 'undefined') {
                return true;
            }
            if(x < middleX) {
                return (currentNumber <= lastNumber);
            }
            else {
                return (currentNumber >= lastNumber);
            }
        }

        function showResult(isTimeOut, x) {
            var thumb, result;
            if(!isTimeOut && evaluate(x)) {
                thumb = thumbsUp;
                result = true;
            }
            else {
                thumb = thumbsDown;
                result = false;
            }

            thumb
                .attr('opacity', 0.0)
                .transition().duration(THUMB_FADE_IN_TIME).style({'opacity': THUMB_OPACITY})
                .transition().duration(THUMB_FADE_OUT_TIME).style({'opacity': 0.0});

            return result;
        }

        function maybeIncreaseNumberOfGroups() {
            if(currentNumberOfGroups >= MAX_NUMBER_OF_GROUPS) {
                return;
            }
            var currentMillis = (new Date()).valueOf();
            if(currentMillis - lastGroupIncreaseTime > GROUP_INCREASE_INTERVAL) {
                lastGroupIncreaseTime = currentMillis;
                currentNumberOfGroups++;
                $scope.level = currentNumberOfGroups - 1;
                $scope.$apply();
            }
        }

        function resetAnimations() {
            clearInterval(timer);
            force.nodes([]);
            force.links([]);
            force.stop();
        }

        function colorHighlight(node, fromColor, toColor) {
            node
                .style({'color': fromColor})
                .transition().duration(COLOR_HIGHLIGHT_IN).style({'color': toColor})
                .transition().duration(COLOR_HIGHLIGHT_OUT).style({'color': fromColor});
        }

        function roundEnd(isTimeOut, x) {
            var result;

            isInNewBubblePhase = true;

            resetAnimations();
            result = showResult(isTimeOut, x);

            circle
                .attr('opacity', 1)
                .transition().duration(BUBBLE_FADE_OUT_TIME).attr('opacity', 0);

            if(!result) {
                $scope.points = Math.max(0, $scope.points - currentNumber);
                lifeCtr--;
                $($('.life')[lifeCtr]).css('opacity', 0);

                if(lifeCtr <= 0) {
                    gameOver();
                    return;
                }

                colorHighlight(points, 'black', 'red');
            }
            else {
                $scope.points += currentNumber;
                $scope.rounds++;

                colorHighlight(points, 'black', 'green');
                colorHighlight(rounds, 'black', 'green');
            }

            $scope.$apply();

            maybeIncreaseNumberOfGroups();
            startBubble(BUBBLE_FADE_OUT_TIME);
        }

        function gameOver() {
            $scope.$root.points = $scope.points;
            $scope.$root.rounds = $scope.rounds;
            $location.path('/gameOver');
            $scope.$apply();
        }

        function tick() {
            g.attr("transform", function(d) {
                if(!isGameOver) {
                    if(isInNewBubblePhase && Math.abs(d.x - middleX) < width/8) {
                        isInNewBubblePhase = false;
                    }
                    if(!isInNewBubblePhase && Math.abs(d.x - middleX) > width/4) {
                        roundEnd(false, d.x);
                    }
                }
                return "translate(" + d.x + "," + d.y + ")";
            })
        }

        function endGameMenu() {
            g.remove();

            setTimeout(function() {
                var group = Math.random() * MAX_NUMBER_OF_GROUPS;
                var text = 'P: ' + $scope.points + ' - R: ' + $scope.rounds;

                var bubbles = {
                    nodes: [{name:'P:' + $scope.points, group:0, clazz:'menu-circle non-href', color:'green'},
                        {name:'R:' + $scope.rounds, group:4, clazz:'menu-circle non-href', color:'blue'},
                        {name: 'New Game', group:2, clazz:'menu-circle with-href', href:'newGame()', color:'red'},
                        {name: '', group:3, clazz:'menu-circle non-href', href:'', color:'orange'}],
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

                force = d3.layout.force()
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
                    .append('svg:a').attr('xlink:href', '#').attr('ng-click', function(d) {return d.href})
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
            }, 0);
        }

        function newGame() {
            $route.reload();
        }

        function startBubble(delay) {
            if(util.isDefined(g)) {
                g.remove();
            }

            setTimeout(function() {
                currentGroup = Math.floor(Math.random() * currentNumberOfGroups);
                currentNumber = Math.floor(Math.random() * (MAX_NUMBER + 1));

                var bubbles = {
                    nodes: [{name:currentNumber, group:currentGroup}],
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

                circle = g.append("circle").attr("r", radius);

                g.append("text")
                    .text(function(d) { return d.name; })
                    .style("font-size", radius + "px")
                    .attr("dx", "-.9em")
                    .attr("dy", ".35em");

                force.on("tick", tick);

                healthState = 0;
                timer = setInterval(healthCounter, TIMER_TICK_DURATION);
            }, delay);
        }

        $scope.newGame = newGame;
        $scope.result = 'none';

        height = $(window).height();
        width = $(window).width();
        middleX = width / 2;

        svg = d3.select("#field").append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.selectAll('.thumb').style({'font-size': height+'px'});
        thumbsDown = d3.select(".thumb.loose");
        thumbsUp = d3.select('.thumb.win');

        thumbsDown.style({'opacity': 0});
        thumbsUp.style({'opacity': 0});

        progressBar = d3.select('.progress-bar');

        lifeCtr = NUMBER_OF_LIFES;

        lastGroupIncreaseTime = (new Date()).valueOf();
        $scope.level = 0;

        $scope.points = 0;
        $scope.rounds = 0;

        points = d3.select('#points');
        rounds = d3.select('#rounds');

        d3.select('#countdown').style({'font-size': height/10 + 'px'});

        d3.selectAll('hide-at-gameover').style({'display': 'inline'});

        startBubble();
    });

    return gameAController;
})();
