//Main Javascript file
function ui(){
  this.menuSettingsOpacity = 0;
  this.menuAboutOpacity = 0;
  this.footHeight = 2;
  this.footOpacity = 1;
  this.nav = document.getElementById("nav").offsetHeight;
  this.bottom = document.getElementById("foot").offsetHeight;
  this.doc = window.innerHeight;
  ui = this;
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
  this.mainHeightSet = function(){
    ui.nav = document.getElementById("nav").offsetHeight;
    ui.doc = window.innerHeight;
    ui.bottom = document.getElementById("foot").offsetHeight;
    document.getElementById("content").style.height = this.doc - this.nav - this.bottom + "px";
  };
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
  this.mainError = function(title,message){
    TweenLite.to(document.getElementById("overlay"),0.5,{visibility:"visible",opacity:"1"});
    document.getElementById("overlay-title").innerHTML = title;
    document.getElementById("overlay-text").innerHTML = message;
  };
  this.init = function() {
    TweenLite.to(document.getElementById("content"),0,{visibility:"visible", delay:1});
    TweenLite.to(document.getElementById("content"),1,{opacity:1, delay:1});
    document.addEventListener("click",function(event){ui.closeMenus(event);},true);
    document.getElementById('foot-expand').addEventListener("click",function(){ui.footExpand();});
    document.getElementById('nav-links-about').addEventListener("click",function(){ui.menuAbout()});
    document.getElementById('nav-links-settings').addEventListener("click",function(){ui.menuSettings()});
    document.getElementById('nav-menu-hide').addEventListener("click",function(){ui.footVisibility()});
	setInterval(function(){ui.mainHeightSet();},1);
  };
  this.init();
};
function console() {
  console = this;
  function removeMainError(){
    TweenLite.to(document.getElementById("overlay"),0.5,{opacity:"0"});
    TweenLite.to(document.getElementById("nav-menu-about"),0,{visibility:"hidden",delay:0.5});
  };
  this.codeError = function(message){
    element = document.createElement("p");
    element.setAttribute("title","Error");
    element.setAttribute("class","error");
    element.innerHTML = message;
    document.getElementById('content-console-output').insertBefore(element,document.getElementById('content-console-output-bottom'))
  };
  this.codeWarning = function(message){
    var element = document.createElement("p");
    element.setAttribute("title","Warning");
    element.setAttribute("class","warning");
    element.innerHTML = message;
    document.getElementById('content-console-output').insertBefore(element,document.getElementById('content-console-output-bottom'))
  };
  this.codeInfo = function(message){
    element = document.createElement("p");
    element.setAttribute("title","Info");
    element.setAttribute("class","info");
    element.innerHTML = message;
    document.getElementById('content-console-output').insertBefore(element,document.getElementById('content-console-output-bottom'))
  };
  this.codeText = function(message){
    element = document.createElement("p");
    element.setAttribute("title","Text");
    element.setAttribute("class","text");
    element.innerHTML = message;
    document.getElementById('content-console-output').insertBefore(element,document.getElementById('content-console-output-bottom'))
  };
  this.help = function(){
    console.codeInfo("Whatever you type in the console will get printed.");
  };
  this.init = function(){
    document.getElementById('nav-menu-about-help').addEventListener("click",function(){console.help()});
  };
  this.init();
};
function main() {
  this.mainUi;
  this.mainConsole;
  var myCodeMirror = CodeMirror(document.getElementById("content-codemirror-container"),{lineNumbers: true,theme: "pastel-on-dark",viewportMargin:Infinity});
  if(window.location.href.indexOf('?') <= -1){
    window.location.href ='https://scratchos.github.io/CPyth/?';
  };
  this.init = function() {
    this.mainUi = new ui(), this.mainConsole = new console();
    document.getElementById('nav-menu-about-code').addEventListener("click",function(){window.location.href ='https://github.com/ScratchOs/CPyth/tree/gh-pages';});
    document.getElementById('nav-menu-about-lang').addEventListener("click",function(){window.location.href ='https://github.com/ScratchOs/CPyth/blob/master/Syntax.md#cpyth';});
	document.getElementById('content-console-input-form').addEventListener("submit", function(event){event.preventDefault;console.codeText(document.getElementById('content-console-input-form-text').value);document.getElementById('content-console-input-form-text').value = "";return false;},true);
    console.codeText("Welcome to the CPyth online interpreter.");
  };
  this.init();
};
var mainApp;
window.onload = function() {
  mainApp = new main();
};