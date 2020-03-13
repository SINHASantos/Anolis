// Declare variables
let infoapi

// Request to get info about api
axios({
    method: 'get',
    url: '/api/info'
}).then(function (response) {
    infoapi = response.data
})


// Checking if the token is valid
if (localStorage.getItem("token") !== null) {
    axios({
        method: 'post',
        url: '/api/token/valid',
        data: {
            'token': localStorage.getItem("token")
        }
    
    }).catch(function (error) {
        localStorage.removeItem("token")
        window.location.replace("/login");
    })
} else {
    window.location.replace("/login");
}

// Uploading with dropzone
$(document).ready(function () {
    $("#uploadbtn").dropzone({ 
        url: "/api/files/upload",
        paramName: "uploadFile",
        maxFilesize: infoapi.maxuploadsize,
        previewsContainer: '#uploadcontainer',
        previewTemplate: `
        <div id="tpl">
            <div class="cloader" id="loading_bar"><div class="loaderBar"></div></div>
            <div class="dz-error-message errorlist"><span data-dz-errormessage></span></div>
        </div>`,
        headers: {
            'token': localStorage.getItem("token")
        },
        init: function() {
            this.on("success", function(data) {
                var response = JSON.parse(data.xhr.response)
                $("#uploadcontainer").append(`<a href="${response.url}">${response.url}</a><br>` )
                document.getElementById("loading_bar").remove()
            }),
            this.on("error", function() {
                document.getElementById("loading_bar").remove()
            })
        }
    });
})