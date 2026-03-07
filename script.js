/* sign in js code start here */
const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", function(){

const username = document.getElementById("input-name").value;
const password = document.getElementById("input-pin").value;

if(username === "admin" && password === "admin123"){
    alert("Login Successful");
    window.location.href = "home.html";
}
else{
    alert("Wrong Username or Password");
}
});
/* sign in js code end here */