"use strict";
var cpyth = {
  vars: {
    codemirror:"",
	codemirrorPreview:"",
	windowTemplate: '<div class="window" id="<id>"><div class="window-header"><div class="window-header-close" id="window-header-close"><p class="window-header-close-text" onclick="cpyth.window.closeWindow(<id>)">X</p></div><p class="window-header-title"><title></p></div><div class="window-content"><content></div><div class="window-corner" style="display:block"></div></div>',
	windows: [],
	files:{type:"folder",name:"root",content:{}},
	id:0,
	path:"",
	file:""
  },
  utils: {
    ajax(method="GET",url="/",cont=function(){}) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(){if (xhttp.readyState == 4 && xhttp.status == 200) {cont(xhttp.responseText)}else{console.log("Ajax Error")}};
      xhttp.open(method, url, true);
      xhttp.send();
    },
	dragMoveListener(event) {
      var target = event.target,
	    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
      target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    },
	resizeListener(event) {
	  if(event.target.getAttribute('data-resize') != 'false'){
        var target = event.target,
          x = (parseFloat(target.getAttribute('data-x')) || 0),
          y = (parseFloat(target.getAttribute('data-y')) || 0);
        target.style.width  = Math.min(Math.max(parseInt(event.rect.width), parseInt(target.getAttribute('data-minX')||event.rect.width)), parseInt(target.getAttribute('data-maxX')||0)) + 'px';
        target.style.height = Math.min(Math.max(parseInt(event.rect.height), parseInt(target.getAttribute('data-minY')||event.rect.height)), parseInt(target.getAttribute('data-maxY')||0))+ 'px';
        x += event.deltaRect.left;
        y += event.deltaRect.top;
        target.style.webkitTransform = 
	    target.style.transform =
          'translate(' + x + 'px,' + y + 'px)';
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
	  };
    },
	documentResize(event){
	  var tabwidth = document.getElementById("content-codemirror-tabs").offsetWidth;
	  var tabs = document.getElementById("content-codemirror-tabs").children;
	  var width = 'calc( ( ' + tabwidth + "px - " + (0.2*tabs.length) + "em - 0.2em ) / " + tabs.length +" )"
	  for(var i = 0;i<tabs.length;i++){
	    tabs[i].style.width = width;
	  }
	},
	id(){
	  return cpyth.vars.id++
	}
  },
  window: {
    window(title,content,options={minX:50,minY:50,startX:200,startY:200}) {
	  var id = (cpyth.vars.windows[cpyth.vars.windows.length-1]||0) + 1;
      var Window = cpyth.vars.windowTemplate;
	  Window = Window.replace(/<id>/g,id).replace(/<title>/g,title).replace(/<content>/g,content);
	  if(options.resize == false){
	    Window = Window.replace(/block/g,"none");
  	  };
	  document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + Window;
	  Window = document.getElementById(id);
  	  if(options.keepAspect){
	    Window.setAttribute("class","window-aspect");
  	  };
      Window.setAttribute("data-resize",options.resize||false);
	  Window.setAttribute("data-minX",options.minX||0);
	  Window.setAttribute("data-minY",options.minY||0);
	  Window.setAttribute("data-maxX",options.maxX||Infinity);
	  Window.setAttribute("data-maxY",options.maxY||Infinity);
	  Window.style.width = (options.startX + "px")||"";
	  Window.style.height = (options.startY + "px")||"";
	  cpyth.vars.windows.push(id);
	  return id;
    },
	closeWindow(id){
      document.getElementById("content").removeChild(document.getElementById(id));
	  var index = cpyth.vars.windows.indexOf(id);
	  if (index > -1) {
        cpyth.vars.windows.splice(index, 1);
      };
    },
  },
  console: {
    error(message){
      var node = document.createElement("p");
      var textnode = document.createTextNode(message);
      node.appendChild(textnode);
	  node.setAttribute("class","error");
      document.getElementById("content-console-output-main").appendChild(node);
    },
    warning(message){
      var node = document.createElement("p");
      var textnode = document.createTextNode(message);
      node.appendChild(textnode);
	  node.setAttribute("class","warning");
      document.getElementById("content-console-output-main").appendChild(node);
    },
    info(message){
      var node = document.createElement("p");
      var textnode = document.createTextNode(message);
      node.appendChild(textnode);
	  node.setAttribute("class","info");
      document.getElementById("content-console-output-main").appendChild(node);
    },
    text(message){
      var node = document.createElement("p");
      var textnode = document.createTextNode(message);
      node.appendChild(textnode);
      node.setAttribute("class","text");
      document.getElementById("content-console-output-main").appendChild(node);
	}
  },
  ui: {
	alternateTheme(e){
	  if(e.target.checked){
	    document.getElementById("theme").setAttribute('href','stylesheets/dark-main.css');
	  } else {
	    document.getElementById("theme").setAttribute('href','stylesheets/light-main.css');
	  }
	},
	fileBrowser(e){
	  if(e.target.id == "fileopen"){
	    document.getElementById("file-browser").removeAttribute('hidden');
		cpyth.vars.codemirrorPreview.refresh();
		cpyth.files.display();
      } else {
	    document.getElementById("file-browser").setAttribute('hidden','');
	  }
	},
	showFolder(){
	  document.getElementById("foldercreate").removeAttribute('hidden');
	  document.getElementById("filecreate").setAttribute('hidden','');
	},
	showFile(){
	  document.getElementById("filecreate").removeAttribute('hidden');
	  document.getElementById("foldercreate").setAttribute('hidden','');
	},
	createFolder(){
	  document.getElementById("foldercreate").setAttribute('hidden','');
	  var name = document.getElementById("foldername").value;
	  document.getElementById("filename").value = "";
	  cpyth.files.folder.create(cpyth.vars.path,name);
	},
	createFile(){
	  document.getElementById("filecreate").setAttribute('hidden','');
	  var name = document.getElementById("filename").value;
	  var namef = name.replace(/\.(?=[^.]*$)[\s\S]+/,"");
	  var ext = name.match(/([^\.]+$)/)[0];
	  document.getElementById("filename").value = "";
	  cpyth.files.file.create(cpyth.vars.path,namef,ext);
	}
  },
  files: {
    init(){
	  cpyth.files.folder.create("","_lib");  
	  cpyth.files.folder.create("","modules");
	  cpyth.files.folder.create("","test");
	  cpyth.files.folder.create("_lib","vendor"); 
	  cpyth.files.file.create("","main","cpyth");
	  cpyth.files.file.create("test","test","cpyth");
	  cpyth.files.file.create("_lib/vendor","jquery.min","js");
	  cpyth.files.file.save("_lib/vendor","jquery.min.js","This is JQuery!");
	  cpyth.files.display();
	},
	render(node,path){
	  node = node.content;
	  var keys = Object.keys(node)
	  var ret = "";
	  if(keys.length > 0){
	    for(var i=0;i<keys.length;i++){
	      var test = node[keys[i]];
	      if(typeof test.content == "object"){
		    var id=cpyth.utils.id();
			var fpath = path + test.name + "/"
		    ret+="<li class='treeview-folder' data-path='" + fpath + "'><input type='checkbox' id='f" + id +"'><label for='f" + id + "'>" + test.name + "</label><ul class='treeview-content'>" + cpyth.files.render(test,fpath) + "</ul></li>"
		  } else {
		    ret+="<li class='treeview-file' data-type='" + test.type + "' data-path='" + path +"' data-file='" + test.name + "'>" + test.name + "</li>"
		  }
	    }
	  } else {
	    ret = "<li data-type='empty' data-path='" + path + "'>empty</li>";
	  }
	  return ret
	},
	display(){
	  var node = cpyth.vars.files
	  document.getElementById("treeview").innerHTML = "<ul class='treeview-content'>" + cpyth.files.render(node,"") + "</ul>";
	  var elem = document.querySelectorAll(".treeview-content > li");
	  for(var i = 0;i<elem.length;i++){
	    elem[i].addEventListener("click",function(e){cpyth.files.pathSet(e)},true);
	  }
	},
	pathSet(e){
	  e.stopPropagation();
	  var path = e.target.getAttribute("data-path");
	  var file = "";
	  if(path == null){
	    path = e.target.parentNode.getAttribute("data-path");
	  } else if(e.target.getAttribute("data-file")!= null){
	    file = e.target.getAttribute("data-file");
	  }
	  cpyth.vars.path = path;
	  cpyth.vars.file = file;
	  document.getElementById("path").children[0].innerHTML = "Path: " + path + file;
	  if(file!=""){
	    cpyth.vars.codemirrorPreview.setValue(cpyth.files.file.get(path,file));
		document.getElementById("controls-files").removeAttribute('hidden');
		document.getElementById("controls-folders").setAttribute('hidden','');
	  } else {
	    cpyth.vars.codemirrorPreview.setValue("");
		document.getElementById("controls-folders").removeAttribute('hidden');
		document.getElementById("controls-files").setAttribute('hidden','');
	  }
	},
	save(){
	
	},
	load(){
	
	},
	file: {
	  open(path){
	    
	  },
	  close(tab){
	
	  },
	  create(path,name,ext){
		var namef = name.replace(/[\.\/]/g,"_");
		var node = cpyth.vars.files;
		if(path!=""){
		  path = path.split(/[\/]/).filter(Boolean);
		  for(var i=0;i<path.length;i++){
		    if(node.content[path[i]]){
		      node = node.content[path[i]];
		    } else {
		      throw "path error";
		    }
		  };
		}
		node.content[namef] = {type:ext,name:name+"."+ext,content:""};
		cpyth.files.display();
	  },
	  save(path,name,content){
	    name = name.replace(/\.(?=[^.]*$)[\s\S]+/,"")
	    var namef = name.replace(/[\.\/]/g,"_");
		var node = cpyth.vars.files;
		if(path!=""){
		  path = path.split(/[\/]/).filter(Boolean);
		  for(var i=0;i<path.length;i++){
		    if(node.content[path[i]]){
		      node = node.content[path[i]];
		    } else {
		      throw "path error";
		    }
		  };
		}
		node.content[namef].content = content;
	  },
	  remove(path,name){
		name = name.replace(/\.(?=[^.]*$)[\s\S]+/,"");
	    var namef = name.replace(/[\.\/]/g,"_");
		var node = cpyth.vars.files;
		if(path!=""){
		  path = path.split(/[\/]/).filter(Boolean);
		  for(var i=0;i<path.length;i++){
		    if(node.content[path[i]]){
		      node = node.content[path[i]];
		    } else {
		      throw "path error";
		    }
		  };
		}
		delete node.content[namef];
		cpyth.files.display();
	  },
	  get(path,name){
	    name = name.replace(/\.(?=[^.]*$)[\s\S]+/,"");
	    var namef = name.replace(/[\.\/]/g,"_");
		var node = cpyth.vars.files;
		if(path!=""){
		  path = path.split(/[\/]/).filter(Boolean);
		  for(var i=0;i<path.length;i++){
		    if(node.content[path[i]]){
		      node = node.content[path[i]];
		    } else {
		      throw "path error";
		    }
		  }		
		}
		return node.content[namef].content;
	  }
	},
	folder: {
	  create(path,name){
	    var namef = name.replace(/[\.\/]/g,"_");
		var node = cpyth.vars.files;
		if(path!=""){
		  path = path.split(/[\/]/).filter(Boolean);
		  for(var i=0;i<path.length;i++){
		    if(node.content[path[i]]){
		      node = node.content[path[i]];
		    } else {
		      throw "path error";
		    }
		  };
		}
		node.content[namef] = {type:"folder",name:name,content:{}};
		cpyth.files.display();
	  },
	  remove(path){
		var node = cpyth.vars.files;
		path = path.split(/[\/]/).filter(Boolean);
		if(path!="" && (path.length-1)>0){
		  for(var i=0;i<(path.length-1);i++){
		    if(node.content[path[i]]){
		      node = node.content[path[i]];
		    } else {
		      throw "path error";
		    }
		  };
		  delete node.content[path[i]];
		} else {
		  delete node.content[path[0]];
		}
		cpyth.files.display();
	  }
	}
  },
  init() {
    var host = document.getElementById("content-codemirror-container");
    cpyth.vars.codemirror = CodeMirror(host,{lineNumbers: true,viewportMargin:Infinity});
	host = document.getElementById("preview");
	cpyth.vars.codemirrorPreview = CodeMirror(host,{lineNumbers: true,viewportMargin:Infinity,readOnly:"nocursor"});
	cpyth.console.text("Welcome to the CPyth online interpreter.");
	interact(".window").resizable({
      edges: { left: false, right: true, bottom: true, top: false }
    }).on('resizemove',cpyth.utils.resizeListener).allowFrom(".window-header,.window-corner").draggable({
      restrict: {
        restriction: '#content',
  	    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
	  onmove: cpyth.utils.dragMoveListener
    });
	interact(".window-aspect").resizable({
	  preserveAspectRatio:true,
      edges: { left: false, right: true, bottom: true, top: false }
    }).on('resizemove',cpyth.utils.resizeListener).allowFrom(".window-header-title,.window-corner").draggable({
      restrict: {
        restriction: '#content',
  	    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
	  onmove: cpyth.utils.dragMoveListener
    });
	document.getElementById("colour").addEventListener("change",function(e){cpyth.ui.alternateTheme(e)},true);
	document.getElementById("fileopen").addEventListener("click",function(e){cpyth.ui.fileBrowser(e)},true);
	document.getElementById("fileclose").addEventListener("click",function(e){cpyth.ui.fileBrowser(e)},true);
	document.getElementById("folderdelete").addEventListener("click",function(){cpyth.files.folder.remove(cpyth.vars.path)},true);
	document.getElementById("filenew").addEventListener("click",cpyth.ui.showFile);
	document.getElementById("foldernew").addEventListener("click",cpyth.ui.showFolder);
	document.getElementById("createfolder").addEventListener("click",cpyth.ui.createFolder);
	document.getElementById("createfile").addEventListener("click",cpyth.ui.createFile);
	document.getElementById("filedelete").addEventListener("click",function(){cpyth.files.file.remove(cpyth.vars.path,cpyth.vars.file)},true);
	cpyth.files.init();
	setInterval(cpyth.utils.documentResize,50);
  }
};
window.onload = function(){
  cpyth.init();
}