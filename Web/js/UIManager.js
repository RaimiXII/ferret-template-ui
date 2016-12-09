// UI Manager
var UIManager = function()
{
    var SetSurfaceAlpha = function(index, val){
        papaya.Container.SetSurfaceAlpha(0,0, val);
        papaya.Container.showImage(0,0);
        console.log("Setting surface alpha to "+val);
    };
    
    var GetCursorLocation = function(index){
        var res = papaya.Container.GetCursorLocation(index[1], index[0]);
        var loc = res[0];
        console.log("LOCATION ->  " + loc)                      
    };
    
    var GetROILabel = function(index){
        var res = papaya.Container.GetCursorLocation(index[1], index[0]);
        var lbl = res[1];            
        var desc = this.GetRegionDataByName(lbl);
        var r_str = "<h3>"+lbl+"</h3>";
        var d_str = "<h3>"+desc+"</h3>";
        $("#current_roi").html(r_str);
        $("#roi_description").html(d_str);
        this.set_roi_alpha($("#current_roi").val(), parseFloat((parseFloat($("#ex1").val()) / 100.0)));
    };
    
    $('nav li').hover(
        function() {
        $('ul', this).stop().slideDown(200);                
        },
        function() {
        $('ul', this).stop().slideUp(200);
        }
    );                
    $("#papaya").on('click', function(e) {        
        console.log("From papaya 1.")
        console.log("CURRENT IMAGE ->  " +current_image)
        GetCursorLocation(image_map[current_image]);          
        ui.get_roi_label(image_map[current_image]);  
    });
    $("#evdti").on('click', function(e) {           
         fade_divs_in( [ "#ex_vivo_dti", "#view_and_info1", "#roi-viz-tools" ] );
         fade_divs_out(["#bannerBox"]);
         ResetViewer();
    });
    $("#reset_view").on('click', function(e) {
        console.log("Resetting Viewport.");
        ResetViewer();
    });        
    $("#show_roi_content").on('click', function(e) {
        console.log("Showing ROI content.")
        ui.reset_roi_info();
    });
    $("#minimize_all").on('click', function(e) {
        fade_divs_out( [ "#ex_vivo_dti", "#view_and_info1", "#roi-viz-tools" ] );
        ResetViewer();
    });
    $("#create_png").on('click', function(e) {
        console.log("Create PNG selected.");
    });			
    
    $("#home_screen").on('click', function(e) {
        console.log("CLICKED home screen");
        $("#current_service").html("Home");
        ui.hideDivs(    ["#image_actions", "#visualization_templates"]  );
        fade_divs_out(["#ex_vivo_dti", "#view_and_info1", "#ex1Slider"]);
        fade_divs_in(["#bannerBox"])
    });

    $("#visualization_analysis").on('click', function(e) { 
        console.log("CLICKED visualization analysis"); 
        $("#current_service").html("Visualization");             
        ui.showDivs(    ["#image_actions", "#visualization_templates"]  );
    });


    //  Below is the grow / shrink functionality for the 
    /*
    var current_h = null;
    var current_w = null;    
    $("#ex_vivo_dti").hover(
        function(){
            current_h = $("#ex_vivo_dti_dec_img").height();
            current_w = $("#ex_vivo_dti_dec_img").width();
            $("#ex_vivo_dti_dec_img").stop(true, false).animate({width: (current_w * 1.4), height: (current_h * 1.4)}, 100);
            $("#ex_vivo_dti_fa_img").stop(true, false).animate({width: (current_w * 1.4), height: (current_h * 1.4)}, 100);
            $("#ex_vivo_dti_tr_img").stop(true, false).animate({width: (current_w * 1.4), height: (current_h * 1.4)}, 100);
        },
        function(){
            $("#ex_vivo_dti_dec_img").stop(true, false).animate({width: current_w + 'px', height: current_h + 'px'}, 50);
            $("#ex_vivo_dti_fa_img").stop(true, false).animate({width: current_w + 'px', height: current_h + 'px'}, 50);
            $("#ex_vivo_dti_tr_img").stop(true, false).animate({width: current_w + 'px', height: current_h + 'px'}, 50);
        }
    ); 
    */
    $('#ex1').slider({
        formatter: function(value) {
            return 'Current s1 value: ' + value;
        }
    }).on('slide', function() {
        console.log("Ex-vivo DTI Slider value :   " + parseFloat((parseFloat($("#ex1").val()) / 100.0)));	
        SetSurfaceAlpha(image_map[current_image], parseFloat((parseFloat($("#ex1").val()) / 100.0)));    
    }).data('slider');

    var HideDivs = function(divs) {
        for(var i in divs)
        {
            $(divs[i]).hide();
        }
    };
    
    var ShowDivs = function(divs) {
        for(var i in divs)
        {
            $(divs[i]).show();
        }
    };
    
    var ResetViewer = function( ){
        var keys = [];
        for (var key in image_map) {
          if (image_map.hasOwnProperty(key)) {
            keys.push(key);
          }
        }
        for(var i = 0; i < keys.length; i++){
            HideImage(image_map[keys[i]]);
        }
    };
    
    var UpdateParams = function(img){
        ResetViewer();   
        if ( img == "ev_dti_dec" ){             
            current_image = "ExVivo_DTI_DEC"
            ShowImage(image_map[current_image]);
            SetBackgroundColorForList(["#ev_dec_txt"], '#126d9b');
            SetBackgroundColorForList(["#ev_tr_txt","#ev_fa_txt"], '#fff');
            $("#img_description1").html( "<i>Directionally Encoded Map</i>" )
            $("#template1_info").html(
                 $("<div></div>").append([
                    $("<u>Type of Image:  </u>"),                        
                    $("#img_description1"),
                    $("<br>"),
                    $("<p>ROI name: </p>").append($("#current_roi")),
                    $("<br>"),
                    $("<p>ROI description: </p>").append($("#roi_description"))
                ])
            )                                
        } else if ( img == "ev_dti_fa" ){
            current_image = "ExVivo_DTI_FA";
            ShowImage(image_map[current_image]);
            SetBackgroundColorForList(["#ev_fa_txt"], '#126d9b');
            SetBackgroundColorForList(["#ev_tr_txt","#ev_dec_txt"], '#fff');
            $("#img_description1").html( "<i>Fractional Anisotropy</i>" )
            $("#template1_info").html(
                 $("<div></div>").append([
                    $("<u>Type of Image:  </u>"),                        
                    $("#img_description1"),
                    $("<br>"),
                    $("<p>ROI name: </p>").append($("#current_roi")),
                    $("<br>"),
                    $("<p>ROI description: </p>").append($("#roi_description"))
                ])
            ) 
        } else if ( img == "ev_dti_tr" ){
            current_image = "ExVivo_DTI_TR"
            ShowImage(image_map[current_image]);
            SetBackgroundColorForList(["#ev_tr_txt"], '#126d9b');
            SetBackgroundColorForList(["#ev_dec_txt","#ev_fa_txt"], '#fff');
            $("#img_description1").html( "<i>Trace</i>" )
            $("#template1_info").html(
                 $("<div></div>").append([
                    $("<u>Type of Image:  </u>"),                        
                    $("#img_description1"),
                    $("<br>"),
                    $("<p>ROI name: </p>").append($("#current_roi")),
                    $("<br>"),
                    $("<p>ROI description: </p>").append($("#roi_description"))
                ])
            )
        } else {
            console.log("SOMETHING ELSE!");                                                       
        }
    };
    
    var ShowSurface = function(index){
        console.log("SURFACE INDEX ->  " + index)
        if(index == 0){            
            ShowDivs(    ["#papaya", "#ROI_area1", "#view_and_info1"] );
        } else {
            console.log("Unknown surface request index: "+index);
        }                        
    };
    
    var HideImage = function(index){            
        papaya.Container.hideImage(index[0], index[1]);
    };
     
    var ShowImage = function(index){
        papaya.Container.showImage(index[0], index[1]);
    };

    var SetBackgroundColorForList = function( list, color ){        
        for( i in list){
            $(list[i]).css('background', color);
        }
    };
    
    var fade_divs_in = function(divs) {
        for(i in divs){
          $( divs[i] ).fadeIn( "slow", function() {
          });
      }    
    };
    
    var fade_divs_out = function(divs) {
        for(i in divs){
          $( divs[i] ).fadeOut( "slow", function() {
          });
      }    
    };

    $("#ex_vivo_dti_dec").on('click', function(e) {  
        console.log("CLICKED Ex-vivo DEC"); 
        current_image="ExVivo_DTI_DEC"; 
        ResetViewer(); 
        UpdateParams("ev_dti_dec"); 
        ShowSurface(0);
    });

    $("#ex_vivo_dti_tr").on('click', function(e) {  
        console.log("CLICKED Ex-vivo Trace");  
        current_image="ExVivo_DTI_TR"; 
        ResetViewer();
        UpdateParams("ev_dti_tr"); 
        ShowSurface(0);
    });

    $("#ex_vivo_dti_fa").on('click', function(e) {  
        console.log("CLICKED Ex-vivo FA");  
        current_image="ExVivo_DTI_FA"; 
        ResetViewer(); 
        UpdateParams("ev_dti_fa"); 
        ShowSurface(0);
    });

    var SwapDivs = function(goingOut, goingIn){
        for(i in goingIn){
          $( goingIn[i] ).fadeIn( "slow", function() {
            for(j in goingOut){
                  $( goingOut[j] ).fadeOut( "slow", function() {
                  });
              }
          });
      }                   
    };
    
  return {  
    hideDivs : HideDivs,    
    showDivs : ShowDivs,    
    swapDivs : SwapDivs,
    instanceDiv : function(theDiv, numInstances) {       
        var new_ob = $("<div></div>");     
        var ob_arr = [];
        var ob = null;     
        for(var i = 0; i < numInstances; i++)
        {
            ob =  $(theDiv).clone();     
            ob_arr.push(ob);
        }
        new_ob.append(ob_arr);      
        $(theDiv) = ("#"+new_ob.id);
    },
    hide_image : HideImage,
    show_image : ShowImage,
    get_cursor_location : GetCursorLocation,
    get_roi_label : GetROILabel,
    set_surface_alpha : SetSurfaceAlpha,
    set_roi_alpha_val : function(idx, val){                     
        console.log("Setting roi alpha to "+val);
        papaya.Container.SetSurfaceAlpha(0, idx, val);
        papaya.Container.showImage(0, idx);
    },
    set_roi_alpha : function(roi, val){
        var surface_idx = papaya.Container.GetSurfaceIndexByName(0, $("#current_roi")[0].innerText);
        console.log("The current ROI is ->  " + roi + " with index ->       " + surface_idx);            
        if(parseInt(surface_idx) >= 0)
        {            
            for(var i = 0; i < papaya.Container.GetNumberOfSurfaces(0); i++)
            {
                if(i == parseInt(surface_idx))
                {
                    console.log("FOUND THE RIGHT INDEX.")
                    this.set_roi_alpha_val(parseInt(surface_idx), 0.95);
                }
                else
                {
                    console.log("FOUND THE wrong INDEX.")
                    if(i>0)
                    {
                        this.set_roi_alpha_val(i, 0.0);
                    }
                }
            }
        }
        else
        {
            console.log("Empty result.");
        }
    },
    reset_viewer : ResetViewer,
    reset_roi_info : function( ){
        $("#ROI_area1").hide()
    },
    set_background_color_for_list : SetBackgroundColorForList,
    update_params : UpdateParams,
    show_surface : ShowSurface,        
    LoadNewSurfaces : function(index, opt){
            var surfs = [];
            var rgbs = [];
            var fnames = [];
            var data = brain_region_struct;
            surfs.push("img/linked_content/Templates/DTI_exvivo/ROIs/ev_dti_brain.surf.gii");    
            fnames.push("ev_dti_brain.surf.gii")              
            for(var i=13; i < 20; i++){        
                if(!data["rois"][i]["data"]["path"])
                {
                    console.log("Skipping index # -> "+i);
                }
                else
                {
                    var datapath = data["rois"][i]["data"]["path"];
                    var fname       = data["rois"][i]["data"]["filename"];
                    var red             = parseFloat((parseFloat(data["rois"][i]["data"]["red"]) )/255);
                    var green        = parseFloat((parseFloat(data["rois"][i]["data"]["green"]) )/255);
                    var blue          = parseFloat((parseFloat(data["rois"][i]["data"]["blue"]) ) /255);                    
                    console.log("Processing .... " + data["rois"][i]["data"]["path"] + data["rois"][i]["data"]["filename"] + "   with color:  ("+red+", "+green+", "+blue+")");                    
                    surfs.push(datapath+fname);
                    fnames.push(fname);
                    rgbs.push([red,green,blue]);
                }
            }        
            params["surfaces"] = surfs;
            for(var j=0;j<fnames.length;j++){     
                console.log("THE SHORT FILENAME :  " + String(fnames[j]));               
                if(String(fnames[j]) == "ev_dti_brain.surf.gii"){
                    params[String(fnames[j])] = {color: [0.8,0.8,0.8], alpha: 0.75};
                } else {
                    params[String(fnames[j])] = {color: rgbs[j], alpha: 1};
                }
            }                
            params["showSurfacePlanes"] = false;
            params["surfaceBackground"] = "Black";                  
            params.showControls = false;   
            params["kioskMode"] = true;    
            if(opt == 1)
            {
                papaya.Container.showImage([0,0]);
            }
            else
            {
                console.log("Not showing the image.");
            }
        },
        GetRegionDataByName : function(name){    
            var roi_list = brain_region_struct["rois"];
            var description = ""
            for(var i=0; i < roi_list.length; i++){
                if(name == roi_list[i]["data"]["name"]){
                    description = roi_list[i]["data"]["description"];
                }
            }
            return description;
        },
        FetchBrainRegionData : function(){
            $.getJSON('ext/Brain_Regions.json', function(data) { 
                ui.showDivs(["#loading"]);
                console.log("PRINTING ROI OBJECT........"+data)                                
                brain_region_struct = data;
                var surfs = [];
                var fnames = [];
                var rgbs = [];
                surfs.push("img/linked_content/Templates/DTI_exvivo/ROIs/ev_dti_brain.surf.gii");    
                fnames.push("ev_dti_brain.surf.gii")                
                var current_image = "";            
                params["images"] =  [                                            
                                        "img/linked_content/Templates/DTI_exvivo/Volumes/ExVivo_DTI_FA.nii", 
                                        "img/linked_content/Templates/DTI_exvivo/Volumes/ExVivo_DTI_DEC.nii", 
                                        "img/linked_content/Templates/DTI_exvivo/Volumes/ExVivo_DTI_TR.nii"
                                     ];                
                params["ExVivo_DTI_FA.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1};
                params["ExVivo_DTI_DEC.nii"] = {"min": 0, "max": 255}; 
                params["ExVivo_DTI_TR.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1500};                
                ui.LoadNewSurfaces(image_map[current_image],0);
            });
        },
        FadeDivsIn : fade_divs_in,
        FadeDivsOut : fade_divs_out,
  };
};
