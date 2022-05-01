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
				<img src="./files/test_logo.png" alt="Test Logo" size="250px" width="250px">
				<h1>Welcome `+name+`</h1>
				<button style="color:black;" onClick="handleLogoutForGetHead()">Logout</button>
				<button style="color:black;" onClick="redirect('add.html?contentType=`+contentType+`')">Add Content</button>
			`;
})
})