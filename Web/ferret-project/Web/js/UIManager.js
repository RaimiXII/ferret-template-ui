// UI Manager
var UIManager = function(){
    var image_map = {
        "ExVivo_DTI_FA"    : [0,0],
        "ExVivo_DTI_DEC"   : [0,1],
        "ExVivo_DTI_TR"    : [0,2],      
        "evDTI_SEGMENTATION"    : [0,3],              
        "InVivo_DTI_FA"    : [1,0],
        "InVivo_DTI_DEC"   : [1,1],        
        "InVivo_DTI_TR"    : [1,2],        
        "Template4D_TE010" : [2,0],
        "Template4D_TE020" : [2,1],
        "Template4D_TE030" : [2,2],
        "Template4D_TE040" : [2,3],
        "Template4D_TE050" : [2,4],
        "Template4D_TE060" : [2,5],
        "Template4D_TE070" : [2,6],
        "Template4D_TE080" : [2,7],
        "Template4D_TE090" : [2,8],
        "Template4D_TE100" : [2,9],
        "ivT2_TE012"       : [3,0],
        "ivT2_TE036"       : [3,1],
        "ivT2_TE060"       : [3,2],
        "ivT2_TE084"       : [3,3],            
    };
    
    var chartHelper;    
    var currentData;
    var currentLabel;
    
    
    var LoadAboutPage = function(){
        var title = '<h1 class="display-3">About MRI Atlases!</h1>'
        var sub_head = '<p class="lead">This set of ferret brain templates is based on the work described in the following citation:</p>';
        var citation = '<p> Hutchinson, E.B., Schwerin, S.C., Radomski, K.L., Sadeghi, N., Jenkins, J., Komlosh, M.E., Irfanoglu, M.O., Juliano, S.L., & Pierpaoli, C. (2017) Population based MRI and DTI templates of the adult ferret brain and tools for voxelwise analysis. Neuroimage,152, 575–589.   <a href="https://www.ncbi.nlm.nih.gov/pubmed/28315740">link</a></p>';
        var additional = '<p> with anatomical labels according to the book chapter: </p>';
        var book_cite = '<p> Neuroanatomy of the Ferret Brain with Focus on the Cerebral Cortex by Christopher D. Kroenke, Brian D. Mills, Jaime F. Olavarria and Jeffrey J. Neil in the book Biology and Diseases of the Ferret, 2014.</p>';
        var line = '<hr class="my-4">';
        var email_info = '<p>If you are interested in downloading these templates and labels to work with them directly, please click the button below to submit a request.</p>';
        var email_button = '<p class="lead"><a class="btn btn-primary btn-lg" href="#" role="button" data-toggle="modal" data-target="#form_modal"  id="submit_button">Submit Request for Data</a></p>';
        var content = title+sub_head+citation+additional+book_cite+line+email_info+email_button;
        $("#about_content").html(content);
    };
    
    var LoadRequestForm = function(){
    };
    
    
    var SetSurfaceAlpha = function(index, val){
        papaya.Container.SetSurfaceAlpha(index[0], index[1], val);
        papaya.Container.showImage(index[0], index[1]);
        console.log("Setting surface alpha to "+val);
    };    
    
    var GetRegionDataByName = function(name){    
            var roi_list = brain_region_struct["rois"];
            var description = ""
            for(var i=0; i < roi_list.length; i++){
                if(name == roi_list[i]["data"]["name"]){
                    description = roi_list[i]["data"]["description"];
                }
            }
            return description;
        }
    
    var GetCursorLocation = function(index){
        var res = papaya.Container.GetCursorLocation(index[1], index[0]);
        var loc = res[0];
        console.log("LOCATION ->  " + loc)                      
        return res
    };    
    
    var GetROILabel = function(index){        
        var res = GetCursorLocation(index);
        var lbl = res[1];              
        SetROIContent(lbl);                                   
        //this.set_roi_alpha($("#current_roi").val(), parseFloat((parseFloat($("#ex1").val()) / 100.0)));
    };    
    var SetROIContent = function(name){
        var r_str = "ROI name: <b>"+name+"</b><br><br>";

        var email_button = '<p class="lead"><a class="btn btn-primary btn-lg" href="#" role="button" data-toggle="modal" data-target="#feedback_modal"  id="submit_button">Describe</a></p>';
        var d_str = "Description: <b>"+email_button+"</b><br><br>";
        $("#current_roi").html(r_str);
        $("#roi_description").html(d_str);
        var roidata = GetRegionCsvByName(name);        
    };
    
    function objectifyForm(formArray) {//serialize data function

          var returnArray = {};
          for (var i = 0; i < formArray.length; i++){
            returnArray[formArray[i]['name']] = formArray[i]['value'];
          }
          return returnArray;
        }


    $('nav li').hover(
        function() {
        $('ul', this).stop().slideDown(200);                
        },
        function() {
        $('ul', this).stop().slideUp(200);
        }
    );                
    $("#papaya1").on('click', function(e) {               
        GetROILabel(image_map[current_image]);  
        $("#img_description").html("Image Modality: <b>Ex-Vivo DTI</b>")
    });
    $("#papaya2").on('click', function(e) {                 
        GetROILabel(image_map[current_image]);
        $("#img_description").html("Image Modality: <b>In-Vivo DTI</b>")
    });
    $("#papaya3").on('click', function(e) {        
        GetROILabel(image_map[current_image]);
        $("#img_description").html("Image Modality: <b>Ex-Vivo T2 Weighted</b>")
    });
    $("#papaya4").on('click', function(e) {                  
        GetROILabel(image_map[current_image]);
        $("#img_description").html("Image Modality: <b>In-Vivo T2 Weighted</b>")
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
        fade_divs_out( [ "#ex_vivo_dti", "#MRI_area1", "#roi-viz-tools", "#download_templates","#about_containter" ] );
        ResetViewer();
    });
    $("#create_png").on('click', function(e) {
        console.log("Create PNG selected.");
    });		        
    $("#home_screen").on('click', function(e) {
        $("#current_service").html("Home");
        ui.hideDivs(    ["#image_actions", "#visualization_templates", "#template_content"]  );
        fade_divs_out(["#ex_vivo_dti", "#MRI_area1", "#ex1Slider", "#ferret_atlas_download_content", "#about_containter"]);
        fade_divs_in(["#bannerBox"])
    });
    $("#visualization_screen").on('click', function(e) { 
        $("#current_service").html("Templates");             
        fade_divs_out(["#bannerBox", "#ferret_atlas_download_content", "#about_containter"]);
        fade_divs_in( [ "#ex_vivo_dti", "#MRI_area1", "#roi-viz-tools", "#image_actions", "#visualization_templates", "#template_content" ] );         
        ResetViewer();
    });
    $("#download_screen").on('click', function(e) { 
        $("#current_service").html("Downloads");             
        ui.hideDivs(    ["#image_actions", "#visualization_templates",  "#about_templates"]  );
        fade_divs_out(["#MRI_area1", "#template_content","#bannerBox"  ]);
        fade_divs_in(["#ferret_atlas_download_content"])
    });
    $("#about_screen").on('click', function(e) { 
        $("#current_service").html("About");             
        LoadAboutPage();
        ui.hideDivs(    ["#image_actions", "#visualization_templates", "#template_content", "#download_templates"]  );
        fade_divs_out(["#ex_vivo_dti", "#MRI_area1", "#bannerBox", "#ferret_atlas_download_content" ]);
        fade_divs_in(["#about_containter"])
    });
    $("#submit_button").on('click', function(e) {
        LoadRequestForm();
    });
    
    $("#about_page_button").on('click', function(e) {
         $("#current_service").html("About");             
        LoadAboutPage();
        ui.hideDivs(    ["#image_actions", "#visualization_templates", "#template_content", "#download_templates"]  );
        fade_divs_out(["#ex_vivo_dti", "#MRI_area1", "#bannerBox", "#ferret_atlas_download_content" ]);
        fade_divs_in(["#about_containter"])
    });
    
    $('#contact_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            first_name: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please supply your first name'
                    }
                }
            },
             last_name: {
                validators: {
                     stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply your last name'
                    }
                }
            },
            institution: {
                validators: {
                      stringLength: {
                        min: 2,
                        max: 200,
                        message:'Please enter at least 2 characters and no more than 200'
                    },
                    notEmpty: {
                        message: 'Please supply a valid institution.'
                    }
                    }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your email address'
                    },
                    emailAddress: {
                        message: 'Please supply a valid email address'
                    }
                }
            },
            comment: {
                validators: {
                      stringLength: {
                        min: 10,
                        max: 200,
                        message:'Please enter at least 10 characters and no more than 200'
                    },
                    notEmpty: {
                        message: 'Please supply a description of your intended usage for our data'
                    }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            $('#success_message_request').slideDown({ opacity: "show" }, "slow") // Do something ...
                $('#contact_form').data('bootstrapValidator').resetForm();

            // Prevent form submission
            //e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');
            
            // Format the form fields into json object
            var dataz = objectifyForm($form.serializeArray());
            console.log(dataz);
            console.log($form.serialize());
                        
            var data = {
                first_name: dataz["first_name"],
                last_name: dataz["last_name"],
                email: dataz["email"],
                institution: dataz["institution"],
                message: dataz["comment"]
            };
            
            $.ajax({
                type: "POST",
                url: "/mail/index.php",
                dataType: 'text',
                data: data,
                success: function(data){
                    console.log('DATA');
                    console.log(data);
                    $('.success').fadeIn(1000);
                }
            });
        });
        
        $('#feedback_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            first_name: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please supply your first name'
                    }
                }
            },
             last_name: {
                validators: {
                     stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply your last name'
                    }
                }
            },
            institution: {
                validators: {
                      stringLength: {
                        min: 2,
                        max: 200,
                        message:'Please enter at least 2 characters and no more than 200'
                    },
                    notEmpty: {
                        message: 'Please supply a valid institution.'
                    }
                    }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your email address'
                    },
                    emailAddress: {
                        message: 'Please supply a valid email address'
                    }
                }
            },
            comment: {
                validators: {
                      stringLength: {
                        min: 10,
                        max: 200,
                        message:'Please enter at least 10 characters and no more than 200'
                    },
                    notEmpty: {
                        message: 'Please supply a description of your intended usage for our data'
                    }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            $('#success_message_roi').slideDown({ opacity: "show" }, "slow") // Do something ...
                $('#feedback_form').data('bootstrapValidator').resetForm();

            // Prevent form submission
            //e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');
            
            // Format the form fields into json object
            var dataz = objectifyForm($form.serializeArray());
            console.log(dataz);
            console.log($form.serialize());
                        
            var data = {
                first_name: dataz["first_name"],
                last_name: dataz["last_name"],
                email: dataz["email"],
                institution: dataz["institution"],
                message: dataz["comment"]
            };
            
            $.ajax({
                type: "POST",
                url: "/mail/index.php",
                dataType: 'text',
                data: data,
                success: function(data){
                    console.log('DATA');
                    console.log(data);
                    $('.success').fadeIn(1000);
                }
            });
        });
    
    //$('#ex1').slider({ formatter: function(value) { return 'Current s1 value: ' + value; } }).on('slide', function() { SetSurfaceAlpha(image_map[current_image], parseFloat((parseFloat($("#ex1").val()) / 100.0))); }).data('slider');
    var HideDivs = function(divs) { for(var i in divs) { $(divs[i]).hide(); } };    
    var ShowDivs = function(divs) { for(var i in divs) { $(divs[i]).show(); } };    
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
        if (      img == "ev_dti_dec" ){ current_image = "ExVivo_DTI_DEC"; } 
        else if ( img == "ev_dti_fa" ){ current_image = "ExVivo_DTI_FA"; } 
        else if ( img == "ev_dti_tr" ){ current_image = "ExVivo_DTI_TR"; } 
        else if ( img == "ev_dti_segmentation" ){ current_image = "evDTI_SEGMENTATION"; } 
        else if ( img == "iv_dti_dec" ){ current_image = "InVivo_DTI_DEC"; }         
        else if ( img == "iv_dti_fa" ){ current_image = "InVivo_DTI_FA"; } 
        else if ( img == "iv_dti_tr" ){ current_image = "InVivo_DTI_TR"; } 
        else if ( img == "ev_t2_10" ){ current_image = "Template4D_TE010"; } 
        else if ( img == "ev_t2_20" ){ current_image = "Template4D_TE020"; } 
        else if ( img == "ev_t2_30" ){ current_image = "Template4D_TE030"; } 
        else if ( img == "ev_t2_40" ){ current_image = "Template4D_TE040"; } 
        else if ( img == "ev_t2_50" ){ current_image = "Template4D_TE050"; } 
        else if ( img == "ev_t2_60" ){ current_image = "Template4D_TE060"; } 
        else if ( img == "ev_t2_70" ){ current_image = "Template4D_TE070"; } 
        else if ( img == "ev_t2_80" ){ current_image = "Template4D_TE080"; } 
        else if ( img == "ev_t2_90" ){ current_image = "Template4D_TE090"; } 
        else if ( img == "ev_t2_100" ){ current_image = "Template4D_TE100"; } 
        else if ( img == "iv_t2_012" ){ current_image = "ivT2_TE012"; } 
        else if ( img == "iv_t2_036" ){ current_image = "ivT2_TE036"; } 
        else if ( img == "iv_t2_060" ){ current_image = "ivT2_TE060"; } 
        else if ( img == "iv_t2_084" ){ current_image = "ivT2_TE084"; } 
        else {console.log("SOMETHING ELSE was selected..."); }        
        ShowImage(image_map[current_image]);
        ShowSurface(image_map[current_image][0]);
        GetROILabel(image_map[current_image])
    };           
    var ShowSurface = function(index){
        if(index == 0){ HideDivs(["#in_vivo_dti_viewer","#ex_vivo_t2_viewer", "#in_vivo_t2_viewer"]); SwapDivs(["#in_vivo_dti_viewer","#ex_vivo_t2_viewer", "#in_vivo_t2_viewer"], ["#ex_vivo_dti_viewer"], "fast"); } 
        else if(index == 1) { HideDivs(["#ex_vivo_dti_viewer","#ex_vivo_t2_viewer", "#in_vivo_t2_viewer"]); SwapDivs(["#ex_vivo_dti_viewer","#ex_vivo_t2_viewer", "#in_vivo_t2_viewer"], ["#in_vivo_dti_viewer"], "fast"); } 
        else if(index == 2){ HideDivs(["#ex_vivo_dti_viewer","#in_vivo_dti_viewer", "#in_vivo_t2_viewer"]); SwapDivs(["#ex_vivo_dti_viewer","#in_vivo_dti_viewer", "#in_vivo_t2_viewer"], ["#ex_vivo_t2_viewer"], "fast"); } 
        else if(index == 3){ HideDivs(["#ex_vivo_dti_viewer","#in_vivo_dti_viewer", "#ex_vivo_t2_viewer"]); SwapDivs(["#ex_vivo_dti_viewer","#in_vivo_dti_viewer", "#ex_vivo_t2_viewer"], ["#in_vivo_t2_viewer"], "fast"); }
        else{ console.log("Unknown surface request index: "+index); }                        
    };    
    var GetVoxelValue = function(index, vidx){ return papaya.Container.getVoxelValue(index[0], index[1], vidx) };
    var HideImage = function(index){ papaya.Container.hideImage(index[0], index[1]); };     
    var ShowImage = function(index){ papaya.Container.showImage(index[0], index[1]); };
    var SetBackgroundColorForList = function( list, color ){ for( i in list){ $(list[i]).css('background', color); } };    
    var fade_divs_in = function(divs) { for(i in divs){ $( divs[i] ).fadeIn( "slow", function() { }); } };    
    var fade_divs_out = function(divs) { for(i in divs){ $( divs[i] ).fadeOut( "slow", function() { }); } };    
    $('.tree-toggle').click(function () { $(this).parent().children('ul.tree').toggle(200); });
    $("#ex_vivo_dti_dec").on('click', function(e) { UpdateParams("ev_dti_dec"); HideDivs(["#template_nav2"]);});
    $("#ex_vivo_dti_tr").on('click', function(e) { UpdateParams("ev_dti_tr"); HideDivs(["#template_nav2"]);});
    $("#ex_vivo_dti_fa").on('click', function(e) { UpdateParams("ev_dti_fa"); HideDivs(["#template_nav2"]);});  
    $("#ev_dti_segmentation").on('click', function(e) { UpdateParams("ev_dti_segmentation"); ShowDivs(["#template_nav2"]);});  
    $("#in_vivo_dti_dec").on('click', function(e) { UpdateParams("iv_dti_dec"); HideDivs(["#template_nav2"]);});
    $("#in_vivo_dti_tr").on('click', function(e) { UpdateParams("iv_dti_tr"); HideDivs(["#template_nav2"]);});    
    $("#in_vivo_dti_fa").on('click', function(e) { UpdateParams("iv_dti_fa"); HideDivs(["#template_nav2"]);}); 
    $("#ex_vivo_T2_10").on('click', function(e) { UpdateParams("ev_t2_10"); HideDivs(["#template_nav2"]);});
    $("#ex_vivo_T2_20").on('click', function(e) { UpdateParams("ev_t2_20"); HideDivs(["#template_nav2"]);});
    $("#ex_vivo_T2_30").on('click', function(e) { UpdateParams("ev_t2_30"); HideDivs(["#template_nav2"]);});
    $("#ex_vivo_T2_40").on('click', function(e) { UpdateParams("ev_t2_40"); HideDivs(["#template_nav2"]);});
    $("#ex_vivo_T2_50").on('click', function(e) { UpdateParams("ev_t2_50"); HideDivs(["#template_nav2"]);});
    $("#ex_vivo_T2_60").on('click', function(e) { UpdateParams("ev_t2_60"); HideDivs(["#template_nav2"]);});
    $("#ex_vivo_T2_70").on('click', function(e) { UpdateParams("ev_t2_70"); HideDivs(["#template_nav2"]);});
    $("#ex_vivo_T2_80").on('click', function(e) { UpdateParams("ev_t2_80");HideDivs(["#template_nav2"]); });
    $("#ex_vivo_T2_90").on('click', function(e) { UpdateParams("ev_t2_90"); HideDivs(["#template_nav2"]);});
    $("#ex_vivo_T2_100").on('click', function(e) { UpdateParams("ev_t2_100"); HideDivs(["#template_nav2"]);});    
    $("#in_vivo_T2_12").on('click', function(e) { UpdateParams("iv_t2_012"); HideDivs(["#template_nav2"]);});
    $("#in_vivo_T2_36").on('click', function(e) { UpdateParams("iv_t2_036"); HideDivs(["#template_nav2"]);});
    $("#in_vivo_T2_60").on('click', function(e) { UpdateParams("iv_t2_060"); HideDivs(["#template_nav2"]);});
    $("#in_vivo_T2_84").on('click', function(e) { UpdateParams("iv_t2_084"); HideDivs(["#template_nav2"]);});
    //$("#in_vivo_T2_108").on('click', function(e) { UpdateParams("iv_t2_108"); });
    //$("#in_vivo_T2_132").on('click', function(e) { UpdateParams("iv_t2_132"); });
    $("#search_roi").on('click', function(e) { SetROIContent($("#query").val());});    
    $("#explore_mode").on('click', function(e) { console.log("explore mode selected.");});    
    $("#annotate_mode").on('click', function(e) { console.log("annotate mode selected.");});    
    $("#extra_mode").on('click', function(e) { console.log("extra mode selected.");});    
    $("#ferret_atlas_downloads").on('click', function(e) { console.log("trying to d/l bundle "); /**$("#myModal").show();*/ });
    $("#modality_fa").on('click', function(e) {console.log("FA MODALITY SELECTED."); UpdateParams("ev_dti_fa"); ShowDivs(["#histogram_container", "#voxel_value","#roi_volume", "#roi_mean", "#roi_std_dev"]); });
    $("#modality_tr").on('click', function(e) {console.log("TR MODALITY SELECTED."); UpdateParams("ev_dti_tr");   ShowDivs(["#histogram_container", "#voxel_value","#roi_volume", "#roi_mean", "#roi_std_dev"]);});
    $("#modality_ev_roi").on('click', function(e) {console.log("ROI MODALITY SELECTED."); UpdateParams("ev_dti_segmentation"); HideDivs(["#histogram_container", "#voxel_value","#roi_volume", "#roi_mean", "#roi_std_dev"]);  });
    
    $("#evdti_navtree").on('click', function(e) {
        HideDivs(['ul.sub']);
        fade_divs_in(['#evdti_tree']);
    });
    $("#ivdti_navtree").on('click', function(e) {
        HideDivs(['ul.sub']);
        fade_divs_in(['#ivdti_tree']);
     });
    $("#evt2_navtree").on('click', function(e) {
        HideDivs(['ul.sub']);
        fade_divs_in(['#evt2_tree']);
    });
    $("#ivt2_navtree").on('click', function(e) {
        HideDivs(['ul.sub']);
        fade_divs_in(['#ivt2_tree']);
    });
    $("#evseg_navtree").on('click', function(e) {
        console.log("EV SEG NAV CLICKED."); 
    });
    
    var SwapDivs = function(goingOut, goingIn, speed){
        for(i in goingIn){
          $( goingIn[i] ).fadeIn( speed, function() {
            for(j in goingOut){
                  $( goingOut[j] ).fadeOut( speed, function() {
                  });
              }
          });
      }                   
    };    
    
    var CsvToJson = function(fname){
        var lines=csv.split("\n");
          var result = [];
          var headers=lines[0].split(",");
          for(var i=1;i<lines.length;i++){
              var obj = {};
              var currentline=lines[i].split(",");
              for(var j=0;j<headers.length;j++){
	              obj[headers[j]] = currentline[j];
              }
              result.push(obj);
          }          
          return JSON.stringify(result); //JSON    
    };
    
    function processData(allText) {
        var record_num = 2;  // or however many elements there are in each row
        var allTextLines = allText.split(/\r\n|\n/);
        var entries = allTextLines[0].split(',');
        var lines = [];
        var headings = entries.splice(0,record_num);
        while (entries.length>0) {
            var tarr = [];
            for (var j=0; j<record_num; j++) {
                tarr.push(headings[j]+":"+entries.shift());
            }
            lines.push(tarr);
        }
    }
    
     var GetRegionCsvByName = function(name){
        var roi_list = brain_region_struct["rois"];
            var values = ""
            for(var i=0; i < roi_list.length; i++){
                if(name == roi_list[i]["data"]["name"]){
                    values = roi_list[i]["data"]["ExVivoVoxelValues"];
                }
            }            
             $.ajax({
              url: values,
              dataType: 'text',
            }).done(UpdateRoiData);    
    };
    
    var UpdateRoiData = function(d){
        var csv_as_json = chartHelper.CsvToJson(d);        
        var c_im_split = current_image.split('_');
        var c_im_type = c_im_split[c_im_split.length-1];
        var plot_col;
        if(c_im_type == "FA")
        {
            chartHelper.CreateHistogram(csv_as_json, 25,0);
            var val = GetVoxelValue(image_map[current_image], GetCursorLocation(image_map[current_image])[0]);            
            $("#voxel_value").html("<br>Value: <b>"+ (val)+"</b><br><br>")
        }
        else if(c_im_type == "TR")
        {
            chartHelper.CreateHistogram(csv_as_json, 25,1);
            var val = GetVoxelValue(image_map[current_image], GetCursorLocation(image_map[current_image])[0]);            
            $("#voxel_value").html("<br>Value: <b>"+ (val)+"(mm^2)/s</b><br><br>")
        }
        else
        {
            console.log("Not a quantitative map.... no plot updates.");
        }    
    }
    
    var SetChartHelper = function(c){
        chartHelper = c;
    };      
     
  return {  
    SetChartHelper: SetChartHelper,
    hideDivs : HideDivs,    
    showDivs : ShowDivs,    
    swapDivs : SwapDivs,
    GetRegionCsvByName:GetRegionCsvByName,
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
    SetROIContent:SetROIContent,
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
    reset_roi_info : function( ){ $("#ROI_area1").hide(); },
    set_background_color_for_list : SetBackgroundColorForList,
    update_params : UpdateParams,
    show_surface : ShowSurface,  
    
    LoadAboutPage :  LoadAboutPage,
    LoadRequestForm : LoadRequestForm,
    
    LoadMainSurface : function( ) {
    
        var surfs = [];
        var rgbs = [];
        var fnames = [];
        var data = brain_region_struct;
        surfs.push("img/linked_content/Templates/DTI_exvivo/ROIs/ev_dti_brain.surf.gii");    
        fnames.push("ev_dti_brain.surf.gii");   
        params["surfaces"] = surfs;
        params["ev_dti_brain.surf.gii"] = {color: [0.8,0.8,0.8], alpha: 0.75};
        params["showSurfacePlanes"] = false;
        params["surfaceBackground"] = "Black";                  
        params.showControls = false;   
        params["kioskMode"] = true;     
    },      
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
        GetRegionDataByName : GetRegionDataByName,
        FetchBrainRegionData : function(){
        
            $.getJSON('ext/Brain_Regions.json', function(data) { 
                ui.showDivs(["#loading"]);
                console.log("PRINTING ROI OBJECT........"+data)                                
                brain_region_struct = data;
            
                var surfs = [];
                var rgbs = [];
                var fnames = [];
                var data = brain_region_struct;
                            
                var roi_names=[]
                for(var i = 0; i < data["rois"].length; i++){
                    roi_names.push(data["rois"][i]["data"]["name"])
                }
                
                $('#query').typeahead({ local: roi_names });
                $('.tt-query').css('background-color','#fff');                  
                
                
                var ctxMgr1 = new ContextManager();
                ctxMgr1.SetViewer(0);
                ctxMgr1.SetRegionObject(brain_region_struct);
                
                var ctxMgr2 = new ContextManager();
                ctxMgr2.SetViewer(1);
                ctxMgr2.SetRegionObject(brain_region_struct);
                
                var ctxMgr3 = new ContextManager();
                ctxMgr3.SetViewer(2);
                ctxMgr3.SetRegionObject(brain_region_struct);
                
                var ctxMgr4 = new ContextManager();
                ctxMgr4.SetViewer(3);
                ctxMgr4.SetRegionObject(brain_region_struct);
                
                var using_surfaces = false;
                    
                params1["kioskMode"] = true;   
                if(using_surfaces){
                    params1["surfaces"] = []
                    params1["surfaces"] = ["img/linked_content/Templates/DTI_exvivo/ROIs/Anatomy/RGBA/evDTI_SEGMENTATION_RGBA.surf.gii"]
                    params1["evDTI_SEGMENTATION_RGBA.surf.gii"] = {alpha: 0.75};        
                    params1["showSurfacePlanes"] = false;
                    params1["surfaceBackground"] = "Black";                 
                }
                                
                params1["images"] =  [                                            
                                        "img/linked_content/Templates/DTI_exvivo/Volumes/ExVivo_DTI_FA.nii", 
                                        "img/linked_content/Templates/DTI_exvivo/Volumes/ExVivo_DTI_DEC.nii", 
                                        "img/linked_content/Templates/DTI_exvivo/Volumes/ExVivo_DTI_TR.nii",
                                        "img/linked_content/Templates/DTI_exvivo/ROIs/Anatomy/evDTI_SEGMENTATION.dcm"
                                    ];                
                params1["ExVivo_DTI_FA.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1};
                params1["ExVivo_DTI_DEC.nii"] = {"min": 0, "max": 255}; 
                params1["ExVivo_DTI_TR.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1500};        
                
                //params1["luts"] = [{"name": "Custom", "data":[[0, 1, 0, 0], [.5, 1, 1, 0], [1, 1, 1, 1]]}];
                params1["evDTI_SEGMENTATION.dcm"]  = {"lut": "Ev Dti Seg", "min": 0, "max": 1};
                 
                params1.showControls = false; 
                //params1["contextManager"] = ctxMgr1;
                
                //  TBD - put this back in when we get info on the ROIs
                //ui.LoadNewSurfaces(image_map[current_image],0);
                
                using_surfaces = false;
                
                //  This just loads the main 3d whole brain surface volume
                //ui.LoadMainSurface();            
                params2["kioskMode"] = true;                        
                                
                params2["images"] =  [                                            
                                        "img/linked_content/Templates/DTI_invivo/Volumes/InVivo_DTI_FA.nii", 
                                        "img/linked_content/Templates/DTI_invivo/Volumes/InVivo_DTI_DEC.nii", 
                                        "img/linked_content/Templates/DTI_invivo/Volumes/InVivo_DTI_TR.nii",
                                     ];  
                 if(using_surfaces){
                    params2["surfaces"] = [];
                    params2["surfaces"] = ["img/linked_content/Templates/DTI_invivo/ROIs/iv_dti_brain.surf.gii"];                                  
                    params2["iv_dti_brain.surf.gii"] = {color:[0.8,0.8,0.8], alpha: 0.75};                                         
                    params2["showSurfacePlanes"] = false;
                    params2["surfaceBackground"] = "Black";
                }
                           
                params2["InVivo_DTI_FA.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1};
                params2["InVivo_DTI_DEC.nii"] = {"min": 0, "max": 255}; 
                params2["InVivo_DTI_TR.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 6000};                  
                
                params2.showControls = false;          
                //params2["contextManager"] = ctxMgr2;            
                    
                params3["kioskMode"] = true;      
                if(using_surfaces){
                    params3["surfaces"] = [];                
                    params3["surfaces"] = ["img/linked_content/Templates/T2_exvivo/ROIs/ev_t2_brain.surf.gii"];
                    params3["ev_t2_brain.surf.gii"] = {color:[0.8,0.8,0.8], alpha: 0.75};     
                    params3["showSurfacePlanes"] = false;
                    params3["surfaceBackground"] = "Black";
                }
                
                params3["images"] =  [  
                                        "img/linked_content/Templates/T2_exvivo/Volumes/Template4D_TE010.nii",
                                        "img/linked_content/Templates/T2_exvivo/Volumes/Template4D_TE020.nii",
                                        "img/linked_content/Templates/T2_exvivo/Volumes/Template4D_TE030.nii",
                                        "img/linked_content/Templates/T2_exvivo/Volumes/Template4D_TE040.nii",
                                        "img/linked_content/Templates/T2_exvivo/Volumes/Template4D_TE050.nii",
                                        "img/linked_content/Templates/T2_exvivo/Volumes/Template4D_TE060.nii",
                                        "img/linked_content/Templates/T2_exvivo/Volumes/Template4D_TE070.nii",
                                        "img/linked_content/Templates/T2_exvivo/Volumes/Template4D_TE080.nii",
                                        "img/linked_content/Templates/T2_exvivo/Volumes/Template4D_TE090.nii",
                                        "img/linked_content/Templates/T2_exvivo/Volumes/Template4D_TE100.nii"
                                     ];                                                               
                params3["Template4D_TE010.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1500000};
                params3["Template4D_TE020.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1500000};
                params3["Template4D_TE030.nii"] ={"lut": "Hot-Cool", "min": 0, "max":  1500000};
                params3["Template4D_TE040.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1500000};
                params3["Template4D_TE050.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1500000};
                params3["Template4D_TE060.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1500000};
                params3["Template4D_TE070.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1500000};
                params3["Template4D_TE080.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1500000};
                params3["Template4D_TE090.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1500000};
                params3["Template4D_TE100.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 1500000};                
                
                params3.showControls = false              
                //params3["contextManager"] = ctxMgr3;  
                    
                params4["kioskMode"] = true;    
                if(using_surfaces){
                    params4["surfaces"] = [];
                    params4["surfaces"] = ["img/linked_content/Templates/T2_invivo/ROIs/iv_t2_brain.surf.gii"];
                    params4["iv_t2_brain.surf.gii"] = {color:[0.8,0.8,0.8], alpha: 0.75};        
                    params4["showSurfacePlanes"] = false;                                                        
                    params4["surfaceBackground"] = "Black";
                }
                
                params4["images"] =  [
                                        "img/linked_content/Templates/T2_invivo/Volumes/ivT2_TE012.nii",
                                        "img/linked_content/Templates/T2_invivo/Volumes/ivT2_TE036.nii",
                                        "img/linked_content/Templates/T2_invivo/Volumes/ivT2_TE060.nii",
                                        "img/linked_content/Templates/T2_invivo/Volumes/ivT2_TE084.nii",                                             
                                     ];  
                params4["ivT2_TE012.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 100};
                params4["ivT2_TE036.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 100};
                params4["ivT2_TE060.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 100};
                params4["ivT2_TE084.nii"] = {"lut": "Hot-Cool", "min": 0, "max": 100};
                                                                      
                
                params4.showControls = false   
                //params4["contextManager"] = ctxMgr4;                
            });            
        },
        FadeDivsIn : fade_divs_in,
        FadeDivsOut : fade_divs_out,        
  };
};
