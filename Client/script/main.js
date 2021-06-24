const baseUrl = 'http://localhost:3000'

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
    $.ajax({
        url: baseUrl+'/googlelogin',
        method: 'POST',
        data: {
            idToken: id_token
        }
    }).done((response)=>{
        console.log(response);
        localStorage.setItem('access_token', response.access_token)
        showHome()
    }).fail((xhr)=>{
        console.log(xhr);
    })
  }

function showHome(){
    $(".page").hide()
    $("#button-login").hide()
    $("#button-home").show()
    $("#button-logout").show()
    $("#page-home").show()
    fetchTodos()

}

function loginPage(){
    $(".page").hide()
    $("#button-home").hide()
    $("#button-logout").hide()
    $("#page-login").show()
}

function registerPage(){
    $(".page").hide()
    $("#page-register").show()
}

function aboutPage(){
    $(".page").hide()
    $("#page-about").show()
    if ( localStorage.getItem('access_token') ) {
        $("#button-login").hide()
        $("#button-logout").show()
    } else {
        $("#button-login").show()
    }
}

function newTodoPage(){
    $(".page").hide()
    $("#page-new-todo").show()
}

function showEditTodo(todo){
    $(".page").hide()
    $("#page-edit-todo").show()
    editTodoForm(todo)
}

function loginForm(){
        const email = $('#login-email').val();
        const password = $('#login-password').val();
        $.ajax({
            url: baseUrl+'/login',
            method: 'POST',
            data: {
                email, password
            }
        }).done(dataUser => {
            localStorage.setItem('access_token', dataUser.access_token)
            showHome()
        }).fail(xhr => {
            console.log(xhr);
        })
}

function registerForm(){
        const email = $('#register-email').val();
        const password = $('#register-password').val();
        $.ajax({
            url: baseUrl+'/register',
            method: 'POST',
            data: {
                email, password
            }
        }).done((newUser)=>{
            loginPage()
        }).fail((xhr)=>{
            console.log(xhr);
        })

}

function logout(){
    localStorage.clear()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut()
    $('#button-login').show()
    loginPage()
}


function destroyTodo(id){
    $.ajax({
        url: baseUrl+'/todos/'+id,
        method: 'DELETE',
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    }).done((data)=>{
        showHome()
    }).fail((xhr)=>{
        console.log(xhr);
    })
}

function fetchTodos(){
    $.ajax({
        url: baseUrl+'/todos',
        method: 'GET',
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    }).done(data => {
        // console.log(data);
        $('.todos-cards').empty()
        data.forEach(todo => {
            $('.todos-cards').append(`
            <div class="col-md-4 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title text-capitalize">${todo.title}</h4>
                        <p class="card-text">${todo.description}</p>
                        <p class="card-text">At: ${todo.location}</p>
                        <p class="card-text">Status: ${todo.status}</p>
                        <p class="card-text">Should be done on ${todo.due_date}</p>
                        <p class="card-text">current weather in ${todo.location} is ${todo.weather}</p>
                        <button class="btn btn-primary btn-outline-light btn-dark btn-sm" type="button" onclick="putTodo(${todo.id})">Edit</button>
                        <button class="btn btn-primary btn-outline-light btn-dark btn-sm" type="button" onclick="patchTodo(${todo.id})">Change Status</button>
                        <button  class="btn btn-danger btn-outline-light btn-sm" onclick="destroyTodo(${todo.id})">Delete</button>
                    </div>
                </div>
            </div>
            `)
        })
    }).fail(xhr => {
        console.log(xhr);
    })
}

function putTodo(id){
    showEditTodo(id)
    $.ajax({
        url: baseUrl+'/todos/'+ id,
        method: 'GET',
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    }).done(data => {
        showEditTodo(data);
    }).fail(xhr => {
        console.log(xhr);
    })
}

function editTodoForm(todo){
    $("#edit-status").empty()
    $("#edit-page-title").text(`${todo.title}`)
    $("#edit-title").val(`${todo.title}`)
    $("#edit-desc").val(`${todo.description}`)
    $("#edit-due-date").val(`${todo.due_date}`)
    $("#edit-id").val(`${todo.id}`)
    $("#edit-location").val(`${todo.location}`)
    if (todo.status === "undone") {
        $("#edit-status").append(`
        <option value="undone" selected>undone</option>
        <option value="done">done</option>
        `)
    } else {
        $("#edit-status").append(`
        <option value="undone">undone</option>
        <option value="done" selected>done</option>
        `)
    }
}

function patchTodo(id){
    $.ajax({
        url: baseUrl+'/todos/'+ id,
        method: 'GET',
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    }).done(todo => {
        if (todo.status === 'undone') {
            $.ajax({
                url: baseUrl+'/todos/'+ id,
                method: 'PATCH',
                headers: {
                    access_token: localStorage.getItem('access_token')
                },
                data: {
                    status: "done"
                }
            }).done(data => {
                showHome()
            }).fail(xhr => {
                console.log(xhr);
            })
        } else {
            $.ajax({
                url: baseUrl+'/todos/'+ id,
                method: 'PATCH',
                headers: {
                    access_token: localStorage.getItem('access_token')
                },
                data: {
                    status: "undone"
                }
            }).done(data => {
                showHome()
            }).fail(xhr => {
                console.log(xhr);
            })   
        }
    }).fail(xhr => {
        console.log(xhr);
    })
}



$(document).ready(function(){
    if ( localStorage.getItem('access_token') ) {
        showHome()
    } else {
        loginPage()
    }
    $("#button-home").click(function(){
      showHome()
    });
    $("#button-login").click(function(){
      loginPage()
    });
    $("#button-register").click(function(){
      registerPage()
    });
    $("#button-about").click(function(){
      aboutPage()
    });
    $("#button-logout").click(function(){
      logout()
    });
    $("#button-add-todo").click(function(){
      newTodoPage()
    });
    $("#form-new-todo").submit((event)=>{
        event.preventDefault()
        const title = $("#add-title").val()
        const description = $("#add-desc").val()
        const status = $("#add-status").val()
        const due_date = $("#add-due-date").val()
        const location = $("#add-location").val()
        $.ajax({
            url: baseUrl+'/todos',
            method: 'POST',
            headers: {
                access_token: localStorage.getItem('access_token')
            },
            data : {
                title, description, status, due_date, location
            }
        }).done((newTodo)=>{
            showHome()
        }).fail((xhr)=>{
            console.log(xhr);
        })
    })
    
    $("#form-login").submit((event)=>{
        event.preventDefault()
        loginForm()
    })
    
    $("#form-register").submit((event)=>{
        event.preventDefault()
        registerForm()
    })

    $("#form-edit").submit((event)=>{
        event.preventDefault()
        const title = $("#edit-title").val()
        const description = $("#edit-desc").val()
        const status = $("#edit-status").val()
        const due_date = $("#edit-due-date").val()
        const id =  $("#edit-id").val()
        const location = $("#edit-location").val()
        $.ajax({
            url: baseUrl+'/todos/'+ id,
            method: 'PUT',
            headers: {
                access_token: localStorage.getItem('access_token')
            },
            data : {
                title, description, status, due_date, location
            }
        }).done((editedTodo)=>{
            showHome()
        }).fail((xhr)=>{
            console.log(xhr);
        })
    })
});