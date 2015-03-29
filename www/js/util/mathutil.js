com_geekAndPoke_Ngm1.mathutil = (function() {
    function expSmoothPoint(oldPoint, point, alpha) {
        if(!oldPoint.x) {
            oldPoint.x = point.x;
        }
        if(!oldPoint.y) {
            oldPoint.y = point.y;
        }
        else {
            oldPoint.x = alpha * point.x + (1 - alpha) * oldPoint.x;
            oldPoint.y = alpha * point.y + (1 - alpha) * oldPoint.y;
        }
    }

    return {
        expSmoothPoint: expSmoothPoint
    }
})();