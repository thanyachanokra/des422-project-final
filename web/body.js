var contentList = [];
fetch(serverURL+"/content/"+contentType, {
	method: "get",
	headers: {
		'Content-Type': 'application/json'
	}
})
.then(function(response){
	response.json().then(function(json){
		var data = json;
		var div = document.createElement("div");
		div.setAttribute("class","container-fluid");
		content.innerHTML = "";
		for(var i = 0; i < data.length; i++){
			var div2 = document.createElement("div");
			div2.setAttribute("id", data[i]['id']);
			var contentTitle = document.createElement("h1");
			contentTitle.innerHTML = data[i]['title'];
			var contentBody = document.createElement("h3");
			contentBody.innerHTML = data[i]['content'];
			var lineBreak = document.createElement("br");
			div2.appendChild(contentTitle);
			div2.appendChild(contentBody);
			div2.appendChild(lineBreak);
			for (var j =0;j<data[i]['file'].length;j++){
				var contentFile = document.createElement("img");
				contentFile.setAttribute("src", data[i]['file'][j]['path']);
				contentFile.setAttribute("alt", data[i]['file'][j]['description']);
				contentFile.setAttribute("width", 300);
				div2.appendChild(contentFile);
			}
			div2.style.paddingBottom = "80px";
			div.appendChild(div2);
			contentList.push(div2);
		}
		content.appendChild(div);
	})
})
fetch(serverURL+"/user/me", {
	method: "get",
	headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + token
	}
})
.then(function(response){
	if(response.status == 403){
			head.innerHTML = `
				<img src="./files/747720.png" alt="Test Logo" size="200px" width="200px">
				<h1>Welcome</h1>
			`;
return;
	} 
response.json().then(function(json){
		for(var i=0;i<contentList.length;i++){
			var div = document.createElement("div");
			var edit = document.createElement("button");
			edit.setAttribute("onClick", "redirect('edit.html?contentType="+contentType+"&id="+contentList[i].getAttribute("id")+"')");
			edit.style.fontSize = "20px";
			edit.style.paddingLeft = "10px";
			edit.style.paddingRight = "10px";
			edit.innerHTML = "Edit";
			div.style.paddingTop = "30px";
			div.appendChild(edit);
			div.style.paddingBottom = "10px";
			contentList[i].appendChild(div);

			var div = document.createElement("div");
			var del = document.createElement("button");
			del.setAttribute("onClick", "handleContentDelete("+contentList[i].getAttribute("id")+")");
			del.style.fontSize = "20px";
			del.style.paddingLeft = "10px";
			del.style.paddingRight = "10px";
			del.innerHTML = "Delete";
			div.appendChild(del);
			contentList[i].appendChild(div);
		}
var name = json.username;
			head.innerHTML = `
			<style>
				.button	{
					color: black;
					font-size: 20px;
					padding-left: 10px;
					padding-right: 10px;
				}
			</style>
			<img src="./files/747720.png" alt="Test Logo" size="200px" width="200px">
			<h1>Welcome `+name+`</h1><br>
			<button class="button" onClick="handleLogout()">Logout</button>&nbsp;
			<button class="button" onClick="redirect('add.html?contentType=`+contentType+`')">Add Content</button>
			`;
})
})