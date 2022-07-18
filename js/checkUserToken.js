checkToken = function () {
    const now = new Date();
    userToken = JSON.parse(localStorage.getItem("tokenDetails"));
    if (userToken == null) {
        localStorage.removeItem("tokenDetails");
        window.location.href = "./index.html?err=Unauthorized Please Login";
    } else if (userToken.expiry < now.getTime()) {
        localStorage.removeItem("tokenDetails");
        window.location.href = "./index.html?err=Unauthorized Please Login";
    } else {
        return userToken.UserToken;
    }
}

document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("tokenDetails");
    window.location.href = "./index.html?err=Successfully Logged Out";
})