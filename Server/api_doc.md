# fancy-todo-server
**Achmad Wahyu pratama**
*Hacktiv8 RMT-011*

## POST /register
* Request Header
   
    None

* Request Body 

    ```
    { 
        "email": "<body.email>",
        "password": "<body.password>"
    }
    ```

* Success Response:

    * Code: 201
    * Content:
        ```
        { 
            "id": "<User.email>",
            "email": "<User.email>"
        }
        ```
    
* Error Responses:

    Code:400 EMAIL UNIQUE CONSTRAINT ERROR
    * Content:
        ```
        { "errors": [ { "message": "This email has been registered" } ] }
        ```

    Code:400 VALIDATION ERROR
    * Content:
        ```
        { "errors": [ { "message": "<key> required" } ] }
        ```

    Code: 500 INTERNAL SERVER ERROR
    * Content:
        ```
        { "errors":  { "message": "Internal server error" }  }
        ```


## POST /login
* Request Header
   
    None

* Request Body 

    ```
    { 
        "email": "<body.email>",
        "password": "<body.password>"
    }
    ```

* Success Response:

    * Code: 200
    * Content:
        ```
        { 
            id: "<user.id>",
            email: "<user.email>"
            acces_token: "<user.token...>"
        }
        ```
    
* Error Responses:

    Code:404 NOT FOUND ERROR (change status to 400:VALIDATION ERROR for security reason)
    * Content:
        ```
        { "errors":  { "message": "invalid email and password" }  }
        ```

    Code:400 VALIDATION ERROR
    * Content:
        ```
        { "errors": [ { "message": "invalid email and password" } ] }
        ```

    Code: 500 INTERNAL SERVER ERROR
    * Content:
        ```
        { "errors":  { "message": "Internal server error" }  }
        ```


## POST /googlelogin
* Request Header
   
    None

* Request Body 

    ```
    { 
        "googleIdToken": "<body.idToken>"
    }
    ```

* Success Response:

    * Code: 200
    * Content:
        ```
        { 
            acces_token: "<user.token...>"
        }
        ```
    
* Error Responses:

    Code: 500 INTERNAL SERVER ERROR
    * Content:
        ```
        { "errors":  { "message": "Internal server error" }  }
        ```


## POST /todos
* Request Header
   
    ```
    { 
        "access_token": "<user jwtoken>"
    }
    ```

* Request Body 

    ```
    { 
        "title": <body.title>,
        "description": <body.description> ,
        "location": <body.location>,
        "status": <body.status>,
        "due_date": <body.due_date>
    }
    ```

* Success Response:

    * Code: 201
    * Content:
        ```
        { 
            "id": 1,
            "title": "creating todos",
            "description": "creating todos with description, status, due date, " ,
            "location": "Jakarta",
            "status": "undone",
            "due_date": "2021-04-27"
        }
        ```
    
* Error Responses:

    Code:400 VALIDATION ERROR
    * Content:
        ```
        { "errors": [ { "message": "<key> required" } ] }
        ```

    Code: 500 INTERNAL SERVER ERROR
    * Content:
        ```
        { "errors":  { "message": "Internal server error" }  }
        ```



## GET /todos
* Request Header
   
    ```
    { 
        "access_token": "<user jwtoken>"
    }
    ```

* Request Body 
    
    None

* Success Response:

    * Code: 200
    * Content:
        ```
        [
            { 
                "id": 1,
                "title": "creating todos",
                "description": "creating todos with description, status, due date, " ,
                "location": "Jakarta",
                "status": "undone",
                "due_date": "2021-04-27",
                "weather": <currentweather returned from 3rd party api>
            },
            ...
        ]
        ```

* Error Responses:

    Code:500 INTERNAL SERVER ERROR
    * Content:
        ```
        { "errors":  { "message": "Internal server error" }  }
        ```

## GET /todos/:id
* Request Header
   
    ```
    { 
        "access_token": "<user jwtoken>"
    }
    ```

* Request Param
   * id : integer

* Request Body

    None

* Success Response:

    * Code: 200
    * Content:
        ```
        { 
            "id": <params.id>,
            "title": "creating todos",
            "description": "creating todos with description, status, due date, " ,
            "location": "Jakarta",
            "status": "undone",
            "due_date": "2021-04-27",
            "weather": <currentweather returned from 3rd party api>
        }
        ```

* Error Responses:

    Code:404 NOT FOUND ERROR
    * Content:
        ```
        { "errors":  { "message": "Data not found" }  }
        ```


## PUT /todos/:id
* Request Header
   
    ```
    { 
        "access_token": "<user jwtoken>"
    }
    ```

* Request Param
   * id : integer

* Request Body 

    ```
    { 
        "title": "updating todos",
        "description": "updating todos with description, status, due date, " ,
        "location": "Jakarta",
        "status": "undone"
        "due_date": "2021-04-28"
    }
    ```
   

* Success Response:

    * Code: 200
    * Content:
        ```
        { 
            "id": <params.id>,
            "title": "updating todos",
            "description": "updating todos with description, status, due date, " ,
            "location": "Jakarta",
            "status": "undone"
            "due_date": "2021-04-28"
        }
        ```

* Error Responses:

    Code:404 NOT FOUND ERROR
    * Content:
        ```
        { "errors":  { "message": "Data not found" }  }
        ```

    Code:400 VALIDATION ERROR
    * Content:
        ```
        { "errors": [ { "message": "Invalid input" } ] }
        ```

    Code: 500 INTERNAL SERVER ERROR
    * Content:
        ```
        { "errors":  { "message": "Internal server error" }  }
        ```


## PATCH /todos/:id
* Request Header
   
    ```
    { 
        "access_token": "<user jwtoken>"
    }
    ```

* Request Param
   * id : integer

* Request Body 
    ```
    { 
        "status": "<req.body.status>"
    }
    ```
   

* Success Response:

    * Code: 200
    * Content:
        ```
        { 
            "id": <params.id>,
            "title": "updating todos",
            "description": "updating todos with description, status, due date, " ,
            "location": "Jakarta",
            "status": "done"
            "due_date": "2021-04-28"
        }
        ```

* Error Responses:

    Code:404 NOT FOUND ERROR
    * Content:
        ```
        { "errors":  { "message": "Data not found" }  }
        ```

    Code:400 VALIDATION ERROR
    * Content:
        ```
        { "errors": [ { "message": "Invalid input" } ] }
        ```

    Code: 500 INTERNAL SERVER ERROR
    * Content:
        ```
        { "errors":  { "message": "Internal server error" }  }
        ```




## DELETE /todos/:id
* Request Header
   
    ```
    { 
        "access_token": "<user jwtoken>"
    }
    ```


* Request Params 

   * Id : integer


* Request Body 

    None


* Success Response:

    * Code: 200
    * Content:
        ```
        { "message" : 'todo success to delete' }
        ```


* Error Responses:

    Code:404 NOT FOUND ERROR
    * Content:
        ```
        { "errors":  { "message": "Data not found" }  }
        ```

    Code: 500 INTERNAL SERVER ERROR
    * Content:
        ```
        { "errors":  { "message": "Internal server error" }  }
        ```

## 3rdParty API:
* weather api from : openweathermap api (https://openweathermap.org/)



