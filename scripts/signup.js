//window.addEventListener('load', function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector("form");
    const inputNombre = document.querySelector("#inputNombre");
    const inputApellido = document.querySelector("#inputApellido");
    const inputEmail = document.querySelector("#inputEmail");
    const inputContrasena = document.querySelector("#inputPassword");
    const inputRepContrasena = document.querySelector("#inputPasswordRepetida");
    
    
    
    
    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre =  inputNombre.value;
        const apellido =  inputApellido.value;
        const email =  inputEmail.value;
        const contrasena =  inputContrasena.value;
        const repContrasena = inputRepContrasena.value;    
            
        
        if(!compararContrasenias(contrasena,repContrasena)){
            alert("las contrasenas son diferentes ");
        }

        const datos = {
                firstName: nombre,
                lastName: apellido,
                email: email,
                password: contrasena
        }  

        const config = {
            method: "POST",
            body: JSON.stringify( datos ),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }

        realizarRegister(config);
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        
        const endPoint = "https://todo-api.ctd.academy/v1/users"

        fetch(endPoint , settings)
        .then(response => response.json())
        .then(resp => {console.log(resp)

            if( resp.jwt){
            localStorage.setItem('jwt', JSON.stringify(resp.jwt) );
            location.replace('mis-tareas.html');

            } else {
            alert('Ups tenemos un error '+ resp);
            }
        })  .catch(error => error);
    };
//});
