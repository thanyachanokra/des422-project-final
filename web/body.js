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
		div.setAttribute("class","container-fluid bg-grey");
		content.innerHTML = "";
		for(var i = 0; i < data.length; i++){
			var div2 = document.createElement("div");
			div2.setAttribute("id", data[i]['id']);
			var contentTitle = document.createElement("h2");
			contentTitle.innerHTML = data[i]['title'];
			var contentBody = document.createElement("div");
			contentBody.innerHTML = data[i]['content'];
			div2.appendChild(contentTitle);
			div2.appendChild(contentBody);
for (var j =0;j<data[i]['file'].length;j++){
				var contentFile = document.createElement("img");
				contentFile.setAttribute("src", data[i]['file'][j]['path']);
contentFile.setAttribute("alt", data[i]['file'][j]['description']);
				contentFile.setAttribute("width", 400);
				contentFile.setAttribute("height", 400);
				div2.appendChild(contentFile);
			}
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
				<img src="./files/test_logo.png" alt="Test Logo" size="250px" width="250px">
				<h1>Welcome</h1>
			`;
return;
	} 
response.json().then(function(json){
		for(var i=0;i<contentList.length;i++){
			var div = document.createElement("div");
var edit = document.createElement("button");
edit.setAttribute("onClick", "redirect('edit.html?contentType="+contentType+"&id="+contentList[i].getAttribute("id")+"')");
edit.innerHTML = "Edit";
div.appendChild(edit);
contentList[i].appendChild(div);

			var div = document.createElement("div");
			var del = document.createElement("button");
del.setAttribute("onClick", "handleContentDelete("+contentList[i].getAttribute("id")+")");
			del.innerHTML = "Delete";
			div.appendChild(del);
contentList[i].appendChild(div);
		}
var name = json.username;
			head.innerHTML = `
				<img src="./files/test_logo.png" alt="Test Logo" size="250px" width="250px">
				<h1>Welcome `+name+`</h1>
				<button style="color:black;" onClick="handleLogout()">Logout</button>
				<button style="color:black;" onClick="redirect('add.html?contentType=`+contentType+`')">Add Content</button>
			`;
})
})