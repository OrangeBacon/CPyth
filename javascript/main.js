//Main Javascript file
var menuSettingsOpacity = 0;
var menuAboutOpacity = 0;
var footHeight = 2;
var footOpacity = 1;
function menuSettings(){
  if(menuAboutOpacity == 1){
    menuAbout();
  };
  menuSettingsOpacity = 1 - menuSettingsOpacity;
  if(menuSettingsOpacity == 1){
    TweenLite.to(document.getElementById("nav-menu-settings"),0.4,{visibility:"visible"});
  };
  TweenLite.to(document.getElementById("nav-menu-settings"),0.4,{opacity:menuSettingsOpacity});
  if(menuSettingsOpacity == 0){
    TweenLite.to(document.getElementById("nav-menu-settings"),0.4,{visibility:"hidden",delay:0.4});
  };
};
function menuAbout(){
  if(menuSettingsOpacity == 1){
    menuSettings();
  };
  menuAboutOpacity = 1 - menuAboutOpacity;
  if(menuAboutOpacity == 1){
    TweenLite.to(document.getElementById("nav-menu-about"),0.4,{visibility:"visible"});
  };
  TweenLite.to(document.getElementById("nav-menu-about"),0.4,{opacity:menuAboutOpacity});
  if(menuAboutOpacity == 0){
    TweenLite.to(document.getElementById("nav-menu-about"),0.4,{visibility:"hidden",delay:0.4});
  };
};
function footExpand() {
  if (footHeight == 2) {
    footHeight = 5;
    document.getElementById("foot-expand").innerHTML = "Collapse Footer";
  }else{
    footHeight = 2;
    document.getElementById("foot-expand").innerHTML = "Expand Footer";
  };
  TweenLite.to(document.getElementById("foot"),0.5,{height:footHeight+"em"});
};
function footVisibility(){
  if(footOpacity!=0){
    footOpacity = 0;
  }else{
    footOpacity = 2;
  };
  if(footOpacity!=0){
    document.getElementById("nav-menu-hide").innerHTML = "Hide Footer";
  }else{
    document.getElementById("nav-menu-hide").innerHTML = "Show Footer";
  };
  TweenLite.to(document.getElementById("foot"),0.5,{height:footOpacity+"em"});
};
function mainHeightSet(){
  var nav = document.getElementById("nav").offsetHeight;
  var bottom = document.getElementById("foot").offsetHeight;
  var doc = window.innerHeight;
  document.getElementById("content").style.height = doc - nav - bottom + "px" 
};
function closeMenus(e){
  if(e.target.id!='nav-links-about' && e.target.id!='nav-links-settings'){
    if(menuAboutOpacity==1){
      menuAbout();
    };
    if(menuSettingsOpacity==1){
      menuSettings();
    };
  };
}; 
function mainError(title,message){
  TweenLite.to(document.getElementById("overlay"),0.5,{visibility:"visible",opacity:"1",});
  document.getElementById("overlay-title").innerHTML = title;
  document.getElementById("overlay-text").innerHTML = message;
};
function removeMainError(){
  TweenLite.to(document.getElementById("overlay"),0.5,{opacity:"0",});
  TweenLite.to(document.getElementById("nav-menu-about"),0,{visibility:"hidden",delay:0.5});
};
function codeError(message){
  var element = document.createElement("p");
  element.setAttribute("title","Error");
  element.setAttribute("class","error");
  element.innerHTML = message;
  document.getElementById('content-console-output').insertBefore(element,document.getElementById('content-console-output-bottom'))
}
function codeWarning(message){
  var element = document.createElement("p");
  element.setAttribute("title","Warning");
  element.setAttribute("class","warning");
  element.innerHTML = message;
  document.getElementById('content-console-output').insertBefore(element,document.getElementById('content-console-output-bottom'))
}
function codeInfo(message){
  var element = document.createElement("p");
  element.setAttribute("title","Info");
  element.setAttribute("class","info");
  element.innerHTML = message;
  document.getElementById('content-console-output').insertBefore(element,document.getElementById('content-console-output-bottom'))
}
function codeText(message){
  var element = document.createElement("p");
  element.setAttribute("title","Text");
  element.setAttribute("class","text");
  element.innerHTML = message;
  document.getElementById('content-console-output').insertBefore(element,document.getElementById('content-console-output-bottom'))
}
window.onload = function() {
  TweenLite.to(document.getElementById("content"),0,{visibility:"visible", delay:1});
  TweenLite.to(document.getElementById("content"),1,{opacity:1, delay:1});
  setInterval(mainHeightSet,1);
  document.addEventListener("click",function(event){closeMenus(event);},true);
  document.getElementById('foot-expand').addEventListener("click",footExpand);
  document.getElementById('nav-links-about').addEventListener("click",menuAbout);
  document.getElementById('nav-links-settings').addEventListener("click",menuSettings);
  document.getElementById('nav-menu-hide').addEventListener("click",footVisibility);
  document.getElementById('nav-menu-about-code').addEventListener("click",function(){window.location.href ='https://github.com/ScratchOs/CPyth/tree/gh-pages';});
  document.getElementById('nav-menu-about-lang').addEventListener("click",function(){window.location.href ='https://github.com/ScratchOs/CPyth/blob/master/Syntax.md#cpyth';});
  document.getElementById('content-console-input-form').addEventListener("submit", function(event){console.log("submit");codeText(document.getElementById('content-console-input-form-text').value);document.getElementById('content-console-input-form-text').value = "";return false},true);
  var myCodeMirror = CodeMirror(document.getElementById("content-codemirror-container"),{lineNumbers: true,theme: "pastel-on-dark",viewportMargin:Infinity});
  myCodeMirror.getDoc().setValue('Your code');
  myCodeMirror.refresh();
};