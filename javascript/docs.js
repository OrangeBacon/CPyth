function search() {
  str = document.getElementById("search").value;
  str = str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  re = new RegExp(str,'i');
  el = document.getElementById('results').childNodes;
  for(var i = 0;i < el.length; i++){
    if(el[i].getAttribute('data-value').search(re)!=-1){
	  el[i].style.display = 'block';
	} else {
	  el[i].style.display = 'none';
	}
  }
}
setInterval(search,10)