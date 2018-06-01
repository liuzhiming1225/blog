function addLoadEvent(func){
	var oldonload = window.onload;
	if(typeof window.onload != 'function'){
		window.onload = func;
	}else{
		window.onload = function(){
			oldonload();
			func();
		}
	}
}

function insertAfter(newElement,targetElement){
	var parent = targetElement.parentNode;
	if(parent.lastChild == targetElement){
		parent.appendChild(newElement);
	}else{
		parent.insertBefore(newElement,targetElement.nextSibling);
	}
}

function addClass(element,value){
	if(!element.className){
		element.className = value;
	}else{
		newClassName = element.className;
		newClassName += " ";
		newClassName += value;
		element.className = newClassName;
	}
}

function highlightPage(){
	if(!document.getElementsByTagName) return false;
	if(!document.getElementById) return false;
	var headers = document.getElementsByTagName('header');
	if(headers.length == 0) return false;
	var navs = headers[0].getElementsByTagName('nav');
	if(navs.length == 0) return false;
	var links = navs[0].getElementsByTagName('a');
	var linkurl;
	for (var i=0;i<links.length;i++){
		linkurl = links[i].getAttribute("href");
		if(window.location.href.indexOf(linkurl) != -1){
			links[i].id = "here";
			var linktext = links[i].lastChild.nodeValue.toLowerCase();
			document.body.setAttribute("id",linktext);
		}
	}
}

function showSection(id){
	var sections = document.getElementsByTagName("section");
	for(var i=0;i<sections.length;i++){
		if(sections[i].getAttribute("id") != id){
			sections[i].style.display = "none";
		}else{
			sections[i].style.display = "block";
		}
	}
}

function prepareInternalnav(){
	if(!document.getElementsByTagName) return false;
	if(!document.getElementById) return false;
	var articles = document.getElementsByTagName("article");
	if(articles.length == 0) return false;
	var navs = articles[0].getElementsByTagName("nav");
	if(navs.length == 0) return false;
	var nav = navs[0];
	var links = nav.getElementsByTagName("a");
	for(var i =0;i<links.length;i++){
		var sectionId = links[i].getAttribute("href").split("#")[1];
		if(!document.getElementById(sectionId)) continue;
		document.getElementById(sectionId).style.display = "none";
		links[i].destination = sectionId;
		links[i].onclick = function(){
			showSection(this.destination);
		}
	}
}

function prepareGallery(){
	if(!document.getElementsByTagName) return false;
	if(!document.getElementById) return false;
	if(!document.getElementById("imagegallery")) return false;
	var galelry = document.getElementById("imagegallery");
	var links = galelry.getElementsByTagName("a");
	for(var i=0;i < links.length;i++){
		links[i].onclick = function(){
			return showPic(this);
		}
	}
}

function showPic(whichpic){
	if(!document.getElementById("placeholder")) return false;
	var source = whichpic.getAttribute("href");
	var placeholder = document.getElementById("placeholder");
	placeholder.setAttribute("src",source);
	if(document.getElementById("description")){
		var text = whichpic.getAttribute("title") ? whichpic.getAttribute("title") : "";
		var description = document.getElementById("description");
		if(description.firstChild.nodeType == 3){
			description.firstChild.nodeValue = text;
		}
	}
	return false;
}

function preparePlaceholder(){
	if(!document.createElement) return false;
	if(!document.createTextNode) return false;
	if(!document.getElementById) return false;
	if(!document.getElementById("imagegallery")) return false;
	var placeholder = document.createElement("img");
	placeholder.setAttribute("id","placeholder");
	placeholder.setAttribute("src","images/hurbe.jpg");
	placeholder.setAttribute("alt","my image gallery");
	var description = document.createElement("p");
	description.setAttribute("id","discription");
	var dectext = document.createTextNode("Please choose a picture");
	description.appendChild(dectext);
	var gallery = document.getElementById("imagegallery");
	insertAfter(description,gallery);
	insertAfter(placeholder,description);
}

