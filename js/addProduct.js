checkToken();
if (userToken) {
    const api_key = "521576135955239"
    const cloud_name = "riches"
    document.getElementById("addProductForm").addEventListener("submit", addProductForm);

    async function addProductForm(event) {
        event.preventDefault();
        let productName = document.getElementById("productName").value;
        let productLocation = document.getElementById("productLocation").value;
        let productComment = document.getElementById("productComment").value;

        if (productName == "" || productLocation == "" || productComment == "") {
            errorMsg("Please Fill All Fields", "red")
        } else if (productComment.length < 15) {
            errorMsg("Please Comment Must be More Than 15 Characters", "red")
        } else {
            errorMsg("Saving Your Information. Please Wait", "yellow")
            document.getElementById("btn").disabled = true;
            // getting Signature
            const signatureResponse = await axios.get(`https://productmanagementapi.herokuapp.com/api/v1/get-signature`, {
                headers: {
                    Authorization: `Bearer ${userToken.UserToken}`,
                },
            })
            //getting signature Ends
            const data = new FormData()
            data.append('file', document.getElementById("productImage").files[0]);
            data.append("api_key", api_key)
            data.append("signature", signatureResponse.data.signature)
            data.append("timestamp", signatureResponse.data.timestamp)

            const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, data, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: function (e) {
                    console.log(e.loaded / e.total)
                }
            })

            const url = 'https://productmanagementapi.herokuapp.com/api/v1/addProduct';
            const formdata = {
                productName: productName,
                productLocation: productLocation,
                productComment: productComment,
                public_id: cloudinaryResponse.data.public_id,
                version: cloudinaryResponse.data.version,
                signature: cloudinaryResponse.data.signature
            }
            console.log(formdata);
            try {
                const response = await axios.post(`https://productmanagementapi.herokuapp.com/api/v1/addProduct`, formdata, {
                    headers: {
                        Authorization: `Bearer ${userToken.UserToken}`,
                    },
                });
                if (response.status == 201) {
                    window.location.href = "./myProducts.html?msg=Product Added Successfully"
                } else {
                    errorMsg(response.data.msg, "red")
                }
            }
            catch (error) {
                console.log('My Error ', error)
            };
            document.getElementById("btn").disabled = false;
        }
    }
}

errorMsg = (msg, color) => {
    document.getElementById("notice").innerHTML = msg;
    document.getElementById("notice").style.color = color;
}