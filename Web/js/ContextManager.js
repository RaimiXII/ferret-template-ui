// context manager for papaya

var ContextManager = function(){


    var loggedPoints = [];
    /**
     * Menu data (can contain submenus).
     * @type {{label: string, items: *[]}}
     */
     
    var menudata = {"label": "Test",
        "items": [
            {"label": "Log Point", "action": "Context-Log"},
            {"label": "Clear Points", "action": "Context-Clear"}
        ]
    };

    /**
     * Returns menu options at image position.
     * @param x
     * @param y
     * @param z
     * @returns {{label: string, items: *[]}|*}
     */
    var getContextAtImagePosition = function(x, y, z) {
        return menudata;
    };

    /**
     * Callback when menu option is selected.
     * @param action
     */
    var actionPerformed = function(action) {
        if (action === "Log") {
            var currentCoor = papayaContainers[0].viewer.cursorPosition;
            var coor = new papaya.core.Coordinate(currentCoor.x, currentCoor.y, currentCoor.z);
            loggedPoints.push(coor);
        } else if (action === "Clear") {
            loggedPoints = [];
        }

        papayaContainers[0].viewer.drawViewer();
    };

    /**
     * This provides an opportunity for the context manager to draw to the viewer canvas.
     * @param ctx
     */
    var drawToViewer = function(ctx) {
        for (var ctr = 0; ctr < loggedPoints.length; ctr += 1) {
            if (papayaContainers[0].viewer.intersectsMainSlice(loggedPoints[ctr])) {
                var screenCoor = papayaContainers[0].viewer.convertCoordinateToScreen(loggedPoints[ctr]);
                ctx.fillStyle = "rgb(255, 0, 0)";
                ctx.fillRect(screenCoor.x, screenCoor.y, 5, 5);

                // some more examples of converting coordinates
                var originalCoord = papayaContainers[0].viewer.convertScreenToImageCoordinate(screenCoor.x, screenCoor.y);
                var world = new papaya.core.Coordinate();
                papayaContainers[0].viewer.getWorldCoordinateAtIndex(originalCoord.x, originalCoord.y, originalCoord.z, world);
                console.log(originalCoord.toString() + " " + world.toString());
            }
        }
    };

    /**
     * Called when image position changes.
     */
    var clearContext = function() {
        // do nothing
    };


    return {
        loggedPoints:loggedPoints,
        menudata:menudata,
        getContextAtImagePosition:getContextAtImagePosition,
        actionPerformed:actionPerformed,
        drawToViewer:drawToViewer,
        clearContext:clearContext
    };


};
