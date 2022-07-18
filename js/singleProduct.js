checkToken();
let Allcomments = []
let productID
if (userToken) {
    // getting a single product by ID 
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    productID = urlParams.get("id");
    if (productID) {
        const url = "https://productmanagementapi.herokuapp.com/api/v1/myProduct/" + productID
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
                if (data.status == 200) {
                    createProduct(data)
                    getComments(productID);
                } else {
                    document.getElementById("load").innerHTML = "No Product Found For This Location";
                    document.getElementById("load").style.color = "red";
                }
            })
            .catch(error => {
                console.log(error);
                document.getElementById("load").innerHTML = "Error Fetching Data!!. Try Again Later";
                document.getElementById("load").style.color = "red";

            });
    } else {
        window.location.href = "./myProducts.html?err=Please Select A Product";
    }

    // Replying A Comment 
    document.getElementById("replyForm").addEventListener("submit", replyForm);

    async function replyForm(event) {
        event.preventDefault();
        let productID = document.getElementById("productID").value;
        let productOwnerEmail = document.getElementById("productOwnerEmail").value;
        let productOwnerFullName = document.getElementById("productOwnerFullName").value;
        let productOwnerNumber = document.getElementById("productOwnerNumber").value;
        let reply = document.getElementById("reply").value;
        if (productID == "" || productOwnerEmail == "" || productOwnerFullName == "" || productOwnerNumber == "" || reply == "") {
            errorMsg("Please Do Enter A Reply For The Comment", "red")
        } else if (reply.length < 2) {
            errorMsg("Please Comment Must be More Than 2 Characters", "red")
        } else {
            errorMsg("Saving Your Information. Please Wait", "yellow")
            document.getElementById("btn").disabled = true;
            const url = 'https://productmanagementapi.herokuapp.com/api/v1/addComment';
            let data = {
                productId: productID,
                comment: reply,
                productOwnerEmail: productOwnerEmail,
                productOwnerFullName: productOwnerFullName,
                productOwnerNumber: productOwnerNumber,
            }
            try {
                const response = await axios({
                    method: "post",
                    url: url,
                    data: data,
                    headers: {
                        Authorization: `Bearer ${userToken.UserToken}`,
                    },
                });
                if (response.status == 201) {
                    Allcomments.push(response.data.data);
                    createComments(Allcomments);
                    document.getElementById("reply").value = "";
                    errorMsg("", "")
                } else {
                    errorMsg(response.data.msg, "red")
                }
            }
            catch (error) {
                console.log(error)
            };
            document.getElementById("btn").disabled = false;
        }
    }
}

createProduct = function (data) {
    data = data.data;
    document.getElementById("productBag").innerHTML += `
        <div class="card" style="width: 100%; float:left; margin:15px">
            <img src="https://res.cloudinary.com/riches/image/upload/${data.productImage}.jpg" class="card-img-top singleImage" alt="${data._id}" style="height:250px; width:500px; margin:10px auto">
            <div class="card-body">
                <h5 class="card-title" style="text-align:center">Product Name: ${data.productName}</h5>
                <p class="card-text" style="text-align:center">Product Comment: ${data.productComment}</p>
                <p class="card-text" style="text-align:center">Product Location: ${data.productLocation}</p>
                <a href="./myProducts.html" class="btn btn-primary">Go To All Product</a>
            </div>
        </div>
        `;
    document.getElementById("productID").value = data._id
    document.getElementById("productOwnerEmail").value = data.productOwnerEmail
    document.getElementById("productOwnerFullName").value = data.productOwner
    document.getElementById("productOwnerNumber").value = data.productOwnerNumber
    document.getElementById("load").style.display = "none";
    document.getElementById("productForm").style.display = "inline-block";
    document.getElementById("productBag").style.display = "inline-block";
}

errorMsg = (msg, color) => {
    document.getElementById("notice").innerHTML = msg;
    document.getElementById("notice").style.color = color;
}
async function getComments(productID) {
    const url = "https://productmanagementapi.herokuapp.com/api/v1/getComment/" + productID
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
                Allcomments = data.data;
                createComments(Allcomments)
            } else {
                document.getElementById("notice").innerHTML = "No Comment For This Product";
                document.getElementById("notice").style.color = "red";
            }
        })
        .catch(error => {
            console.log(error);
            document.getElementById("notice").innerHTML = "Error Fetching Datail. Try Again Later";
            document.getElementById("notice").style.color = "red";

        });
}
function createComments(data) {
    removeAllComments()
    data = data.reverse();
    data.forEach(element => {
        let dateObj = new Date(element.createdAt);
        let myDate = (dateObj.getUTCFullYear()) + "/" + (dateObj.getMonth() + 1) + "/" + (dateObj.getUTCDate() + 'At' + dateObj.getUTCHours() + ':' + dateObj.getUTCMinutes() + ':' + dateObj.getUTCSeconds());
        console.log(myDate);
        document.getElementById("house").innerHTML += `
        <div class="replyDiv">
            <p class="replyName"> ${element.userFullName}</p>
            <p class="replayComment">${element.comment}</p>
            <p class="replyDate">${myDate}</p>
        </div>
        `;
    }
    );
}

function removeAllComments() {
    const list = document.getElementById("house");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
}