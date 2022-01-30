let usersArr;


async function getUsers() {
    const users = await fetch("https://invoicesapi20210913135422.azurewebsites.net/users").then(response => response.json())
    usersArr = users.value
}
const logInBtn = document.getElementById("login-btn");
logInBtn.addEventListener("click", function(e) {
    const userName = document.getElementById('username').value.toLowerCase()
    const password = document.getElementById('password').value
    const result = usersArr.filter(obj => {
        return obj.Name.toLowerCase() === userName && obj.Password === password
    });
    if(result.length) {
        localStorage.setItem('userId', result[0].UserId)
        localStorage.setItem('userName', result[0].Name)
        window.location.href = '/user-page/user.html'
     } else {
        document.getElementById('error').innerText = 'Incorrect username or password'
    }
});    
getUsers()