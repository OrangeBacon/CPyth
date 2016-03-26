//Main Javascript file
"use strict";
//==============================
//== User Interface Functions ==
//==============================
function ui(){
  //init vars
  this.menuSettingsOpacity = 0;
  this.menuAboutOpacity = 0;
  this.footHeight = 2;
  this.footOpacity = 1;
  this.div;
  this.outDoc;
  this.elements;
  this.nav = document.getElementById("nav").offsetHeight;
  this.bottom = document.getElementById("foot").offsetHeight;
  this.doc = window.innerHeight;
  this.windows = [];
  this.window;
  this.windowTemplate = '<div class="window-container" id="<id>"><div class="window"><div class="window-header"><div class="window-header-close" data-id="<id>" id="window-header-close-<id>"><p class="window-header-close-text" onclick="ui.closeWindow(event)">X</p></div><div class="window-header-dock"><p class="window-header-dock-text">X</p></div><p class="window-header-title"><title></p></div><content></div></div>'
  //external reference
  ui = this;
  //open settings menu
  this.menuSettings = function(){
    if(this.menuAboutOpacity === 1){
      this.menuAbout();
    };
    this.menuSettingsOpacity = 1 - this.menuSettingsOpacity;
    if(this.menuSettingsOpacity === 1){
      TweenLite.to(document.getElementById("nav-menu-settings"),0.4,{visibility:"visible"});
    };
    TweenLite.to(document.getElementById("nav-menu-settings"),0.4,{opacity:this.menuSettingsOpacity});
    if(this.menuSettingsOpacity === 0){
      TweenLite.to(document.getElementById("nav-menu-settings"),0.4,{visibility:"hidden",delay:0.4});
    };
  };
  //open about menu
  this.menuAbout = function(){
    if(this.menuSettingsOpacity === 1){
      this.menuSettings();
    };
    this.menuAboutOpacity = 1 - this.menuAboutOpacity;
    if(this.menuAboutOpacity === 1){
      TweenLite.to(document.getElementById("nav-menu-about"),0.4,{visibility:"visible"});
    };
    TweenLite.to(document.getElementById("nav-menu-about"),0.4,{opacity:this.menuAboutOpacity});
    if(this.menuAboutOpacity === 0){
      TweenLite.to(document.getElementById("nav-menu-about"),0.4,{visibility:"hidden",delay:0.4});
    };
  };
  //expand the footer
  this.footExpand = function() {
    if (this.footHeight === 2) {
      this.footHeight = 5;
      document.getElementById("foot-expand").innerHTML = "Collapse Footer";
    }else{
      this.footHeight = 2;
      document.getElementById("foot-expand").innerHTML = "Expand Footer";
    };
    TweenLite.to(document.getElementById("foot"),0.5,{height:this.footHeight+"em"});
  };
  //hide the footer
  this.footVisibility = function(){
    if(this.footOpacity!=0){
      this.footOpacity = 0;
    }else{
      this.footOpacity = 2;
    };
    if(this.footOpacity!=0){
      document.getElementById("nav-menu-settings-hide").innerHTML = "Hide Footer";
    }else{
      document.getElementById("nav-menu-settings-hide").innerHTML = "Show Footer";
    };
    TweenLite.to(document.getElementById("foot"),0.5,{height:this.footOpacity+"em"});
  };
  //set main wrapper height (run every millisecond)
  this.mainHeightSet = function(){
    ui.nav = document.getElementById("nav").offsetHeight;
    ui.doc = window.innerHeight;
    ui.bottom = document.getElementById("foot").offsetHeight;
    document.getElementById("content").style.height = this.doc - this.nav - this.bottom + "px";
  };
  //close the settings and about menus on click elsewhere in document
  this.closeMenus = function(e){
    if(e.target.id!='nav-links-about' && e.target.id!='nav-links-settings'){
      if(this.menuAboutOpacity===1){
        this.menuAbout();
      };
      if(this.menuSettingsOpacity===1){
        this.menuSettings();
      };
    };
  };
  //full screen complete overlay error
  this.mainError = function(title,message){
    TweenLite.to(document.getElementById("overlay"),0.5,{visibility:"visible",opacity:"1"});
    document.getElementById("overlay-title").innerHTML = title;
    document.getElementById("overlay-text").innerHTML = message;
  };
  //remove full screen error
  function removeMainError(){
    TweenLite.to(document.getElementById("overlay"),0.5,{opacity:"0"});
    TweenLite.to(document.getElementById("nav-menu-about"),0,{visibility:"hidden",delay:0.5});
  };
  this.window = function(content,id,title) {
    Window = ui.windowTemplate;
	Window = Window.replace(/<id>/g,id);
	Window = Window.replace(/<title>/g,title);
	Window = Window.replace(/<content>/g,content);
	document.getElementById("windows").innerHTML = document.getElementById("windows").innerHTML + Window;
	ui.windows.push(id);
	ui.windows.forEach(function(entry){
	  Draggable.create('#'+entry+'>div',{bounds: document.getElementById("content")});
	  document.getElementById("window-header-close-"+entry).addEventListener("click",function(event){ui.closeWindow(event)},true);
	});
  };
  this.closeWindow = function(event){
    document.querySelector("#"+event.target.parentNode.getAttribute("data-id")).parentNode.removeChild(document.querySelector("#"+event.target.parentNode.getAttribute("data-id")));
	var index = ui.windows.indexOf(event.target.parentNode.getAttribute("data-id"));
	if (index > -1) {
      ui.windows.splice(index, 1);
    };
  };
  this.httpWindow = function(file,id,title) {
    if(ui.windows.indexOf(id) == -1){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          ui.window(xhttp.responseText,id,title);
        };
      };
      xhttp.open("GET", file, true);
      xhttp.send();
	};
  };
  this.changeTheme = function(name){
    document.getElementById('theme').setAttribute('href','stylesheets/'+name+'.css');
  };
};

