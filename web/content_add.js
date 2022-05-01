const title = document.getElementById("title");
const body = document.getElementById("body");
const file = document.getElementById("file");
const fileArea = document.getElementById("fileArea");
var fileList = [];
const type = document.getElementById("type");
const typeList = ["home", "product", "news", "project", "contact", "about"];
var description = [];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const contentTypeParameter = urlParams.get("contentType");
var filePath = [];

for (var i in typeList){
var option = document.createElement("option");
option.setAttribute("value", typeList[i]);
option.innerHTML = typeList[i];
if (typeList[i] == contentTypeParameter){
option.setAttribute("selected", "selected");
}
type.appendChild(option);
}

function handleAddFile(){
if (fileList.length > 0){
var data = new FormData()
for (var i=0;i<fileList.length;i++){
data.append('files', fileList[i]);
}
	fetch(serverURL+"/file/upload", {
		method: "post",
		headers:{
			"Authorization": "Bearer "+token
		},
		body: data
	})
	.then(function(response){
		if(response.status == 403){
window.location.href = "login.html";
			return;
		} 
		response.json().then(function(json){	
for (var i=0;i<json.length;i++){
json[i]['description'] = description[i].value;
filePath.push(json[i]);
}
handleAddContent();
})
})
} else if (fileList.length == 0){
handleAddContent();
}
}

function handleAddContent(){
fetch(serverURL+"/content/add/"+type.value, {
method: "post",
headers:{
"Content-Type": "application/json",
"Authorization": "Bearer "+token
},
body: JSON.stringify({
"title": title.value,
"content": body.value,
"file": filePath
})
})
.then(function(response){
if (response.status == 403){
window.location.href = "login.html";
return;
}
response.json().then(function(json){
window.location.href = type.value+".html";
})
})
}

function addFile(){
for (var i=0;i<file.files.length;i++){
fileList.push(file.files[i]);
}
showFile();
}

function removeFile(index){
fileList.splice(index, 1);
showFile();
}

function showFile(){
description = [];
fileArea.innerHTML = "";
for (var i=0;i<fileList.length;i++){
var div = document.createElement("div");
var label = document.createElement("label");
label.setAttribute("for", "file-"+(i+1));
label.innerHTML = fileList[i].name;
var input = document.createElement("input");
input.setAttribute("type", "text");
input.setAttribute("value", "");
input.setAttribute("id", "file-"+(i+1));
var remove = document.createElement("button");
remove.setAttribute("onClick", "removeFile("+i+")");
remove.innerHTML = "Remove "+fileList[i].name;
div.appendChild(label);
div.appendChild(input);
div.appendChild(remove);
fileArea.appendChild(div);
description.push(input);
}
}
file.addEventListener("change", addFile);