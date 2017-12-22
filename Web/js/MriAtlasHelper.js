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
                $("#landingContent").hide();
                $("#projectContent").html()                
                $("#projectContent").append([
                    bh.Div({'class':"row"}).append([
                        bh.IFrame({'class': "col-lg-12 col-md-12 col-sm-12", 'src': txt, 'width':"100w", 'height':"100vh",'frameborder':"0",'aria-tag':"This is an embedded portion of the page which links to content related to projects in NIH NIBIB QMI."})
                    ])
                ]);
                $("#projectContent").show();
                $("#bgImage").hide();
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
            $("#bgImage").show();
             $("#mainNav").addClass("navbar-shrink")
        });        
        $("#start_exploring").click(function(event){
            $("#projectContent").hide();
            $("#projectContent").empty();
            $("#landingContent").show();
            $("#bgImage").show();
            $("#mainNav").addClass("navbar-shrink")
        });
       $("#projectContent").hide();
       
       $("#sendMessageButton").click(function(event){
       
                var full_name = $("#name").val();
                
                if(full_name.split(" ").length != 2)
                {
                    alert("Please enter your first and last name seperated by a space")
                }
                else
                {
                
                    var fn = $("#name").val().split(" ")[0];
                    var ln = $("#name").val().split(" ")[1];
                    var em = $("#email").val();
                    var ins = $("#institution").val();
                    var msg = $("#message").val();
                    
                    console.log('first name -> ' + fn);
                    console.log('last name -> ' + ln);
                    console.log('email -> ' + em);
                    console.log('institution -> ' + ins);
                    console.log('message -> ' + msg);
                    
                    var data_to_send = {
                        first_name: fn,
                        last_name: ln,
                        email: em,
                        institution: ins,
                        message: msg
                    };
                    console.log(JSON.stringify(data_to_send));
                    
                    $.ajax({
                    type: "POST",
                    url: "../ferret-project/Web/mail/index.php",
                    dataType: 'text',
                    data: data_to_send,
                    success: function(data){
                        alert("Thanks for your input!  We will get back to you shortly.");
                    }
                });
                
                alert("Thanks for your input!  We will get back to you shortly.");
            }
        });
    };
    
    var Generate = function()
    {
        //  build header
        this.BuildHeader();        
        //  build navbar
        this.BuildNavBar();        
        //  build about
        this.BuildAboutSection();        
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
        var active = info['active'];
        
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
                                    
                                    bh.Div({'class':"btn-group"}).append([ 
                                        bh.Button({'class':"btn btn-warning",'data-dismiss':"modal",'type':"button",'text':"Close"}).append([
                                            bh.Icon({'class':"fa fa-times"})
                                        ]),
                                        bh.Paragraph({'text':"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"}),
                                        bh.Button({'class':"btn btn-primary",'data-dismiss':"modal",'type':"button",'text':"Explore",'id': g_div.split('#')[1]+"_explore"}).append([
                                            bh.Icon({'class':"fa fa-play"})
                                        ]),
                                    ])
                                ])
                            ])
                        ])
                    ])
                ])
            ])
        ];
        // disable hover and click for under construction projects
        var active_content;
        if(active=="true")
        {
            active_content = bh.Div({'class':"portfolio-hover"}).append([
                    bh.Div({'class':"portfolio-hover-content"}).append([
                        bh.Icon({'class':"fa fa-plus fa-3x"})
                    ])
                ]);            
        }
        else
        {
            active_content = bh.Div({});
        }
        
        grid_projects[g_div] = [
            bh.Div({'class':"portfolio-link",'data-toggle':"modal",'href': m_div}).append([
                active_content,
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
                bh.Anchor({'class':"btn btn-primary btn-lg",'href':site,'text':"Website"}),
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
                        bh.Header({'order':"3",'class':"section-subheading text-muted",'text':"The goal of this website is to offer to interested individuals the possibility of inspecting the average anatomical templates that we have created for various projects.  We extend an invitation to <i>you</i> to contribute and collaborate with us to further this site."}),
                        bh.Anchor({'class':"btn btn-primary btn-lg",'href':"https://www.nibib.nih.gov/labs-at-nibib/quantitative-medical-imaging",'text':"Visit Us!"}),
                        bh.Header({'order':"3",'class':"section-subheading text-muted",'text':"."}),
                    ]),
                ]),
                bh.Div({'class':"row"}).append([
                    bh.Div({'class':"col-lg-12"}).append([
                        bh.UnorderedList({'class':"timeline"}).append([
                            bh.ListItem({}).append([
                                bh.Div({'class':"timeline-image"}).append([
                                    $('<img class="rounded-circle img-fluid" src="img/about/nih_1.jpg" alt="NIBIB Logo">')
                                ]),
                                bh.Div({'class':"timeline-panel"}).append([
                                    bh.Div({'class':"timeline-heading"}).append([
                                        bh.Header({'order':"4",'text':"MRI Atlases"}),
                                        bh.Header({'order':"4",'class':"subheading",'text':"Who we are"})
                                    ]),
                                    bh.Div({'class':"timeline-body"}).append([
                                        bh.Paragraph({'class':"text-muted",'text':"This website is developed and maintained by the Quantitative Medical Imaging (QMI) lab at the National Institute of Biomedical Imaging and Bioengineering, NIH."})
                                    ])
                                ])
                            ]),
                            bh.ListItem({'class':"timeline-inverted"}).append([
                                bh.Div({'class':"timeline-image"}).append([
                                    $('<img class="rounded-circle img-fluid" src="img/about/nih_2.jpg" alt="Patient receiving MRI Brain Scan">')
                                ]),
                                bh.Div({'class':"timeline-panel"}).append([
                                    bh.Div({'class':"timeline-heading"}).append([
                                        bh.Header({'order':"4",'text':"Mission"}),
                                        bh.Header({'order':"4",'class':"subheading",'text':"Why we do it"}),
                                    ]),
                                    bh.Div({'class':"timeline-body"}).append([
                                        bh.Paragraph({'class':"text-muted",'text':"We are a group of scientists who develop methods for processing and analyzing magnetic resonance images (mostly of the brain)."})
                                    ])
                                ])
                            ]),
                            bh.ListItem({}).append([
                                bh.Div({'class':"timeline-image"}).append([
                                    $('<img class="rounded-circle img-fluid" src="img/about/nih_3.jpg" alt="MRI Brain Scan image">')
                                ]),
                                bh.Div({'class':"timeline-panel"}).append([
                                    bh.Div({'class':"timeline-heading"}).append([
                                        bh.Header({'order':"4",'text':"Methods"}),
                                        bh.Header({'order':"4",'class':"subheading",'text':"How it's done"})
                                    ]),
                                    bh.Div({'class':"timeline-body"}).append([
                                        bh.Paragraph({'class':"text-muted",'text':"We have developed tools <a href='https://science.nichd.nih.gov/confluence/display/nihpd/Home'>(check out TORTOISE!)</a> to morph individual brains into an average brain representation of the population, as well as tools to extract an average brain from a series of individual brains."})
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
                        bh.Header({'order':"3",'class':"section-subheading text-muted",'text':"If you are a researcher in the field of a particular atlas and want to contribute to this site we would like to hear from you!  Fill out the fields below to get the conversation started."})
                    ])
                ]),
                bh.Div({'class':"row"}).append([
                    bh.Div({'class':"col-lg-12"}).append([
                        bh.Form({'id':"contactForm",'name':"sentMessage"}).append([
                            bh.Div({'class':"row"}).append([
                                bh.Div({'class':"col-md-6",'id':"lhs_contact"}).append([
                                    bh.Div({'class':"form-group"}).append([
                                        bh.Input({'class':"form-control",'id':"name",'type':"text",'placeholder':"Your Name *",'data-validation-required-message':"Please enter your name."}),
                                        bh.Paragraph({'class':"help-block text-danger",'text':"required"})
                                    ]),
                                    bh.Div({'class':"form-group"}).append([
                                        bh.Input({'class':"form-control",'id':"email",'type':"email",'placeholder':"Your Email *",'data-validation-required-message':"Please enter your email."}),
                                        bh.Paragraph({'class':"help-block text-danger",'text':"required"})
                                    ]),
                                    bh.Div({'class':"form-group"}).append([
									    bh.Input({'class':"form-control",'id':"institution",'type':"institution",'placeholder':"Your Institution *",'data-validation-required-message':"Please enter your institution."}),
									    bh.Paragraph({'class':"help-block text-danger",'text':"required"})
								    ]),                                    
                                ]),
                                bh.Div({'class':"col-md-6"}).append([
                                    bh.Div({'class':"form-group"}).append([
                                        bh.TextWindow({'class':"form-control", 'rows':"8", 'cols':"40",'id':"message",'type':"message",'placeholder':"Your Message *",'data-validation-required-message':"Please enter a message."}),
                                        bh.Paragraph({'class':"help-block text-danger",'text':"required"})
                                    ]),								
                                ]),
                                bh.Div({'class':"clearfix"}),
                                bh.Div({'class':"col-lg-12 text-center"}).append([
                                    bh.Div({'id':"success"}),
                                    bh.Button({'id':"sendMessageButton",'class':"btn btn-primary btn-xl text-uppercase", 'text':"Send Message"})
                                ])
                            ])
                        ])
                    ])
                ])
            ])    
        ]); 
        $("#name").val("");
        $("#email").val("");
        $("#institution").val("");
        $("#message").val("");             
          
    };
    
    var BuildHeader = function()
    {
        $("#mhead").append([
            bh.Div({'class':"intro-text",'id':"bgImage"}).append([
                bh.Div({'class':"intro-heading text-uppercase", 'text':"MRI Atlases"}), 
                bh.Div({'class':"intro-lead-in",'text':"An interactive repository of anatomical templates obtained from quantitative MRI data"}),      
                bh.Header({'order':"2",'text':"<br>"}),
                bh.Anchor({'class':"btn btn-primary btn-xl text-uppercase js-scroll-trigger",'href':"#portfolio",'text':"Start Exploring",'id':"start_exploring"})
            ])
        ]);     
    };
    
    var BuildNavBar = function()
    {
        $("#mainNav").append([
            bh.Div({'class':"container"}).append([
                bh.Anchor({'class':"navbar-brand js-scroll-trigger", 'href':"https://www.nibib.nih.gov", 'target':"_blank"}).append([
                    bh.Image({'src':"img/logos/nibib_logo_wide_white.png",'height':"45vh",'alt':"National Institute of Biomedical Imaging and Bioengineering"})
                ]),
                bh.Div({'class':"collapse navbar-collapse", 'id':"navbarResponsive"}).append([
                    bh.UnorderedList({'class':"navbar-nav text-uppercase ml-auto"}).append([
                        bh.ListItem({'class':"nav-item"}).append([
                            bh.Anchor({'class':"nav-link js-scroll-trigger",'id':"homeButton", 'href':"#page-top",'text':"Home"})
                        ]),
                        bh.ListItem({'class':"nav-item"}).append([
                            bh.Anchor({'class':"nav-link js-scroll-trigger",'href':"#about",'text':"About"})
                        ]),
                        bh.ListItem({'class':"nav-item"}).append([
                            bh.Anchor({'class':"nav-link js-scroll-trigger",'href':"#portfolio",'text':"Projects"})
                        ]),                        
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
                bh.Div({'class':"row", 'style':"margin :5px 0;"}).append([
                    bh.Div({'class':"col-md-4"}).append([
                        bh.Span({'class':"copyright",'text':"Developed by NIH - NIBIB - QMI, 2017"})
                    ]),
                    bh.Div({'class':"col-md-8"}).append([
                        bh.UnorderedList({'class':"list-inline quicklinks"}).append([
                            bh.ListItem({'class':"list-inline-item"}).append([
                                bh.Anchor({'href':"https://www.nibib.nih.gov/policies#privacy",'text':"Privacy Policy", 'target' : "_blank", 'style':"margin :5px 10px;"})
                            ]),
							bh.ListItem({'class':"list-inline-item"}).append([
                                bh.Anchor({'href':"https://www.nibib.nih.gov/accessibility",'text':"Accessibility", 'target' : "_blank", 'style':"margin :5px 10px;"})
                            ]),
							bh.ListItem({'class':"list-inline-item"}).append([
                                bh.Anchor({'href':"https://www.nibib.nih.gov/foia",'text':"FOIA", 'target' : "_blank", 'style':"margin :5px 10px;"})
                            ]),
                            bh.ListItem({'class':"list-inline-item"}).append([
                                bh.Anchor({'href':"https://www.nibib.nih.gov/disclaimer",'text':"Terms of Use", 'target' : "_blank", 'style':"margin :5px 10px;"})
                            ])
                        ])
                    ])
                ]),
				bh.Div({'class':"row"}).append([
					bh.Div({'class':"col-md-12", 'style':"margin :10px 0;"}).append([
                        bh.UnorderedList({'class':"list-inline quicklinks"}).append([
                            bh.ListItem({'class':"list-inline-item"}).append([
                                bh.Anchor({'href':"http://www.hhs.gov/",'text':"Department of Health and Human Services", 'target' : "_blank", 'style':"margin :5px 10px;"})
                            ]),
							bh.ListItem({'class':"list-inline-item"}).append([
                                bh.Anchor({'href':"http://www.usa.gov/",'text':"USA.gov", 'target' : "_blank", 'style':"margin :5px 10px;"})
                            ]),
							bh.ListItem({'class':"list-inline-item"}).append([
                                bh.Anchor({'href':"http://www.nih.gov/",'text':"National Institutes of Health", 'target' : "_blank", 'style':"margin :5px 10px;"})
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
