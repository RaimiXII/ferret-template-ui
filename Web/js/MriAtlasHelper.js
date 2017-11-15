var MriAtlasHelper = function(){

    var bh;    
    var modal_projects;
    var grid_projects;
    var members;
    var bindings;
    
    var Init = function()
    {
        bh = BootstrapHelper();
        modal_projects = {};
        grid_projects = {};
        members = {};
        this.bindings = {};
        
        
        
    };
    
    var BindAction = function(div, txt)
    {
        $(div).click(function(event){            
                console.log(""+txt);   
                
                $("#landingContent").hide();
                
                $("#projectContent").html()                
                $("#projectContent").append([
                    bh.Div({'class':"row"}).append([
                        bh.IFrame({'class': "col-lg-12 col-md-12 col-sm-12", 'src': txt, 'width':"100w", 'height':"100vh",'frameborder':"0"})
                    ])
                ]);
                $("#projectContent").show();
                //$("#mhead").hide();
        });
    };    
    
    var SetupBindings = function()
    {
        var ks = Object.keys(this.bindings);
        for(var i=0; i < ks.length; i++){
            this.BindAction(ks[i], this.bindings[ks[i]]);           
        }  
    };
    
    var SetupHandlers = function()
    {
        $("#homeButton").click(function(event){
            $("#projectContent").hide();
            $("#projectContent").empty();
            $("#landingContent").show();
        });
        
        $("#start_exploring").click(function(event){
            $("#projectContent").hide();
            $("#projectContent").empty();
            $("#landingContent").show();
        });

       $("#projectContent").hide();
    };
    
    var Generate = function()
    {
        //  build header
        this.BuildHeader();
        
        //  build navbar
        this.BuildNavBar();
        
        //  build services
        //this.BuildServicesSection();
        
        //  build projects
        this.BuildAllProjects();   
        
        //  build team members
        this.BuildAllTeamMembers();            
        
        //  build contact
        this.BuildContactSection();
        
        //  build footer
        this.BuildFooter();

        //  setup bindings
       this.SetupBindings();
       
       //   setup handler
       this.SetupHandlers();

    };
    
    
    var AddProject = function(info)
    {
        var g_div = info['grid_div'];
        var m_div = info['modal_div'];
        var page_url = info['project_url'];
        var name = info['name'];
        var img_full = info['image'];
        var img_thumb= info['thumbnail'];
        var species = info['species'];
        var mods = info['modalities'];
        var maps = info['maps'];
        var short_desc = info['description_short'];
        var long_desc = info['description_long'];
        var cite = info['citation'];
        
        modal_projects[m_div] = [            
            bh.Div({'class':"modal-dialog"}).append([
                bh.Div({'class':"modal-content"}).append([
                    bh.Div({'class':"close-modal",'data-dismiss':"modal"}).append([
                        bh.Div({'class':"lr"}).append([
                            bh.Div({'class':"rl"})
                        ])
                    ]),
                    bh.Div({'class':"container"}).append([
                        bh.Div({'class':"row"}).append([
                            bh.Div({'class':"col-lg-8 mx-auto"}).append([
                                bh.Div({'class':"modal-body"}).append([
                                    bh.Header({'order':"2",'class':"text-uppercase",'text':name}),
                                    bh.Paragraph({'class':"item-intro text-muted",'text':short_desc}),
                                    bh.Image({'class':"img-fluid d-block mx-auto",'src':img_full,'alt':""}),
                                    bh.Paragraph({'text':long_desc}),
                                    bh.UnorderedList({'class':"list-inline"}).append([
                                        bh.ListItem({'text':"Species: "+species}),
                                        bh.ListItem({'text':"Modalities: "+mods.join(", ")}),
                                        bh.ListItem({'text':"Maps: "+maps.join(", ")}),
                                    ]),
                                    bh.Paragraph({'text':"Based on the work :"}),
                                    bh.Paragraph({'class':"text-muted",'text':cite}),                                   

                                        bh.Button({'class':"btn btn-primary",'data-dismiss':"modal",'type':"button",'text':"Explore",'id': g_div.split('#')[1]+"_explore"}).append([
                                            bh.Icon({'class':"fa fa-play"})
                                        ]),

                                    bh.Header({'order':'5','text':"  "}),
                                     bh.Button({'class':"btn btn-primary",'data-dismiss':"modal",'type':"button",'text':"Go Back"}).append([
                                        bh.Icon({'class':"fa fa-times"})
                                    ]),
                                ])
                            ])
                        ])
                    ])
                ])
            ])
        ];
        grid_projects[g_div] = [
            bh.Div({'class':"portfolio-link",'data-toggle':"modal",'href': m_div}).append([
                bh.Div({'class':"portfolio-hover"}).append([
                    bh.Div({'class':"portfolio-hover-content"}).append([
                        bh.Icon({'class':"fa fa-plus fa-3x"})
                    ])
                ]),
                bh.Image({'class':"img-fluid",'src':img_thumb,'alt':""})
            ]),                    
            bh.Div({'class':"portfolio-caption"}).append([
                bh.Header({'order':"4",'text':name}),
                bh.Paragraph({'class':"text-muted",'text':short_desc})
            ])
        ];
        
        
        
        this.bindings[g_div+"_explore"] = [(page_url)];
        
    };
    
    var AddTeamMember = function(info)
    {
        var m_div= info['div'];
        var name = info['name'];
        var img  = info['image'];
        var desc = info['description'];
        var site = info['website'];

        members[m_div] = [
            bh.Div({'class':"team-member"}).append([
                bh.Image({'class':"mx-auto rounded-circle",'src':img,'alt':""}),
                bh.Header({'order':"4",'text':name}),
                bh.Paragraph({'class':"text-muted",'text':desc}),
                bh.Anchor({'class':"btn btn-primary",'href':site,'text':"Website"}),
            ])
        ];
    };
    
    
    var BuildAllProjects = function()
    {
        var ks = Object.keys(modal_projects);
        for(var i=0; i < ks.length; i++){
            $(ks[i]).append(modal_projects[ks[i]]);   
        }        
        var ks2 = Object.keys(grid_projects);
        for(var i=0; i< ks2.length; i++){
            $(ks2[i]).append(grid_projects[ks2[i]]);
        }         
        
        
        
    };
    
    var BuildAllTeamMembers = function()
    {
        var ks = Object.keys(members);
        for(var i=0; i < ks.length; i++){
            $(ks[i]).append(members[ks[i]]);            
        }
    };
    
    var BuildAboutSection = function()
    {    
        $("#about").append([
            bh.Div({'class':"container"}).append([
                bh.Div({'class':"row"}).append([
                    bh.Div({'class':"col-lg-12 text-center"}).append([
                        bh.Header({'order':"2",'class':"section-heading text-uppercase",'text':"About"}),
                        bh.Header({'order':"3",'class':"section-subheading text-muted",'text':"Lorem ipsum dolor sit amet consectetur."})
                    ]),
                ]),
                bh.Div({'class':"row"}).append([
                    bh.Div({'class':"col-lg-12"}).append([
                        bh.UnorderedList({'class':"timeline"}).append([
                            bh.ListItem({}).append([
                                bh.Div({'class':"timeline-image"}).append([
                                    $('<img class="rounded-circle img-fluid" src="img/about/1.jpg" alt="">')
                                ]),
                                bh.Div({'class':"timeline-panel"}).append([
                                    bh.Div({'class':"timeline-heading"}).append([
                                        bh.Header({'order':"4",'text':"2009-2011"}),
                                        bh.Header({'order':"4",'class':"subheading",'text':"Our Humble Beginnings"})
                                    ]),
                                    bh.Div({'class':"timeline-body"}).append([
                                        bh.Paragraph({'class':"text-muted",'text':"Lorem ipsum dolor sit amet, consectetur adipisicing elit."})
                                    ])
                                ])
                            ]),
                            bh.ListItem({'class':"timeline-inverted"}).append([
                                bh.Div({'class':"timeline-image"}).append([
                                    $('<img class="rounded-circle img-fluid" src="img/about/2.jpg" alt="">')
                                ]),
                                bh.Div({'class':"timeline-panel"}).append([
                                    bh.Div({'class':"timeline-heading"}).append([
                                        bh.Header({'order':"4",'text':"March 2011"}),
                                        bh.Header({'order':"4",'class':"subheading",'text':"An agency is born"}),
                                    ]),
                                    bh.Div({'class':"timeline-body"}).append([
                                        bh.Paragraph({'class':"text-muted",'text':"Lorem ipsum dolor sit amet, consectetur adipisicing elit. !"})
                                    ])
                                ])
                            ]),
                            bh.ListItem({}).append([
                                bh.Div({'class':"timeline-image"}).append([
                                    $('<img class="rounded-circle img-fluid" src="img/about/3.jpg" alt="">')
                                ]),
                                bh.Div({'class':"timeline-panel"}).append([
                                    bh.Div({'class':"timeline-heading"}).append([
                                        bh.Header({'order':"4",'text':"December 2012"}),
                                        bh.Header({'order':"4",'class':"subheading",'text':"Transition to Full Service"})
                                    ]),
                                    bh.Div({'class':"timeline-body"}).append([
                                        bh.Paragraph({'class':"text-muted",'text':"Lorem ipsum dolor sit amet, consectetur adipisicing elit."})
                                    ])
                                ])
                            ]),
                            $('<li class="timeline-inverted"></li>').append([
                                bh.Div({'class':"timeline-image"}).append([
                                    $('<img class="rounded-circle img-fluid" src="img/about/4.jpg" alt="">')
                                ]),
                                bh.Div({'class':"timeline-panel"}).append([
                                    bh.Div({'class':"timeline-heading"}).append([
                                        bh.Header({'order':"4",'text':"July 2014"}),
                                        bh.Header({'order':"4",'class':"subheading",'text':"Phase two expansion"})
                                    ]),
                                    bh.Div({'class':"timeline-body"}).append([
                                        bh.Paragraph({'class':"text-muted",'text':"Lorem ipsum dolor sit amet, consectetur adipisicing elit. !"})
                                    ])
                                ])
                            ]),
                        ])
                    ])
                ])
            ])
        ]);
    };
    
    var BuildServicesSection = function()
    {
        $("#services").append([
            bh.Div({'class':"container"}).append([
                bh.Div({'class':"row"}).append([
                    bh.Div({'class':"col-lg-12 text-center"}).append([
                        bh.Header({'order':"2",'class':"section-heading text-uppercase",'text':"Services"}),
                        bh.Header({'order':"3",'class':"section-subheading text-muted",'text':"Lorem ipsum dolor sit amet consectetur."}),
                    ])
                ]),
                bh.Div({'class':"row text-center"}).append([
                    bh.Div({'class':"col-md-4"}).append([
                        bh.Span({'class':"fa-stack fa-4x"}).append([
                            bh.Icon({'class':"fa fa-circle fa-stack-2x text-primary"}),
                            bh.Icon({'class':"fa fa-shopping-cart fa-stack-1x fa-inverse"})
                        ]),
                        bh.Header({'order':"4",'class':"service-heading",'text':"E-Commerce"}),
                        bh.Paragraph({'class':"text-muted",'text':"Lorem ipsum dolor sit amet, consectetur adipisicing elit"})                    
                    ]),                    
                    bh.Div({'class':"col-md-4"}).append([
                        bh.Span({'class':"fa-stack fa-4x"}).append([
                            bh.Icon({'class':"fa fa-circle fa-stack-2x text-primary"}),
                            bh.Icon({'class':"fa fa-laptop fa-stack-1x fa-inverse"})
                        ]),
                        bh.Header({'order':"4",'class':"service-heading",'text':"Responsive Design"}),
                        bh.Paragraph({'class':"text-muted",'text':"Lorem ipsum dolor sit amet, consectetur adipisicing elit"})                    
                    ]),
                    bh.Div({'class':"col-md-4"}).append([
                        bh.Span({'class':"fa-stack fa-4x"}).append([
                            bh.Icon({'class':"fa fa-circle fa-stack-2x text-primary"}),
                            bh.Icon({'class':"fa fa-lock fa-stack-1x fa-inverse"})
                        ]),
                        bh.Header({'order':"4",'class':"service-heading",'text':"Web Security"}),
                        bh.Paragraph({'class':"text-muted",'text':"Lorem ipsum dolor sit amet, consectetur adipisicing elit."})
                    ])
                ]),
            ])
        ]);
    };
    
    var BuildContactSection = function()
    {
        $("#contact").append([
            bh.Div({'class':"container"}).append([
                bh.Div({'class':"row"}).append([
                    bh.Div({'class':"col-lg-12 text-center"}).append([
                        bh.Header({'order':"2",'class':"section-heading text-uppercase",'text':"Contact Us"}),
                        bh.Header({'order':"3",'class':"section-subheading text-muted",'text':"If want to contribute to this site and you are an expert, let's get to know each other!  Fill out the fields below to get the conversation started."})
                    ])
                ]),
                bh.Div({'class':"row"}).append([
                    bh.Div({'class':"col-lg-12"}).append([
                        bh.Form({'id':"contactForm",'name':"sentMessage"}).append([
                            bh.Div({'class':"row"}).append([
                                bh.Div({'class':"col-md-6"}).append([
                                    bh.Div({'class':"form-group"}).append([
                                        bh.Input({'class':"form-control",'id':"name",'type':"text",'placeholder':"Your Name *",'data-validation-required-message':"Please enter your name.",'extra':"required"}),
                                        bh.Paragraph({'class':"help-block text-danger"})
                                    ]),
                                    bh.Div({'class':"form-group"}).append([
                                        bh.Input({'class':"form-control",'id':"email",'type':"email",'placeholder':"Your Email *",'data-validation-required-message':"Please enter your email.",'extra':"required"}),
                                        bh.Paragraph({'class':"help-block text-danger"})
                                    ]),
                                    bh.Div({'class':"form-group"}).append([
                                        bh.Input({'class':"form-control",'id':"institution",'type':"institution",'placeholder':"Your Institution *",'data-validation-required-message':"Please enter your institution.",'extra':"required"}),
                                        bh.Paragraph({'class':"help-block text-danger"})
                                    ]),
                                ]),
                                bh.Div({'class':"col-md-6"}).append([
                                    bh.Div({'class':"form-group"}).append([
                                        bh.Input({'class':"form-control",'id':"message",'type':"message",'placeholder':"Your Message *",'data-validation-required-message':"Please enter a message.",'extra':"required"}),
                                        bh.Paragraph({'class':"help-block text-danger"})
                                    ]),
                                ]),
                                bh.Div({'class':"clearfix"}),
                                bh.Div({'class':"col-lg-12 text-center"}).append([
                                    bh.Div({'id':"success"}),
                                    bh.Button({'id':"sendMessageButton",'class':"btn btn-primary btn-xl text-uppercase",'type':"submit",'text':"Send Message"})
                                ])
                            ])
                        ])
                    ])
                ])
            ])    
        ]); 
    };
    
    var BuildHeader = function()
    {
        $("#mhead").append([
            bh.Div({'class':"intro-text"}).append([
                bh.Div({'class':"intro-heading text-uppercase", 'text':"MRI Atlases"}), 
                bh.Div({'class':"intro-lead-in",'text':"An online MRI viewer"}),      
                bh.Header({'order':"2",'text':"<br>"}),
                bh.Anchor({'class':"btn btn-primary btn-xl text-uppercase js-scroll-trigger",'href':"#portfolio",'text':"Start Exploring",'id':"start_exploring"})
            ])
        ]);     
    };
    
    var BuildNavBar = function()
    {
        $("#mainNav").append([
            bh.Div({'class':"container"}).append([
                bh.Anchor({'class':"navbar-brand js-scroll-trigger", 'href':"#page-top",'text':"Home",'id':"homeButton"}),
                bh.Button({'class':"navbar-toggler navbar-toggler-right", 'type':"button", 'data-toggle':"collapse", 'data-target':"#navbarResponsive", 'aria-controls':"navbarResponsive", 'aria-expanded':"false", 'aria-label':"Toggle navigation"}).append([
                    $('Menu'),
                    bh.Icon({'class':"fa fa-bars"}),
                ]),
                bh.Div({'class':"collapse navbar-collapse", 'id':"navbarResponsive"}).append([
                    bh.UnorderedList({'class':"navbar-nav text-uppercase ml-auto"}).append([
                        /*
                        bh.ListItem({'class':"nav-item"}).append([
                            bh.Anchor({'class':"nav-link js-scroll-trigger",'href':"#services",'text':"Services"})
                        ]),
                        */
                        bh.ListItem({'class':"nav-item"}).append([
                            bh.Anchor({'class':"nav-link js-scroll-trigger",'href':"#portfolio",'text':"Projects"})
                        ]),
                        /*
                        bh.ListItem({'class':"nav-item"}).append([
                            bh.Anchor({'class':"nav-link js-scroll-trigger",'href':"#about",'text':"About"})
                        ]),
                        */
                        bh.ListItem({'class':"nav-item"}).append([
                            bh.Anchor({'class':"nav-link js-scroll-trigger",'href':"#team",'text':"Team"})
                        ]),
                        bh.ListItem({'class':"nav-item"}).append([
                            bh.Anchor({'class':"nav-link js-scroll-trigger",'href':"#contact",'text':"Contact"})
                        ]),
                    ])
                ])                    
            ])            
        ]);
    };
    
    var BuildFooter = function()
    {
    
        $("#d_footer").append([
            bh.Div({'class':"container"}).append([
                bh.Div({'class':"row"}).append([
                    bh.Div({'class':"col-md-4"}).append([
                        bh.Span({'class':"copyright",'text':"Copyright &copy; NIH - NIBIB - QMI, 2017"})
                    ]),
                    bh.Div({'class':"col-md-4",'id':"socialtest"}),
                    bh.Div({'class':"col-md-4"}).append([
                        bh.UnorderedList({'class':"list-inline quicklinks"}).append([
                            bh.ListItem({'class':"list-inline-item"}).append([
                                bh.Anchor({'href':"https://www.nibib.nih.gov/policies#privacy",'text':"Privacy Policy"})
                            ]),
                            bh.ListItem({'class':"list-inline-item"}).append([
                                bh.Anchor({'href':"#",'text':"Terms of Use"})
                            ])
                        ])
                    ])
                ])
            ])            
        ]);
    };


    return {
        Init:Init,
        Generate:Generate,
        BindAction:BindAction,
        SetupBindings:SetupBindings,
        SetupHandlers:SetupHandlers,
        AddProject:AddProject,
        AddTeamMember:AddTeamMember,
        BuildAllProjects:BuildAllProjects,
        BuildAllTeamMembers:BuildAllTeamMembers,        
        BuildAboutSection:BuildAboutSection,
        BuildHeader:BuildHeader,
        BuildNavBar:BuildNavBar,
        BuildContactSection:BuildContactSection,
        BuildServicesSection:BuildServicesSection,
        BuildFooter:BuildFooter,    
    };

};
