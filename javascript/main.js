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
    document.getElementById("hide").innerHTML = "Hide Footer";
  }else{
    document.getElementById("hide").innerHTML = "Show Footer";
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
  if(menuAboutOpacity==1){
    menuAbout();
  };
  if(menuSettingsOpacity==1){
    menuSettings();
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
  setInterval(mainHeightSet,1);
  document.addEventListener("click",function(event){closeMenus(event);},true);
  //var myCodeMirror = CodeMirror(document.getElementById("content-codemirror"),{lineNumbers: true,theme: "pastel-on-dark"});
};