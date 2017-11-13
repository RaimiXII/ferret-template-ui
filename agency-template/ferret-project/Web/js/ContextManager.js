// context manager for papaya

var ContextManager = function(){


    this.loggedPoints = [];
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
    
    var region_obj;
    
    var this_context;

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
        //this_context = papayaContainers[view_index].viewer.context;
    };
    
    var SetRegionObject = function(ro){
        region_obj = ro;
        //this_context = papayaContainers[view_index].viewer.Display.context;
        //console.log("Successfully set the context.")
    };

    /**
     * Callback when menu option is selected.
     * @param action
     */
    var actionPerformed = function(action) {
        if (action === "Log") {
            var currentCoor = papayaContainers[view_index].viewer.cursorPosition;
            var coor = new papaya.core.Coordinate(currentCoor.x, currentCoor.y, currentCoor.z);
            this.loggedPoints.push(coor);
            //GetRegionFileByName();
        } else if (action === "Clear") {
            //loggedPoints = [];
            GetRegionFileByName();
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
        for (var ctr = 0; ctr < this.loggedPoints.length; ctr += 1) {
            if (papayaContainers[view_index].viewer.intersectsMainSlice(this.loggedPoints[ctr])) {
            
                
            
                var screenCoor = papayaContainers[view_index].viewer.convertCoordinateToScreen(this.loggedPoints[ctr]);
                ctx.fillStyle = "rgb(255, 0, 0)";
                ctx.fillRect(screenCoor.x, screenCoor.y, 5, 5);                
            }
        }
    };
    
    var GetRegionFileByName = function( ctx/* was name */)  {
        this_context =ctx;
        console.log("Successfully set the context.")
        var roi_list = region_obj["rois"];
            var values = ""
            var name = "Thalamus";
            for(var i=0; i < roi_list.length; i++){
                if(name == roi_list[i]["data"]["name"]){
                    values = roi_list[i]["data"]["ExVivoVoxelIndices"];
                }
            }            
             $.ajax({
              url: values,
              dataType: 'text',
            }).done(UpdateRoiData);    
    };
    
    var UpdateRoiData = function(d){
        var csv_as_json = chartHelper.CsvToJson(d);
        
        console.log("PRINTING ROI DATA IN CONTEXT MANAGER");
        
        console.log(csv_as_json);
        this.logged_points=[];
        for(var i = 0; i < csv_as_json.length; i++)
        {
            this.logged_points.push(GetCoordinate(csv_as_json[i]));
        }
        
        //var c_im_split = current_image.split('_');
        //var c_im_type = c_im_split[c_im_split.length-1];
        
        for(var i = 0; i < this.logged_points.length; i++){
            var screenCoor = papayaContainers[view_index].viewer.convertCoordinateToScreen(this.logged_points[i]);
            papayaContainers[view_index].viewer.context.fillStyle = "rgb(255, 0, 0)";
            papayaContainers[view_index].viewer.context.fillRect(screenCoor.x, screenCoor.y, 5, 5);
            
            var originalCoord = papayaContainers[view_index].viewer.convertScreenToImageCoordinate(screenCoor.x, screenCoor.y);
            var world = new papaya.core.Coordinate();
            papayaContainers[view_index].viewer.getWorldCoordinateAtIndex(originalCoord.x, originalCoord.y, originalCoord.z, world);
        }        
    };
    
    var SetChartHelper = function(c){
    
        chartHelper = c;
    };
    
    
    var drawRoiPointsToViewer = function(ctx) {    
    };
    

    /**
     * Called when image position changes.
     */
    var clearContext = function() {
        // do nothing
    };


    return {
        SetViewer:SetViewer,
        SetRegionObject:SetRegionObject,
        SetChartHelper:SetChartHelper,
        GetCoordinate:GetCoordinate,
        loggedPoints:this.loggedPoints,
        menudata:menudata,
        getContextAtImagePosition:getContextAtImagePosition,
        actionPerformed:actionPerformed,
        drawToViewer:drawToViewer,
        clearContext:clearContext
    };


};
