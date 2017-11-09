var BootstrapHelper = function(){
    
    var FormatArgStr = function(params){
        var ks = Object.keys(params); var argstr = '<';
        var _tag = params['tag'];
        argstr = argstr + _tag;
        var _txt = '';
        var _xtra= '';
        for(var i=0; i < ks.length; i++){
            if(ks[i] == 'tag'){}
            //else if(ks[i] == 'type'){}
            else{
                if(ks[i]=='text'){_txt = params['text'];}
                if(ks[i]=='extra'){_xtra=params['extra'];}
                else{argstr = argstr+' '+(ks[i] + '="' + params[ks[i]])+'"';}
            }            
        }       
        return argstr + '>' + _txt + ' ' + _xtra + '</'+_tag+'>';
    };    
    
    var Anchor = function(params){
        params['tag'] = "a";
        return $(FormatArgStr(params));
    };
    
    var Button = function(params){
        params['tag'] = "button";
        return $(FormatArgStr(params));
    };

    var Div = function(params){
        params['tag'] = "div";
        return $(FormatArgStr(params));
    };
    
    var Form = function(params){
        params['tag'] = "form";
        return $(FormatArgStr(params));
    }

    var Header = function(params){
        params['tag']  ="h"+params['order'];
        return $(FormatArgStr(params));
    };
    
    var Image = function(params){
        params['tag'] = "img";
        return $(FormatArgStr(params));
    };
    
    var Input = function(params){
        params['tag'] = "input";
        return $(FormatArgStr(params));
    }
    
    var Icon = function(params){
        params['tag'] = "i";
        return $(FormatArgStr(params));
    };    
    
    var ListItem = function(params){
        params['tag'] = "li";
        return $(FormatArgStr(params));
    };
    
    var Paragraph = function(params){
        params['tag'] = "p";
        return $(FormatArgStr(params));
    };
    
    var Span = function(params){
        params['tag'] = "span";
        return $(FormatArgStr(params));
    }
    
    var UnorderedList = function(params){
        params['tag'] = "ul";
        return $(FormatArgStr(params));
    };
    

    return {
        Anchor:Anchor,
        Button:Button,
        Div:Div,
        Form:Form,
        Header:Header,
        Icon:Icon,
        Image:Image,
        Input:Input,
        ListItem:ListItem,
        Paragraph:Paragraph,
        Span:Span,
        UnorderedList:UnorderedList,
        
    };



};
