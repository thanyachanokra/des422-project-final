const serverURL = ""
var token = window.localStorage.getItem("DES422-token");
const content = document.getElementById("content");
var contentType = content.getAttribute("data-content-type");
const skip = document.getElementById("skip");
			const head = document.getElementById("head");
const menu = document.getElementById("menu");
skip.innerHTML = "<a class='skip-link screen-reader-text' href='#main'>Skip to content</a>";
menu.innerHTML = `
<div>
	<div id="myNavbar">
		<div class="nav navbar-nav center">
			<li><a href="home.html">HOME</a></li>
			<li><a href="about.html">ABOUT</a></li>
        	<li><a href="news.html">NEWS</a></li>
        	<li><a href="project.html">PROJECTS</a></li>
        	<li><a href="product.html">PRODUCTS</a></li>
        	<li><a href="contact.html">CONTACT US</a></li>
		</div>
	</div>
	</div>
`;
