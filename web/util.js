function handleLogout(){
window.localStorage.clear();
window.localStorage.removeItem("DES422-token");
window.location.href = contentType+".html";
}

function handleLogoutForGetHead(){
window.localStorage.clear();
window.localStorage.removeItem("DES422-token");
window.location.href = "home.html";
}

function redirect(path){
	window.location.href = path;
}

function handleContentDelete(id){
fetch(serverURL+"/content/delete/"+contentType+"/"+id, {
method: "delete",
headers:{
"Content-Type": "application/json",
"Authorization": "Bearer "+token
}
})
.then(function(response){
if (response.status == 403){
window.location.href = "login.html";
return;
}
response.json().then(function(json){
window.location.href = contentType+".html";
})
})
}