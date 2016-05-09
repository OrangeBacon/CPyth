var cpyth = {
  vars: {
    codemirror:"",
	windowTemplate: '<div class="window" id="<id>"><div class="window-header"><div class="window-header-close" id="window-header-close"><p class="window-header-close-text" onclick="cpyth.window.closeWindow(<id>)">X</p></div><p class="window-header-title"><title></p></div><div class="window-content"><content></div><div class="window-corner" style="display:block"></div></div>',
	windows: [],
	files:{type:"folder",name:"root",content:{}}
  },
  utils: {
    ajax(method="GET",url="/",cont=function(){}) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(){if (xhttp.readyState == 4 && xhttp.status == 200) {cont(xhttp.responseText)}else{console.log("Ajax Error")}};
      xhttp.open(method, url, true);
      xhttp.send();
    },
	dragMoveListener (event) {
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
	}
  },
  files: {
    init(){
	  cpyth.files.folder.create("_lib");
	},
	render(){
	
	},
	save(){
	
	},
	load(){
	
	},
	pathSplit(path){
	  path = path.split(/[\/\.]/);
	  return path;
	},
	formatName(name){
	  name = name.toLowerCase();
	  name = name.replace(/\./,"");
	  return name;
	},
	file: {
	  open(path){
	    
	  },
	  close(tab){
	
	  },
	  create(path){
	    var loc = cpyth.files.pathSplit(path);
		path = cpyth.files.pathSplit(path);
		loc.splice(path.length-2,2);
		var node = cpyth.vars.files;
		for(var i=0;i <= loc.length;i++){
		  if(i == loc.length){
		    node.content[cpyth.files.formatName(path[path.length-2]+path[path.length-1])] = {type:path[path.length-1],name:path[path.length-2]+path[path.length-1],content:""};
		  } else {
		    node = node.content[loc[i]];
		  };
		};
		return 1;
	  },
	  save(path,content){
	    var loc = cpyth.files.pathSplit(path);
		path = cpyth.files.pathSplit(path);
		loc.splice(path.length-2,2);
		var node = cpyth.vars.files;
		for(var i=0;i <= loc.length;i++){
		  if(i == loc.length){
		    node.content[cpyth.files.formatName(path[path.length-2]+path[path.length-1])].content = content;
		  } else {
		    node = node.content[loc[i]];
		  };
		};
		return 1;
	  },
	  remove(path){
	    var loc = cpyth.files.pathSplit(path);
		path = cpyth.files.pathSplit(path);
		loc.splice(path.length-2,2);
		var node = cpyth.vars.files;
		for(var i=0;i <= loc.length;i++){
		  if(i == loc.length){
		    if(!node.content[cpyth.files.formatName(path[path.length-2]+path[path.length-1])]){
			  console.error("undefined path");
			}
		    delete node.content[cpyth.files.formatName(path[path.length-2]+path[path.length-1])];
		  } else {
		    node = node.content[loc[i]];
			if(!node.content[loc[i]]){
			  console.error("undefined path");
			}
		  }
		};
		return 1;
	  }
	},
	folder: {
	  create(path){
	    var loc = cpyth.files.pathSplit(path);
		path = cpyth.files.pathSplit(path);
		loc.splice(path.length-1,1);
		var node = cpyth.vars.files;
		for(var i=0;i <= loc.length;i++){
		  if(i == loc.length){
		    node.content[cpyth.files.formatName(path[path.length-1])] = {type:"folder",name:path[path.length],content:{}};
		  } else {
		    node = node.content[loc[i]];
			if(!node.content[loc[i]]){
			  console.error("undefined path");
			}
		  }
		};
		return 1;
	  },
	  remove(path){
	    var loc = cpyth.files.pathSplit(path);
		path = cpyth.files.pathSplit(path);
		loc.splice(path.length-1,1);
		var node = cpyth.vars.files;
		for(var i=0;i <= loc.length;i++){
		  if(i == loc.length){
		    if(!node.content[cpyth.files.formatName(path[path.length-1])]){
			  console.error("undefined path");
			}
		    delete node.content[cpyth.files.formatName(path[path.length-1])];
		  } else {
		    node = node.content[loc[i]];
			if(!node.content[loc[i]]){
			  console.error("undefined path");
			}
		  }
		};
		return 1;
	  }
	}
  },
  init() {
    var host = document.getElementById("content-codemirror-container");
    cpyth.vars.codemirror = CodeMirror(host,{lineNumbers: true,viewportMargin:Infinity,fixedGutter:true});
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
	cpyth.files.init();
	cpyth.files.file.open(4);
  }
};
window.onload = function(){
  cpyth.init();
}