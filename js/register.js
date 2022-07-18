document.getElementById("registerForm").addEventListener("submit", registerUser);

function registerUser(event) {
    event.preventDefault();
    let fullname = document.getElementById("fullname").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let country = document.getElementById("country").value;
    let state = document.getElementById("state").value;
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;
    let phonenoFormat = /^\+[1-9]{1}[0-9]{3,14}$/;
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,40}$/;
    if (fullname == "" || email == "" || phone == "" || country == "" || state == "" || password == "" || confirm == "") {
        errorMsg("Please Fill All Fields", "red")
    } else if (!emailFormat.test(email)) {
        errorMsg("Please Enter Valid Email", "red")
    } else if (!phone.match(phonenoFormat)) {
        errorMsg("Please Enter Valid Phone Number", "red")
    } else if (!passwordFormat.test(password)) {
        errorMsg("Please Enter Valid Password Format", "red")
    } else if (password != confirm) {
        errorMsg("Passwords Do Not Match", "red")
    } else {
        errorMsg("Saving Your Information. Please Wait", "yellow")
        document.getElementById("btn").disabled = true;
        let data = {
            fullname: fullname,
            email: email,
            phoneNumber: phone,
            country: country,
            state: state,
            password: password
        }
        const url = "https://productmanagementapi.herokuapp.com/api/v1/signup"
        axios({
            method: 'post',
            url: url,
            data: data,
        })
            .then(function (response) {
                // console.log(response);
                if (response.status == 201) {
                    errorMsg("Registration Successful. Redirecting in Few Seconds", "green")
                    window.location.href = "./index.html?msg=Registration Successful. Please Login"
                } else {
                    errorMsg("Registration Failed Try Again", "red")
                }
            }).catch(function (error) {
                errorMsg(error.response.data.msg, "red")
            })
        document.getElementById("btn").disabled = false;
    }
}

errorMsg = (msg, color) => {
    document.getElementById("notice").innerHTML = msg;
    document.getElementById("notice").style.color = color;
}