//===================================
//== Console Interaction Functions ==
//===================================
function console(){
  this.element;
  //external reference
  console = this;
  //add error to console
  this.codeError = function(message){
    var node = document.createElement("p");
    var textnode = document.createTextNode(message);
    node.appendChild(textnode);
	node.setAttribute("class","error");
    document.getElementById("content-console-output-main").appendChild(node);
  };
  //add warning to console
  this.codeWarning = function(message){
    var node = document.createElement("p");
    var textnode = document.createTextNode(message);
    node.appendChild(textnode);
	node.setAttribute("class","warning");
    document.getElementById("content-console-output-main").appendChild(node);
  };
  //add info to console
  this.codeInfo = function(message){
    var node = document.createElement("p");
    var textnode = document.createTextNode(message);
    node.appendChild(textnode);
	node.setAttribute("class","info");
    document.getElementById("content-console-output-main").appendChild(node);
  };
  //add general text to console
  this.codeText = function(message){
    var node = document.createElement("p");
    var textnode = document.createTextNode(message);
    node.appendChild(textnode);
	node.setAttribute("class","text");
    document.getElementById("content-console-output-main").appendChild(node);
  };
  //print help - currently rubbish :)
  this.help = function(){
    console.codeInfo("This currently supports only 1 language, console. Console commands are entered into the input box and always start with ':'.");
  };
};

