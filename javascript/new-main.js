var cpyth = {
  vars: {
    codemirror:""
  },
  utils: {
    ajax(method="GET",url="/",cont=function(){},head="") {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function(){cont(xhttp.responseText)};
      xhttp.open(method, url, true);
      xhttp.send();
    }
  },
  console: {
    codeError(message){
      var node = document.createElement("p");
      var textnode = document.createTextNode(message);
      node.appendChild(textnode);
	  node.setAttribute("class","error");
      document.getElementById("content-console-output-main").appendChild(node);
    },
    codeWarning(message){
      var node = document.createElement("p");
      var textnode = document.createTextNode(message);
      node.appendChild(textnode);
	  node.setAttribute("class","warning");
      document.getElementById("content-console-output-main").appendChild(node);
    },
    codeInfo(message){
      var node = document.createElement("p");
      var textnode = document.createTextNode(message);
      node.appendChild(textnode);
	  node.setAttribute("class","info");
      document.getElementById("content-console-output-main").appendChild(node);
    },
    codeText(message){
      var node = document.createElement("p");
      var textnode = document.createTextNode(message);
      node.appendChild(textnode);
      node.setAttribute("class","text");
      document.getElementById("content-console-output-main").appendChild(node);
	}
  },
  init() {
    var host = document.getElementById("content-codemirror-container");
    cpyth.vars.codemirror = CodeMirror(host,{lineNumbers: true,viewportMargin:Infinity,fixedGutter:true});
	cpyth.console.codeText("Welcome to the CPyth online interpreter.");
  }
};
window.onload = function(){
  cpyth.init();
}