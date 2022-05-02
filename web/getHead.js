fetch(serverURL+"/user/me", {
	method: "get",
	headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + token
	}
})
.then(function(response){
	if(response.status == 403){
window.location.href = "login.html";
return;
	} 
response.json().then(function(json){
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