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
	file:"",
	openTab:"",
	zip:null
  },
  utils: {
    ajax(method="GET",url="/",cont=function(){}) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(){if (xhttp.readyState == 4 && xhttp.status == 200) {cont(xhttp.responseText)}};
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
	},
	getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length,c.length);
        }
      }
      return "";
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
		document.cookie = "theme=1; expires=Fri, 31 Dec 9999 23:59:99 GMT"
	  } else {
	    document.getElementById("theme").setAttribute('href','stylesheets/light-main.css');
		document.cookie = "theme=0; expires=Fri, 31 Dec 9999 23:59:99 GMT"
	  }
	},
	setThemeDefault(){
	  if(cpyth.utils.getCookie('theme') == "1"){
	    document.getElementById("theme").setAttribute('href','stylesheets/dark-main.css');
		document.getElementById("colour").checked = true;
	  } else {
	    document.getElementById("theme").setAttribute('href','stylesheets/light-main.css');
		document.getElementById("colour").checked = false;
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
	},
	tabChange(e){
	  cpyth.files.file.change(e.target.getAttribute("data-id"));
	},
	input(e){
	  var v = cpyth.vars;
	  if(e.keyIdentifier == "Enter"){
	    var h = document.getElementById("history");
		h.innerHTML = h.innerHTML + "<p class='history-item'><span class='history-close'>X</span><span>" + e.target.value + "</span></p>";
		exec(e.target.value);
		e.target.value = "";
		for(var i=0;i<h.children.length;i++){
		  h.children[i].children[1].addEventListener("click",function(e){exec(e.target.textContent)},true)
		}
		for(var i=0;i<h.children.length;i++){
		  h.children[i].children[0].addEventListener("click",function(e){document.getElementById("history").children[i-1].remove()},true)
		}
	  }
	},
	blankProj(){
	  document.getElementById("content-overlay").setAttribute('hidden','');
	  cpyth.vars.files = {type:"folder",name:"root",content:{}}
	},
	deleteFolder(){
	  document.getElementById("folder-delete").removeAttribute('hidden');
	  setTimeout(function(){document.getElementById("folder-delete").setAttribute('hidden','')},3000)
	},
	deleteFile(){
	  document.getElementById("file-delete").removeAttribute('hidden');
	  setTimeout(function(){document.getElementById("file-delete").setAttribute('hidden','')},3000)
	},
  },
  files: {
    init(){
	  cpyth.files.file.create("","main","cpyth");
	  cpyth.files.display();
	  setInterval(cpyth.files.saveOpen,60000);
	  console.log("Ready");
	},
	render(node,path){
	  node = node.content;
	  var keys = Object.keys(node);
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
	  document.getElementById("treeview").innerHTML = "<ul class='treeview-content'><li class='treeview-root' data-path='' data-file=''>Root</li>" + cpyth.files.render(node,"") + "</ul>";
	  var elem = document.querySelectorAll(".treeview-content > li");
	  for(var i = 0;i<elem.length;i++){
	    elem[i].addEventListener("click",function(e){cpyth.files.pathSet(e)},true);
	  }
	  cpyth.vars.path = "";
	  cpyth.vars.file = "";
	  document.getElementById("path").children[0].innerHTML = "Path: ";
	  document.getElementById("controls-folders").removeAttribute('hidden');
	  document.getElementById("controls-files").setAttribute('hidden','');
	  cpyth.vars.codemirrorPreview.setValue('')
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
		document.getElementById("controls-folders").removeAttribute('hidden');
		document.getElementById("controls-files").setAttribute('hidden','');
		file = file.replace(/\.(?=[^.]*$)[\s\S]+/,"");
		var node = cpyth.vars.files;
		if(path!=""){
		  var pathf = path.split(/[\/]/).filter(Boolean);
		  for(var i=0;i<pathf.length;i++){
		    if(node.content[pathf[i]]){
		      node = node.content[pathf[i]];
		    } else {
		      throw "path error";
		    }
		  };
		}
		node = node.content
		var keys = Object.keys(node)
		var text = "This folder contains <file> files and <folder> folders"
		var files = 0
		var folders = 0
		for(var i=0;i<keys.length;i++){
		  if(node[keys[i]].type == 'folder'){
		    folders++
		  } else {
		    files++
		  }
		}
		text = text.replace('<file>',files)
		text = text.replace('<folder>',folders)
		cpyth.vars.codemirrorPreview.setValue(text)
	  }
	},
	importZip(e){
	  if(e.target.id=="import-new"||confirm("Do you wish to load this project? It will overwrite all work in the IDE.  Any work not saved locally will be lost.")){
	  document.getElementById("content-overlay").setAttribute('hidden','');
	  var f = e.target.files[0];
	  JSZip.loadAsync(f).then(function(zip){
	    console.log("Loading file");
	    cpyth.vars.files = {type:"folder",name:"root",content:{}};
	    zip.forEach(function (relativePath, zipEntry) {
		  if(relativePath.charAt(relativePath.length-1) == '/'){
			var path = '/' + relativePath;
			var name = path.substring(path.lastIndexOf('/', path.lastIndexOf('/') - 1), path.length - 1);
			path = path.replace(/\/$/,"");
			path = path.replace(/\/(?=[^\/]*$)[\s\S]+/,"");
			path = path.replace(/^\//,"");
			name = name.replace(/^\//,"");
			cpyth.files.folder.create(path,name);
		  } else {
			var name = relativePath.match(/(?=[^\/]*$)[\s\S]+/)[0]
			var ext = name.match(/(?=[^.]*$)[\s\S]+/)[0];
			name = name.replace(/\.(?=[^.]*$)[\s\S]+/,"")
			var path = ('/'+relativePath).replace(/\/(?=[^\/]*$)[\s\S]+/,"");
			cpyth.files.file.create(path,name,ext);
			var data = new TextDecoder("utf-8").decode(zipEntry._data.compressedContent)
			cpyth.files.file.save(path,name+'.'+ext,data);
		  }
		});
		console.log('File loaded');
	  });
	  }
	},
	exportZip(){
	  cpyth.vars.zip = new JSZip();
	  console.log("Creating zip file")
	  cpyth.files.createZip(cpyth.vars.zip,"",cpyth.vars.files);
	  console.log("File zipped")
	  cpyth.vars.zip.generateAsync({type:"blob"}).then(function(blob){saveAs(blob, "project.cpyth")});
	},
	createZip(zip,path,node){
	  node = node.content;
	  var keys = Object.keys(node);
	  if(keys.length > 0){
	    for(var i=0;i<keys.length;i++){
	      var test = node[keys[i]];
	      if(typeof test.content == "object"){
            var fpath = path +'/'+ test.name;
			fpath = fpath.replace(/^\//,"")
			zip.folder(fpath);
			cpyth.files.createZip(zip,fpath,test);
		  } else {
		    var fpath = path +'/'+ test.name
			fpath = fpath.replace(/^\//,"")
			if(test.readOnly==false)zip.file(fpath,test.content);
		  }
	    }
	  }
	},
	saveOpen(){
	  if(document.getElementById('content-codemirror-tabs').children.length>0){
	    if(document.querySelector(".tab[data-id=t" + cpyth.vars.openTab + "]").getAttribute("data-special") == 'false'){
	      var tab = document.querySelector(".tab[data-id=t" + cpyth.vars.openTab + "]");
	      var path = tab.getAttribute('data-path');
	      var file = tab.getAttribute('data-file');
		  var write = tab.getAttribute('data-write')
	      var content = cpyth.vars.codemirror.getValue();
		  if(write=='true'){cpyth.files.file.save(path,file,content);}
	    }
	  }
	},
	closeOpen(){
	  cpyth.files.saveOpen();
	  var tabs=document.getElementById('content-codemirror-tabs').children;
	  var container = document.getElementById('content-codemirror-tabs');
	  if(tabs.length>1){
	    if(document.querySelector(".tab[data-id=t" + cpyth.vars.openTab + "]").getAttribute("data-special") == 'false'){
	      var tab = document.querySelector(".tab[data-id=t" + cpyth.vars.openTab + "]");
		  var i = 0;
          while( (tab = tab.previousSibling) != null )i++;
		  if((i+1)<tabs.length){
		    cpyth.files.file.change(tabs[i+1].getAttribute('data-id'));
		  } else {
		    cpyth.files.file.change(tabs[i-1].getAttribute('data-id'));
		  }
		  container.removeChild(tabs[i]);
	    } else {
	      container.removeChild(tabs[0]);
		  cpyth.vars.openTab = "";
	    }
	  }
	},
	openSpecial(name,id,content){
	  var uid = cpyth.utils.id()
	  document.getElementById("content-codemirror-tabs").innerHTML += "<div class='tab' data-special='content-codemirror-container-" + id + "' data-id='t" + uid +"'>" + name + "</div>";
	  var elem = document.createElement("div")
	  elem.setAttribute('id',"content-codemirror-container-" + id)
	  elem.setAttribute('hidden','');
	  elem.innerHTML = content;
	  document.getElementById("content-codemirror-container").appendChild(elem);
	  var tabs = document.getElementById("content-codemirror-tabs").children
	  for(var i=0;i<tabs.length;i++){
		tabs[i].addEventListener("click",function(e){cpyth.ui.tabChange(e)},true);
		tabs[i].removeAttribute('data-open');
      }
	  cpyth.files.file.change('t'+uid)
	},
	file: {
	  open(path,name){
	    name = name.replace(/\.(?=[^.]*$)[\s\S]+/,"");
	    var namef = name.replace(/[\.\/]/g,"_");
		var node = cpyth.vars.files;
		if(path!=""){
		  var pathf = path.split(/[\/]/).filter(Boolean);
		  for(var i=0;i<pathf.length;i++){
		    if(node.content[pathf[i]]){
		      node = node.content[pathf[i]];
		    } else {
		      throw "path error";
		    }
		  };
		}
		var id = cpyth.utils.id();
		cpyth.files.saveOpen();
		document.getElementById("content-codemirror-tabs").innerHTML += "<div class='tab' data-special='false' data-path='" + path + "' data-file='" + name + "." + node.content[namef].type + "' data-id='t" + id +"'data-open>" + node.content[namef].name + "</div>";
		cpyth.vars.codemirror.setValue(node.content[namef].content);
		var tabs = document.getElementById("content-codemirror-tabs").children
		for(var i=0;i<tabs.length;i++){
		  tabs[i].addEventListener("click",function(e){cpyth.ui.tabChange(e)},true);
		  tabs[i].removeAttribute('data-open');
		}
		document.querySelector(".tab[data-id=t" + id + "]").setAttribute('data-open','');
		if(node.content[namef].readOnly){
		  document.querySelector(".tab[data-id=t" + id + "]").setAttribute('data-write','false')
		  cpyth.vars.codemirror.setOption("readOnly", true)
		} else {
		  document.querySelector(".tab[data-id=t" + id + "]").setAttribute('data-write','true')
		  cpyth.vars.codemirror.setOption("readOnly", false)
		}
		cpyth.vars.openTab = id;
	  },
	  change(tab){
	    if(document.querySelector(".tab[data-id=t" + cpyth.vars.openTab + "]").getAttribute("data-special") == 'false'){
	      cpyth.files.saveOpen();
		  document.querySelector(".tab[data-id=t" + cpyth.vars.openTab + "]").removeAttribute('data-open');
		  cpyth.vars.openTab = tab.replace(/t/,"");
		  var tab = document.querySelector("div[data-id=t" + cpyth.vars.openTab + "]");
		  tab.setAttribute('data-open','');
		  if(document.querySelector(".tab[data-id=t" + cpyth.vars.openTab + "]").getAttribute("data-special") == 'false'){
		    if(tab.getAttribute('data-write') == 'true'){
			  cpyth.vars.codemirror.setOption("readOnly", false)
			} else {
			  cpyth.vars.codemirror.setOption("readOnly", true)
			}
		    var content = cpyth.files.file.get(tab.getAttribute('data-path'),tab.getAttribute('data-file'));
		    if(content==undefined){content=""};
		    cpyth.vars.codemirror.setValue(content);
		  } else {
		    cpyth.vars.codemirror.getWrapperElement().setAttribute('hidden','');
			document.getElementById(tab.getAttribute('data-special')).removeAttribute('hidden')
		  }
		} else {
		  var ctab = document.querySelector(".tab[data-id=t" + cpyth.vars.openTab + "]");
		  ctab.removeAttribute('data-open');
		  cpyth.vars.openTab = tab.replace(/t/,"");
		  var ntab = document.querySelector("div[data-id=t" + cpyth.vars.openTab + "]");
		  ntab.setAttribute('data-open','');
		  document.getElementById(ctab.getAttribute('data-special')).setAttribute('hidden','')
		  if(ntab.getAttribute("data-special") == 'false'){
		    cpyth.vars.codemirror.getWrapperElement().removeAttribute('hidden');
			cpyth.vars.codemirror.refresh();
			var content = cpyth.files.file.get(ntab.getAttribute('data-path'),ntab.getAttribute('data-file'));
		    if(content==undefined)content="";
			cpyth.vars.codemirror.setValue(content);
		  } else {
			document.getElementById(ntab.getAttribute('data-special')).removeAttribute('hidden')
		  }
		}
	  },
	  create(path,name,ext,readOnly){
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
		if(readOnly){
		  node.content[namef].readOnly = true
		} else {
		  node.content[namef].readOnly = false
		}
		cpyth.files.display();
	  },
	  save(path,name,content){
	    path = path.replace(/\/$/,"");
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
		if(node.content[namef].readOnly){
		  throw "read only file"
		} else {
		  node.content[namef].content = content;
		}
	  },
	  set(path,name,content){
	    path = path.replace(/\/$/,"");
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
		node.content[namef].content = content;
	  },
	  remove(path,name){
	    document.getElementById("file-delete").setAttribute('hidden','')
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
	    document.getElementById("folder-delete").setAttribute('hidden','')
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
    if (window.location.protocol != "https:" && window.location.hostname != "localhost"){
      window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
	}
	cpyth.ui.setThemeDefault();
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
	document.getElementById("folderdelete").addEventListener("click",cpyth.ui.deleteFolder);
	document.getElementById("filenew").addEventListener("click",cpyth.ui.showFile);
	document.getElementById("foldernew").addEventListener("click",cpyth.ui.showFolder);
	document.getElementById("createfolder").addEventListener("click",cpyth.ui.createFolder);
	document.getElementById("tabopen").addEventListener("click",function(){cpyth.files.file.open(cpyth.vars.path,cpyth.vars.file)});
	document.getElementById("createfile").addEventListener("click",cpyth.ui.createFile);
	document.getElementById("filedelete").addEventListener("click",cpyth.ui.deleteFile);
	document.getElementById("tabclose").addEventListener("click",cpyth.files.closeOpen);
	document.getElementById("import").addEventListener("change",function(e){cpyth.files.importZip(e)},true);
	document.getElementById("import-new").addEventListener("change",function(e){cpyth.files.importZip(e)},true);
	document.getElementById("export").addEventListener("click",cpyth.files.exportZip);
	document.getElementById("blank").addEventListener("click",cpyth.ui.blankProj);
	document.getElementById("file-delete").addEventListener("click",function(){cpyth.files.file.remove(cpyth.vars.path,cpyth.vars.file)},true)
	document.getElementById("folder-delete").addEventListener("click",function(){cpyth.files.folder.remove(cpyth.vars.path)},true);
	document.getElementById("content-console-input-text").addEventListener("keydown",function(e){cpyth.ui.input(e)},true);
	cpyth.files.init();
	setInterval(cpyth.utils.documentResize,50);
  }
};
function exec(data){
  cpyth.console.info("Input: " + data);
}
window.onload = function(){
  cpyth.init();
}