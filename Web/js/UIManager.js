// UI Manager

var UIManager = function()
{
  return {  
    hideDivs : function(divs) {
      for(var i in divs){
        $(divs[i]).hide();
      }
    },    
    showDivs : function(divs) {
      for(var i in divs){
        $(divs[i]).show();
      }
    },    
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
    }
  };

};
