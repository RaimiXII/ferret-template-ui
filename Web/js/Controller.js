var Controller = function(){

    var pages = ["#HomePage", "#FerretPage"];
    
    var contentAreas = ["#ContentArea1", "#ContentArea2", "#ContentArea3"]; // not quite yet.->"#ContentArea4"

    var buttons = {};
    
    var text = {};
    
    var images = {};
    
    var model = {};
    
    var HideWidgets = function (wlist){    
        for(var i =0; i < wlist.length; i++)
        {        
            $(wlist[i]).hide();
        }
    };
      
    var ShowWidgets = function (wlist){    
        for(var i =0; i < wlist.length; i++)
        {        
            $(wlist[i]).show();
        }
    };
    
    var AppendContentListToID = function(_id, clist){
        for(var i =0; i < clist.length; i++)
        {        
            $(_id).append(clist[i]);
        }    
    
    };
    
    var SetContentInID = function(_id, content)
    {
        $(_id).html(content);
    };
    
    
    var HideAll = function(){
        HideWidgets(contentAreas);
    };
    
    var HidePages = function(){
        HideWidgets(pages);
    };

    
    var GetModel = function(){
      return this.model;
      };
    var SetModel = function(m){
        this.model=m;
      };      
      
      /*
    var ShowDashboard = function(m){
    
        var to_show = ["#Raum_Phone_Dashboard"];
        var to_hide = ["#Login_Landing_Page"];
        var apps =GetModel().GetApps();
        //  See if any of the apps in our model match the buttons
        
        var foundUber = false;
        var foundCamera = false;
        var foundTranslate = false;
        
        
        to_hide.push("#UberButton");
        to_hide.push("#TranslateButton");
        to_hide.push("#CameraButton");
        
        HideWidgets(to_hide);
        
        for(var i=0; i < apps.length; i++ )
        {    
            if(apps[i].GetName() == "uber")      foundUber = true;
            if(apps[i].GetName() == "translate") foundTranslate = true;
            if(apps[i].GetName() == "camera")    foundCamera = true; 
        }    
        
        if(foundUber)           to_show.push("#UberButton")        
        if(foundCamera)         to_show.push("#CameraButton")        
        if(foundTranslate)      to_show.push("#TranslateButton")        
        
        ShowWidgets(to_show);
        SetModel(m);        
    }*/
    


    return {      
    
      HideWidgets: HideWidgets,
      ShowWidgets: ShowWidgets,
      
      AppendContentListToID: AppendContentListToID,
      
      GetPlayerName: function(){
        //  here we would call the game database
        return "Raummy";
      },
      
      SetPlayerName: SetPlayerName,  
      
      SetContentInID: SetContentInID,    
      
      SetModel: SetModel,
      GetModel: GetModel,
      
      
      //    ContentMap will soon become the 'model' which holds the mappings, as well as content
      
      SetupBindings: function(ContentMap){        
      
        SetModel(new Model());
        
        HideAll();  
        $(pages[1]).hide();
        
                   
    
        $("#CameraButton").click(function(){
            console.log("CameraButtonWidget button clicked!"); 
            HideAll();             

            ShowWidgets([   ContentMap["#CameraButton"]   ]);      
            
            if(hasCameraLoaded==false)
            {
                
               var string1 = '<h2 class="section-heading">Future Home of the Camera app</h2>';
               var string2 = '<p class="lead">A special thanks to<a target="_blank" href="http://join.deathtothestockphoto.com/">Death to the Stock Photo</a>\
                      for providing the photographs that you see in this template. Visit their website to become a member.</p>';

                AppendContentListToID("#CameraContent", [string1, string2]);
                
                hasCameraLoaded = true;
            }
                  
        })
        
        $("#TranslateButton").click(function(){
            HideAll();
            ShowWidgets([   ContentMap["#TranslateButton"]  ]);                        
        });
        
        $("#UberButton").click(function(){
            HideAll();  
            ShowWidgets([   ContentMap["#UberButton"]   ]);           
            
        });
        
        $("#HomeButton").click(function(){
        //  TBD add more here
            HidePages();
            ShowWidgets([  $("#HomePage")  ]);
        });
        
        $("#StatsButton").click(function(){
        //  TBD add more here
            HidePages();
            ShowWidgets([   $("#StatsPage")  ]);

        });
    
    },
    
   // ShowDashboard: ShowDashboard,    
        
    };


};
