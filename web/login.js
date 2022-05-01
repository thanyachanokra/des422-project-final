const username = document.getElementById("username");
const password = document.getElementById("password");
const login = document.getElementById("login");
const serverURL = "";
function handleLogin(){
	fetch("/user/login", {
		"method":"post",
		headers: {
			"Content-Type":"application/json"
		},
		body: JSON.stringify({
			"username": username.value,
			"password": password.value
		})
	})
	.then(function(response){
		response.json().then(function(json){
			if (json.hasOwnProperty("token")) {
				var token = json["token"];
				window.localStorage.setItem("DES422-token", token);
				window.location.href="home.html";
			}
		})
	})	
}
window.localStorage.removeItem("DES422-token");
login.addEventListener("click", handleLogin);