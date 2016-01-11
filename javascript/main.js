//Main Javascript file

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
      document.getElementById("nav-menu-hide").innerHTML = "Hide Footer";
    }else{
      document.getElementById("nav-menu-hide").innerHTML = "Show Footer";
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
  //load external (same domain, diffrent page) html into the console window eg forms
  this.overlay = function(file) {
    //iframe method - depreciated
    /*var frame = document.createElement('iframe');
	frame.src = file;
	frame.id = "content-console-output-overlay-iframe";
	document.getElementById('content-console-output-overlay').appendChild(frame);
	TweenLite.to(document.getElementById("content-console-output-main"),1,{opacity:"0"});
	TweenLite.to(document.getElementById('content-console-input'),1,{height:0});*/
	//ajax get method - current
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        ui.outDoc = xhttp.responseText;
		document.getElementById('content-console-output-overlay').innerHTML = ui.outDoc;
	    TweenLite.to(document.getElementById("content-console-output-main"),1,{opacity:"0"});
		TweenLite.to(document.getElementById('content-console-input'),1,{height:0});
      };
    };
    xhttp.open("GET", file, true);
    xhttp.send();
  };
  //remove console window external html
  this.closeOverlay = function() {
    TweenLite.to(document.getElementById("content-console-output-main"),0,{opacity:"1"});
	TweenLite.to(document.getElementById('content-console-input'),1,{height:'2em'});
	document.getElementById('content-console-output-overlay').innerHTML = "";
  }
};

//===================================
//== Console Interaction Functions ==
//===================================
function console(){
  //external reference
  console = this;
  //add error to console
  this.codeError = function(message){
    element = document.createElement("p");
    element.setAttribute("title","Error");
    element.setAttribute("class","error");
    element.innerHTML = message;
    document.getElementById('content-console-output-main').insertBefore(element,document.getElementById('content-console-output-main-bottom'))
  };
  //add warning to console
  this.codeWarning = function(message){
    var element = document.createElement("p");
    element.setAttribute("title","Warning");
    element.setAttribute("class","warning");
    element.innerHTML = message;
    document.getElementById('content-console-output-main').insertBefore(element,document.getElementById('content-console-output-main-bottom'))
  };
  //add info to console
  this.codeInfo = function(message){
    element = document.createElement("p");
    element.setAttribute("title","Info");
    element.setAttribute("class","info");
    element.innerHTML = message;
    document.getElementById('content-console-output-main').insertBefore(element,document.getElementById('content-console-output-main-bottom'))
  };
  //add general text to console
  this.codeText = function(message){
    element = document.createElement("p");
    element.setAttribute("title","Text");
    element.setAttribute("class","text");
    element.innerHTML = message;
    document.getElementById('content-console-output-main').insertBefore(element,document.getElementById('content-console-output-main-bottom'))
  };
  //print help - currently rubbish :)
  this.help = function(){
    console.codeInfo("This currently supports only 1 language, console.\nConsole commands are entered into the input box and always start with ':'.");
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
  document.getElementById('nav-menu-about-code').addEventListener("click",function(){window.location.href ='https://github.com/ScratchOs/CPyth/tree/gh-pages';});
  document.getElementById('nav-menu-about-lang').addEventListener("click",function(){window.location.href ='https://github.com/ScratchOs/CPyth/blob/master/Syntax.md#cpyth';});
  document.getElementById('content-console-input-form').addEventListener("submit", function(event){main.mainInterpreter.runCode(event,document.getElementById('content-console-input-form-text').value)},true);
  document.addEventListener("click",function(event){ui.closeMenus(event);},true);
  document.getElementById('foot-expand').addEventListener("click",function(){ui.footExpand();});
  document.getElementById('nav-links-about').addEventListener("click",function(){ui.menuAbout()});
  document.getElementById('nav-links-settings').addEventListener("click",function(){ui.menuSettings()});
  document.getElementById('nav-menu-hide').addEventListener("click",function(){ui.footVisibility()});
  document.getElementById('nav-menu-about-help').addEventListener("click",function(){console.help()});
  //startup animations
  TweenLite.to(document.getElementById("content"),0,{visibility:"visible", delay:1});
  TweenLite.to(document.getElementById("content"),1,{opacity:1, delay:1}); 
  setInterval(function(){ui.mainHeightSet();},1);
 // make codemirror
  var myCodeMirror = CodeMirror(document.getElementById("content-codemirror-container"),{lineNumbers: true,theme: "pastel-on-dark",viewportMargin:Infinity,fixedGutter:true});
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