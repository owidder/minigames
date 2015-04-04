        function isNearTo(point1, point2) {
            var isNearTo = false;
            var xDiff = Math.round(point1.x) - Math.round(point2.x);
            var yDiff = Math.round(point1.y) - Math.round(point2.y);
            if (Math.abs(xDiff) < 3 && Math.abs(yDiff) < 3) {
                isNearTo = true;
            }

            return isNearTo;
        }


        function computeMovingCtr(nodes) {
            var isMovingCtr = 0;
            nodes.forEach(function (node) {
                var isMoving;
                if (!util.isSet(node.oldPoint)) {
                    node.oldPoint = {
                        x: node.x,
                        y: node.y
                    }
                }
                else {
                    if (!isNearTo(node, node.oldPoint)) {
                        isMovingCtr++;
                    }
                }
                node.oldPoint.x = node.x;
                node.oldPoint.y = node.y;
            });
            $scope.moveDisplay = isMovingCtr;
            $scope.$apply();
        }

