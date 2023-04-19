window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector("form");
    const email = document.querySelector("#inputEmail")
    const password = document.querySelector("#inputPassword")


    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
    event.preventDefault();
        
    const datos = {   
            email: email.value,
            password: password.value
    }

    const settings = {
        method: "POST",
        body: JSON.stringify( datos ),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    }
        realizarLogin(settings);
    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {
       
    const endPoint = "https://todo-api.ctd.academy/v1/users/login";


    fetch(endPoint , settings)
    .then(response => response.json())
    .then(resp => {console.log(resp)
    
        if( resp.jwt){
            localStorage.setItem('jwt', JSON.stringify(resp.jwt) );
            location.replace('mis-tareas.html');

            } else {
            alert('Ups tenemos un error '+ resp);
            }
            
        }).catch(error => error)    
    };
});