//=================
//== Interpreter ==
//=================
function interpreter(){
  //init variables
  this.lang = {':':'console'};
  this.currentLang;
  this.tokens;
  this.debugOn = false;
  //external reference
  interpreter = this;
  //printing for debug messages
  this.debug = function(message) {
    if(interpreter.debugOn){
	  console.codeText(message);
	};
  };
  //run code
  this.runCode = function(e,code) {
    e.preventDefault();
	//what language is this in?
    switch(code.charAt(0)){
      case ':':this.currentLang = 'console';
	    interpreter.debug('console lang');
	    interpreter.interpretConsole(code);
	    break;
	  default:this.currentLang = 'unknown';
	    interpreter.debug('unknown lang');
	    console.codeError('In input \"'+code+'\" the language is unrecognised.');
      break;
    };
	//reset input form
	document.getElementById('content-console-input-form-text').value = "";
  };
  //console lang
  this.interpretConsole = function(code){
    interpreter.debug('console running');
	interpreter.debug('spliting input');
	//split code into tokens by space or semi-colon
    interpreter.tokens = code.slice(1).split(/[\s;]+/);
	interpreter.debug('done');
	interpreter.debug('starting running');
	//loop through the tokens, i=current token, this.tokens[i] = current token
    for(var i = 0;i < this.tokens.length; i++){
	  interpreter.debug('interpreting token ' + i);
	  //switch the token
	  switch(this.tokens[i]){
	    //display help
	    case 'help':interpreter.debug('token help');
		  console.help();
		  break;
		//go to the specification
		case 'spec':interpreter.debug('token spec');
		  window.location.href ='https://github.com/ScratchOs/CPyth/blob/master/Syntax.md#cpyth';
		  break;
		//goto github code
		case 'code':interpreter.debug('token code');
		  window.location.href ='https://github.com/ScratchOs/CPyth/tree/gh-pages';
		  break;
		//footer ui functions
		case 'foot':
		  interpreter.debug('token foot');
		  interpreter.debug('switch next token');
		  switch(this.tokens[i+1]){
		    case 'hide':
			case 'show':
			case 'visibility':interpreter.debug('parameter ' + this.tokens[i+1]);
			interpreter.debug('changing foot visibility');
			  ui.footVisibility();
			  interpreter.debug('done');
              i=i+1;
			  break;
            case 'expand':
			case 'collapse':interpreter.debug('parameter ' + this.tokens[i+1]);
			  interpreter.debug('changing foot height');
			  ui.footExpand();
			  interpreter.debug('done');
		      i=i+1;
			  break;
		    default:interpreter.debug('unidentified foot parameter');
			  console.codeError('\"' + this.tokens[i+1] + '\" is unidentified as a foot property.');
		      i = this.tokens.length;
			  break;
		  };break;
		case 'menu':
		  interpreter.debug('token menu');
		  interpreter.debug('switch next token');
		  switch(this.tokens[i+1]){
		    case 'settings':interpreter.debug('parameter ' + this.tokens[i+1]);
			  interpreter.debug('opening settings menu');
			  ui.menuSettings();
			  interpreter.debug('done');
			  i=i+1;
			  break;
			case 'about':interpreter.debug('parameter ' + this.tokens[i+1]);
			  interpreter.debug('opening about menu');
			  ui.menuAbout();
			  interpreter.debug('done');
			  i=i+1;
			  break;
			case 'close':interpreter.debug('parameter ' + this.tokens[i+1]);
			  interpreter.debug('closing menus');
			  ui.closeMenus();
			  interpreter.debug('done');
			  i=i+1;
			  break;
			default:interpreter.debug('unidentified menu parameter');
			  console.codeError('\"' + this.tokens[i+1] + '\" is unidentified as a menu property.');
		      i = this.tokens.length;
			  break;
		  };break;
		case 'debug':
		  interpreter.debug('token debug');
		  interpreter.debug('switch next token');
		  switch(this.tokens[i+1]){
		    case 'true':
		    case 'on':interpreter.debug('parameter ' + this.tokens[i+1]);
			  interpreter.debug('debug on');
			  this.debugOn = true;
			  i=i+1;
			  break;
			case 'false':
			case 'off':interpreter.debug('parameter ' + this.tokens[i+1]);
			  interpreter.debug('debug off');
			  this.debugOn = false;
			  i=i+1;
			  break;
			default:interpreter.debug('unidentified debug parameter');
			console.codeError('\"' + this.tokens[i+1] + '\" is unidentified as a debug property.');
			  i = this.tokens.length;
			  break;
		  };break;
		default: interpreter.debug('unidentified command');
		  console.codeError('\"' + this.tokens[i] + '\" is unidentified');
		  i = this.tokens.length;
		  break;
	  };
	};
  };
};
function main(){
  this.mainUi;
  this.mainConsole;
  this.mainInterpreter;
  main = this;
  this.init = function(){
    main.mainUi = new ui();
	main.mainConsole = new console();
	main.mainInterpreter = new interpreter();
  };
  this.init();
};

//==============================
//== Initialisation functions ==
//==============================
function init() {
  //event listeners
  document.getElementById('nav-menu-about-code').addEventListener("click",function(){window.open('https://github.com/ScratchOs/CPyth/tree/gh-pages','_blank','location=yes');});
  document.getElementById('nav-menu-about-lang').addEventListener("click",function(){window.open('https://github.com/ScratchOs/CPyth/blob/gh-pages/syntax2.md', '_blank', 'location=yes');});
  document.getElementById('nav-menu-settings-colour').addEventListener("click",function(){ui.httpWindow('ui/colour.html','colour','Change Colour Scheme');});
  document.getElementById('content-console-input-form').addEventListener("submit", function(event){main.mainInterpreter.runCode(event,document.getElementById('content-console-input-form-text').value)},true);
  document.addEventListener("click",function(event){ui.closeMenus(event);},true);
  document.getElementById('foot-expand').addEventListener("click",function(){ui.footExpand();});
  document.getElementById('nav-links-about').addEventListener("click",function(){ui.menuAbout()});
  document.getElementById('nav-links-settings').addEventListener("click",function(){ui.menuSettings()});
  document.getElementById('nav-menu-settings-hide').addEventListener("click",function(){ui.footVisibility()});
  document.getElementById('nav-menu-about-help').addEventListener("click",function(){console.help()});
  //document.getElementById('content-console-input-form').addEventListener("keydown",function(e){console.codeWarning(e)},true);
  //startup animations
  TweenLite.to(document.getElementById("content"),0,{visibility:"visible", delay:1});
  TweenLite.to(document.getElementById("content"),1,{opacity:1, delay:1});
  setInterval(function(){ui.mainHeightSet();},1);
  // make codemirror
  var host = document.getElementById("content-codemirror-container");
  var myCodeMirror = CodeMirror(host,{lineNumbers: true,theme: "pastel-on-dark",viewportMargin:Infinity,fixedGutter:true});
  //redirect if not ? domain
  if(window.location.href.indexOf('?') <= -1){
    window.location.href ='https://scratchos.github.io/CPyth/?';
  };
  //welcome text
  console.codeText("Welcome to the CPyth online interpreter.");
}

//==============
//== Load App ==
//==============
window.onload = function(){
  //create UI and console functions
  new main();
  //initialise app
  init();
};