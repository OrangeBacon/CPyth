function search(str) {
  str = str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  re = new RegExp(str,'i');
  console.log(re)
  el = document.getElementById('results').childNodes;
  console.log(el);
  for(var i = 0;i < el.length; i++){
    if(el[i].getAttribute('data-value').search(re)!=-1){
	  el[i].style.display = 'block';
	} else {
	  el[i].style.display = 'none';
	}
  }
}