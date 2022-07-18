document.getElementById("loginForm").addEventListener("submit", loginUser);

function loginUser(event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,40}$/;
    if (email == "" || password == "") {
        errorMsg("Please Fill All Fields", "red")
    } else if (!emailFormat.test(email)) {
        errorMsg("Please Enter Valid Email", "red")
    } else if (!passwordFormat.test(password)) {
        errorMsg("Please Enter Valid Password Format", "red")
    } else {
        errorMsg("Please Wait", "yellow")
        document.getElementById("btn").disabled = true;
        let data = {
            email: email,
            password: password
        }
        // console.log(data);
        const url = "https://productmanagementapi.herokuapp.com/api/v1/login"
        axios({
            method: 'post',
            url: url,
            data: data,
        })
            .then(function (response) {
                // console.log(response.data);
                if (response.status == 200) {
                    setToken(response.data.userToken);
                    window.location.href = "./myProducts.html"
                } else {
                    errorMsg("Login Failed Try Again", "red")
                }
            }).catch(function (error) {
                // console.log(error);
                errorMsg(error.response.data.msg, "red")
            })
        document.getElementById("btn").disabled = false;
    }
}

errorMsg = (msg, color) => {
    document.getElementById("notice").innerHTML = msg;
    document.getElementById("notice").style.color = color;
}

setToken = (token) => {
    const now = new Date();
    const tokenDetails = {
        UserToken: token,
        expiry: now.getTime() + (60 * 60 * 1000),
    }
    localStorage.setItem('tokenDetails', JSON.stringify(tokenDetails))
}