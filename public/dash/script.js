// Checking if the token is valid
if (localStorage.getItem("token") !== null) {
    axios({
        method: 'post',
        url: '/token/valid',
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

// Logout
function logout() {
    localStorage.removeItem("token")
    window.location.replace("/login");
}

// Tabs
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Create element for each filelist
axios({
    method: 'post',
    url: '/files/list',
    data: {
        'token': localStorage.getItem("token")
    }
}).then(function (response) {
    response.data.map( (file, index) => {
        // create an element
        $("#efs").append(`
        <div class="listitem" id="${index}">
        <th><a href="/${file}">${file}</a></th>
        <th><a filename="${file}" id="${index}" style="color: #ff5145;" class="dl">Delete</a></tf>
        </div>
        `)
    })
}).then(function () {
    checkifzero()
})

// Check if the filelist is zero
function checkifzero () {
    // Do nothing if more than zero, make element if over 0
    if ($('.listitem').length){}else{
        $("#efs").append(`
        <div style="color: #616161;" class="noexistlist">
        <p>You have not uploaded any files :(</p>
        </div>
        `)
    document.getElementById("filecount").remove();
    }
}

// Setting username upload
$( document ).ready(function() {
    axios({
        method: 'post',
        url: '/user/info',
        data: {
            'token': localStorage.getItem("token")
        }
    
    }).then(function (response) {
        window.usrname = response.data.username
        var totalfiles = response.data.filecount
    
        $("#file-subtitle").append(`
            <p>Uploads for user <b>${usrname}</b></p>
        `)

        if ($('#filecount').length > 0) {
            document.getElementById("filecount").innerHTML = `<p>Total user uploads: ${totalfiles}</p>`
        }
    })
});

// Checks filecount and resets value for each delete
function getFilecount () {
    axios({
        method: 'post',
        url: '/user/info',
        data: {
            'token': localStorage.getItem("token")
        }
    
    }).then(function (response) {
        var totalfiles = response.data.filecount

        if ($('#filecount').length > 0) {
            document.getElementById("filecount").innerHTML = `<p>Total user uploads: ${totalfiles}</p>`
        }
    })
};

$(document).on('click','#purgebutton', function(){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        html: 
        '<h1>Username</h1>' +
        '<input style="text-align: center;" id="usernamepurge" class="swal2-input">' +
        '<h1>Password</h1>' +
        '<input style="text-align: center;" id="passwordpurge" class="swal2-input">',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Purge'
      }).then((result) => {
        if (result.value) {
            username = document.getElementById("usernamepurge").value
            password = document.getElementById("passwordpurge").value
            axios({
                method: 'post',
                url: '/user/delete',
                data: {
                    'username': username,
                    'password': password
                }
            }).then(function (response) {
                localStorage.removeItem("token")
                Swal.fire({
                    title: 'Success',
                    text: "User has been purged from the system!",
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        window.location.replace('/')
                    }
                })
            }).catch(() => {
                Swal.fire({
                    title: 'Incorrect password!',
                    text: 'User was not purged from the system!',
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                })
            })
        }
      })
})


function login() {
    username = document.getElementById("usernamepurge").value
    password = document.getElementById("passwordpurge").value
    axios({
        method: 'post',
        url: '/user/delete',
        data: {
            'username': username,
            'password': password
        }
      }).then(function (response) {
        var token = response.data // Get user token
        localStorage.setItem('token', token); // Set user token in localstorage
        window.location.replace("/upload");
    }).catch(function (error) {
        if (!document.getElementById("errortext")) {
        // Sending error text
        var errortext = document.createElement("p"); 
        errortext.innerHTML = `<div style="margin-bottom: -20px; margin-top: 5px;"><p class="tag is-danger">${error.response.data}</p></div>`
        errortext.id = `errortext`
        errormessage.appendChild(errortext);
    
        // Sending breakline under text
        var breakline = document.createElement("br")
        errormessage.appendChild(breakline);
        }
    })
}

// Delete files
$(document).on('click','.dl', function(){
    var id = $(this).attr('id');
    var file = $(this).attr('filename');
    // make delete request with id

    axios({
        method: 'post',
        url: '/files/delete',
        data: {
            'token': localStorage.getItem("token"),
            'file': file
        }
    }).then(function () {
        document.getElementById(id).remove();
        checkifzero()
        getFilecount()
    })
})

// Reset token button
function resetToken() {
    axios({
        method: 'post',
        url: '/token/regen',
        data: {
            'token': localStorage.getItem("token")
        }
    }).then(function () {
        localStorage.removeItem("token")
        window.location.replace("/login");
    })
}

// Set token value
$( document ).ready(function(){
    document.getElementById("tokenval").innerHTML = `${localStorage.getItem("token")}`
})

function reset() {
    password = document.getElementById("passfield").value
    newpassword = document.getElementById("newpassfield").value

    axios({
        method: 'post',
        url: '/user/passreset',
        data: {
            'username': window.usrname,
            'password': password,
            'newpassword': newpassword
        }
      }).then(function() {
        
        if ($('#errortext').length > 0) {
            document.getElementById("errortext").remove();
        }
        var errortext = document.createElement("p"); 
        errortext.innerHTML = `<div style="margin-bottom: -20px; margin-top: 5px;"><p class="tag is-link">Password has been reset!</p></div>`
        errortext.id = `errortext`
        errormessage.appendChild(errortext);

        // Sending breakline under text
        var breakline = document.createElement("br")
        errortext.appendChild(breakline);
        
      }).catch(function (error) {
        if ($('#errortext').length > 0) {
            document.getElementById("errortext").remove();
        }
        // Sending error text
        var errortext = document.createElement("p"); 
        errortext.innerHTML = `<div style="margin-bottom: -20px; margin-top: 5px;"><p class="tag is-danger">${error.response.data}</p></div>`
        errortext.id = `errortext`
        errormessage.appendChild(errortext);
    
        // Sending breakline under text
        var breakline = document.createElement("br")
        errortext.appendChild(breakline);
        
    })
}