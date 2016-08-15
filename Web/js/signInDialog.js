var signInDialog = function()
{
  var _dc;
  var step1;
  var step2;
  var step3;
  var step4;
  var theUser;

  function buildStep1(){       
    var uname = $('<div>Username: <input id="user_name" type="input" value=""/></div>');
    var pword = $('<div>Password : <input id="user_pass" type="input" value=""/></div>');
    var cancel= $('<input id="cancel" type="submit" value="Cancel"/>').button();
    var ok    = $('<input id="authme" type="submit" value="Login.."/>').button();
    var txt1 = "First Time?";
    var no = $('<input id="nah" type="submit" value="Nope."/>').button();
    var yes= $('<input id="yessir" type="submit" value="You dont remember me..."/>').button(); 
    var _sc = $('<div></div>');
    _sc.append([
      $('<div></div>').append([
        uname,$("\n"),pword
      ]),
      $('<div></div>').append([
        cancel,ok,$("\n")
      ]),
      $('<div></div>').append([
        txt1,
        no,
        yes
      ])
    ]);
    return _sc;
  };
  

  function buildStep2(){
    var txt2 = "Tell us a bit about yourself!";
    var name = $('<div></div>');
    name.append('First: <input id="first_name" type="input" value=""/>');
    name.append('Last: <input id="last_name" type="input" value=""/>');
    var bday = $('<div></div>');
    bday.append('Year: <input id="bday_yr" type="input" value=""/>');
    bday.append('Month: <input id="bday_mo" type="input" value=""/>');
    bday.append('Day: <input id="bday_dy" type="input" value=""/>');
    var gend = $('<div></div>');
    gend.append('Gender: <input id="gender" type="input" value=""/>');
    var email = $('<div></div>');
    email.append('CUA Email: <input id="email" type="input" value=""/>');
    var choose = $('<div></div>');
    var canc = $('<input id="cancel2" type="submit" value="Cancel"/>').button();
    var next3= $('<input id="next_3" type="submit" value="Next ->"/>').button();  
    
    var _sc = $('<div></div>');
    _sc.append([
      txt2,
      name,
      bday,
      gend,
      email,
      choose.append([
        canc,
        next3
      ])
    ]);
    return _sc;
  };
 
    
  function buildStep3(){
    
    var txt3 = "Please upload your images";

    var categories = ["Vehicle: ", "Animal: ", "Scenery: ", "Grandmother: "];
//    var file1 = $('<input type="file" id="file_dom" name="files[]" multiple onchange="startRead()"/>');
    var file1 = $("#file1_dom");
    var file2 = $("#file2_dom");
    var file3 = $("#file3_dom");
    var file4 = $("#file4_dom");
    var choose = $('<div></div>');
    var canc = $('<input id="cancel3" type="submit" value="Cancel"/>').button();
    var next3= $('<input id="next_4" type="submit" value="Next ->"/>').button();  
    
    var _sc = $('<div></div>');
    _sc.append([
      txt3,
      $('<div></div>').append(["Vehicle: ", file1]),
      $('<div></div>').append(["Animal : ", file2]),
      $('<div></div>').append(["Scenery: ", file3]),
      $('<div></div>').append(["Grandma: ", file4]),
      choose.append([
        canc,
        next3
      ])
    ]);
    return _sc;
  };
  
  function buildStep4(){
    
    var txt4 = "Please verify your data.";

    var categories = ["Vehicle: ", "Animal: ", "Scenery: ", "Grandmother: "];
//    var file1 = $('<input type="file" id="file_dom" name="files[]" multiple onchange="startRead()"/>');

    var choose = $('<div></div>');
    var canc = $('<input id="cancel4" type="submit" value="Cancel"/>').button();
    var next3= $('<input id="finish_sid" type="submit" value="Next ->"/>').button();  
    
    var _sc = $('<div></div>');
    _sc.append([
      txt4,
      $('<div id="userDataSet"></div>'),
      choose.append([
        canc,
        next3
      ])
    ]);
    return _sc;
  };
  
  function getLoginData(){
    return {
      username: $("#user_name").val(),
      password: $("#user_pass").val()
    };
  };  
  
  function getStep1Data(){
    return {
      name: {first: $('#first_name').val(), last: $('#last_name').val()},
      birthday: {year: $('#bday_yr').val(), month: $('#bday_mo').val(), day: $('#bday_dy').val()},
      gender: $('#gender').val(),
      email: $('#email').val()
    };
  };
  
  function getStep2Data(){
    return {
      vehicleImage: {url: ""},
      animalImage : {url: ""},
      sceneryImage: {url: ""},
      grandmaImage: {url: ""}   
    };
  };
  
  return {
    init: function(selector, content){
      var theUser = new userProfile();
      step1 = buildStep1();      
      step2 = buildStep2();
      step3 = buildStep3();
      step4 = buildStep4();
      step1.show();
      step2.hide();
      step3.hide();
      step4.hide();
      $(selector).append([step1,step2,step3,step4]);
      
      
      $("#nah").click(function(){
          alert("YOURE A NEWB.");
      }); 
      $("#yessir").click(function(){
          alert("YOURE A RETURNING GUEST.");
      }); 
      //cancel login
      $("#cancel").click(function(){
          alert("you have opted out...");
           $(content).dialog('close');
      });
      // hit login..
      $("#authme").click(function(){
        
        alert("Verify your information...");
        step1.hide();
        step2.show();
        step3.hide();
        step4.hide();        
      });
      // cancel pii
      $("#cancel2").click(function(){
        alert("you have opted out...");
        step1.show();
        step2.hide();
        step3.hide();
        step4.hide();
      });
      // confirm pii
      $("#next_3").click(function(){
        step1.hide();
        step2.hide();
        step3.show();
        step4.hide();
        theUser.setUserData(getStep1Data());
        console.log(theUser.getData());
        $("#file1_dom").show();
        $("#file2_dom").show();
        $("#file3_dom").show();
        $("#file4_dom").show();
        
      }); 
      // cancel imageStuff
      $("#cancel3").click(function(){
        alert("you have opted out...");
        step1.hide();
        step2.show();
        step3.hide();
        step4.hide();
      });
      // confirm imageStuff
      $("#next_4").click(function(){
        step1.hide();
        step2.hide();
        step3.hide();
        step4.show();
        $("#userDataSet").html(theUser.getData());
      });
      // cancel verify
      $("#cancel4").click(function(){
        alert("you have opted out...");
        step1.hide();
        step2.hide();
        step3.show();
        step4.hide();
      });
      // confirm verify
      $("#finish_sid").click(function(){        
        alert("Thanks, you're all set.");
        step1.hide();
        step2.hide();
        step3.hide();
        step4.hide();
        $(content).dialog('close');
      });
      
      
    },
  };  
  
  

};
