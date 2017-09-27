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
    
    var view_index;

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
    
    var SetViewer = function(v){
        view_index = v;
    };
    
    var SetBrainRegions = function(ro){
        region_obj = ro;
    };

    /**
     * Callback when menu option is selected.
     * @param action
     */
    var actionPerformed = function(action) {
        if (action === "Log") {
            var currentCoor = papayaContainers[view_index].viewer.cursorPosition;
            var coor = new papaya.core.Coordinate(currentCoor.x, currentCoor.y, currentCoor.z);
            loggedPoints.push(coor);
        } else if (action === "Clear") {
            loggedPoints = [];
        }

        papayaContainers[view_index].viewer.drawViewer();
    };
    
    var GetCoordinate = function(loc){    
        return new papaya.core.Coordinate(loc[0], loc[1], loc[2]);
    };

    /**
     * This provides an opportunity for the context manager to draw to the viewer canvas.
     * @param ctx
     */
    var drawToViewer = function(ctx) {
        for (var ctr = 0; ctr < loggedPoints.length; ctr += 1) {
            if (papayaContainers[view_index].viewer.intersectsMainSlice(loggedPoints[ctr])) {
                var screenCoor = papayaContainers[view_index].viewer.convertCoordinateToScreen(loggedPoints[ctr]);
                ctx.fillStyle = "rgb(255, 0, 0)";
                ctx.fillRect(screenCoor.x, screenCoor.y, 5, 5);

                // some more examples of converting coordinates
                var originalCoord = papayaContainers[view_index].viewer.convertScreenToImageCoordinate(screenCoor.x, screenCoor.y);
                var world = new papaya.core.Coordinate();
                papayaContainers[view_index].viewer.getWorldCoordinateAtIndex(originalCoord.x, originalCoord.y, originalCoord.z, world);
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
        SetViewer:SetViewer,
        SetBrainRegions:SetBrainRegions,
        GetCoordinate:GetCoordinate,
        loggedPoints:loggedPoints,
        menudata:menudata,
        getContextAtImagePosition:getContextAtImagePosition,
        actionPerformed:actionPerformed,
        drawToViewer:drawToViewer,
        clearContext:clearContext
    };


};
