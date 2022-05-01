const title = document.getElementById("title");
const body = document.getElementById("body");
const file = document.getElementById("file");
const originalFileArea = document.getElementById("originalFileArea");
const fileArea = document.getElementById("fileArea");
var fileList = [];
var filePath = [];
var originalPath = [];
var description = [];
var originalDescription = [];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const contentTypeParameter = urlParams.get("contentType");
const idParameter = urlParams.get("id");

function handleAddFile(){
updateOriginal();
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
handleEditContent();
})
})
} else if (fileList.length == 0){
handleEditContent();
}
}

function handleEditContent(){
fetch(serverURL+"/content/edit/"+contentTypeParameter+"/"+idParameter, {
method: "PATCH",
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
window.location.href = contentTypeParameter+".html";
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
function showOriginal(){
fetch(serverURL+"/content/"+contentTypeParameter+"/"+idParameter, {
method: "get",
headers: {
"Content-Type": "application/json",
"Authorization": "Bearer "+token
}
})
.then(function(response){
response.json().then(function(json){
title.value = json['title'];
body.value = json['content'];
originalPath = json['file'];
showOriginalFile();
})
})
}

function removeOriginalFile(index){
originalPath.splice(index, 1);
showOriginalFile();
}

function showOriginalFile(){
originalFileArea.innerHTML = "";
for (var i=0;i<originalPath.length;i++){
var div = document.createElement("div");
var label = document.createElement("label");
label.setAttribute("for", "file-"+(i+1));
label.innerHTML = originalPath[i].name;
var input = document.createElement("input");
input.setAttribute("type", "text");
input.setAttribute("value", originalPath[i]['description']);
input.setAttribute("id", "file-"+(i+1));
var remove = document.createElement("button");
remove.setAttribute("onClick", "removeOriginalFile("+i+")");
remove.innerHTML = "Remove "+originalPath[i].name;
div.appendChild(label);
div.appendChild(input);
div.appendChild(remove);
originalFileArea.appendChild(div);
originalDescription.push(input);
}
}

function updateOriginal(){
for (var i=0;i<originalPath.length;i++){
originalPath[i]['description'] = originalDescription[i].value
filePath.push(originalPath[i]);
}
}
showOriginal();
file.addEventListener("change", addFile);