function stripeTable(){
	if(!document.getElementsByTagName) return false;
	var tables = document.getElementsByTagName("table");
    for(var i=0;i<tables.length;i++){
    	var odd = false;
    	var rows = tables[i].getElementsByTagName("tr");
    	for(var j=0;j<rows.length;j++){
    		if(odd==true){
    			addClass(rows[j],"odd");
    			odd = false;
    		}else{
    			odd = true;
    		}
    	}
    }
}

function highlightRows(){
	if(!document.getElementsByTagName) return false;
	var rows = document.getElementsByTagName("tr");
	for(var i=0;i<rows.length;i++){
		rows[i].oldClassName = rows[i].className;
		rows[i].onmouseover = function(){
			addClass(this,"highlight");
		}
		rows[i].onmouseout = function(){
			this.className = this.oldClassName;
		}
	}
}

function displayAbbreviations(){
	if(!document.getElementsByTagName|| !document.createElement|| !document.createTextNode) return false;
	var abbreviations = document.getElementsByTagName("abbr");
	if(abbreviations.length<1) return false;
	var defs = new Array();
	for (var i = 0;i<abbreviations.length;i++) {
		var current_abbr = abbreviations[i];
		if(current_abbr.childNodes.length<1) continue;
		var definition = current_abbr.getAttribute("title");
		var key = current_abbr.lastChild.nodeValue;
		defs[key] = definition;
	}
	var dlist = document.createElement("dl");
	for(key in defs){
		var definition = defs[key];
		var dtitle = document.createElement("dt");
		var dtitle_text = document.createTextNode(key);
		dtitle.appendChild(dtitle_text);
		var ddesc = document.createElement("dd");
		var ddesc_text = document.createTextNode(definition);
		ddesc.appendChild(ddesc_text);
		dlist.appendChild(dtitle);
		dlist.appendChild(ddesc);
	}
	if(dlist.childNodes.length<1) return false;
	var header = document.createElement("h3");
    var header_text = document.createTextNode("abbreviations");
    header.appendChild(header_text);
    var articles = document.getElementsByTagName("article");
    if(articles.length<1) return false;
    var container = articles[0];
    container.appendChild(header);
    container.appendChild(dlist);
}

function getHTTPObject(){
	if(typeof XMLHttpRequest == "undefined")
		XMLHttpRequest = function(){
			try{return new ActiveXobject("Msxml2.XMLHTTP.6.0");}
			catch (e){}
			try{return new ActiveXobject("Msxml2.XMLHTTP.3.0");}
			catch (e){}
			try{return new ActiveXobject("Msxml2.XMLHTTP");}
			catch (e){}
			return false;
		}
		return new XMLHttpRequest();
}

function submitFormWithAjax(whichform, thetarget){
	var request  = getHTTPObject();
	if(!request) return false;
	var dataParts = [];
	var element;
	for(var i =0;i<whichform.elements.length;i++){
		element = whichform.elements[i];
		dataParts[i] = element.name+'='+encodeURIComponent(element.value);
	}
	var data = dataParts.join("&");
	request.open('post',whichform.getAttribute("action"),true);
	request.setRequestHeader("Content-type","applocation/x-www-form-urlencode");
	request.onreadystatechange = function(){
		if(request.readyState == 4){
			if(request.status == 200||request.status == 0){
				var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/);
				if(matches.length>0){
					thetarget.innerHTML = matches[1];
				}else{thetarget.innerHTML = "<p>ERROR</p>";
				}
			}else{
				thetarget.innerHTML = '<p>'+request.statusText+'</p>';
			}
		}
	};
	request.send(data);
	return true;
}

function prepareForms(){
	for(var i=0;i<document.forms.length;i++){
		var thisform = document.forms[i];
		thisform.onsubmit = function(){
			var article = document.getElementsByTagName("article")[0];
			if(submitFormWithAjax(this,article)) return false;
			return true;
		}
	}
}


addLoadEvent(highlightPage);
addLoadEvent(prepareInternalnav);
addLoadEvent(prepareGallery);
addLoadEvent(preparePlaceholder);
addLoadEvent(stripeTable);
addLoadEvent(highlightRows);
addLoadEvent(displayAbbreviations);
addLoadEvent(prepareForms);