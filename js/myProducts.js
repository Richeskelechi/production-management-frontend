checkToken();
if (userToken) {
    const url = "https://productmanagementapi.herokuapp.com/api/v1/myProduct";
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + userToken.UserToken);
    const request = new Request(url, {
        method: "GET",
        headers: headers
    });
    fetch(request)
        .then(response => response.json())
        .then(data => {
            if (data.status == 200 && data.data.length > 0) {
                createProduct(data)
            } else {
                document.getElementById("load").innerHTML = "No Product Found For This Location";
                document.getElementById("load").style.color = "red";
            }
        })
        .catch(error => {
            console.log(error);
            document.getElementById("load").innerHTML = "Error Fetching Data!!. Try Again Later";
            document.getElementById("load").style.color = "red";

        }
        );
}

createProduct = function (data) {
    data = data.data;
    for (let i = data.length - 1; i >= 0; i--) {
        let part = data[i].productComment.substring(0, 27) + "...";
        document.getElementById("productBag").innerHTML += `
        <div class="card" style="width: 18rem; float:left; margin:15px">
            <img src="https://res.cloudinary.com/riches/image/upload/${data[i].productImage}.jpg" class="card-img-top" alt="${data[i]._id}" style="height:130px">
            <div class="card-body">
                <h5 class="card-title">${data[i].productName}</h5>
                <p class="card-text">${part}</p>
                <p class="card-text" style="float:right">${data[i].productLocation}</p>
                <a href="./singleProduct.html?id=${data[i]._id}" class="btn btn-primary">Go To Product Page</a>
            </div>
        </div>
        `;
    }
    document.getElementById("load").style.display = "none";
    document.getElementById("productBag").style.display = "inline-block";
}