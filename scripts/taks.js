// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

const token = JSON.parse( localStorage.getItem("jwt") );
if(!token){
  location.replace("index.html");
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {
  
  /* ---------------- variables globales y llamado a funciones ---------------- */
  const btnCerrarSesion = document.querySelector("#closeApp");
  const formCrearTarea = document.querySelector(".nueva-tarea")
  const userName = document.querySelector(".user-info p");
  const inputTarea = document.querySelector("#nuevaTarea")
  obtenerNombreUsuario();
  consultarTareas();

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {

    if(confirm("seguro desea cerrar sesion?")){
        localStorage.removeItem("jwt");
        location.replace("index.html");

      }
  });

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
  
    const endPoint = "https://todo-api.ctd.academy/v1/users/getMe"

    const settings = {
        method: "GET",
        headers: {
          authorization: token
      }
    }
    
    fetch(endPoint , settings)
    .then(response => response.json())
    .then(resp => {console.log(resp)
          userName.textContent = `${resp.firstName} ${resp.lastName}`;
       
    })  .catch(error => error);


  };


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    const endPoint = "https://todo-api.ctd.academy/v1/tasks";

    const settings = {
      method: "GET",
      headers: {
        authorization: token,
      },

      };

      fetch( endPoint, settings)
      .then(response => response.json())
      .then(resp => {console.log(resp);
        renderizarTareas(resp);
      })



  };


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault();

    const endPoint = "https://todo-api.ctd.academy/v1/tasks";
    const datos = {
                    description: inputTarea.value,
                    completed: false
                  }

    inputTarea.value = "";

    const settings = {
          method: "POST",
          headers: {
            authorization: token,
            'Content-type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify( datos ),
    };

    fetch( endPoint, settings)
    .then(response => response.json())
    .then(resp => {console.log(resp);
      consultarTareas(resp);
    })
    
  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(settings) {
    const tareasPendientes = document.querySelector(".tareas-pendientes");
    const tareasTerminadas = document.querySelector(".tareas-terminadas");
    const cantFinalizadas = document.querySelector("#cantidad-finalizadas")
    
    
    let aux = 0;
    tareasPendientes.innerHTML = "";
    tareasTerminadas.innerHTML = "";
    cantFinalizadas.innerText = "0";

    settings.forEach(element => {
      const fecha = new Date(element.createdAt);

      if(element.completed){
        aux++; 
        tareasTerminadas.innerHTML += //html
                      `<li class="tarea">
                      <div class="hecha">
                        <i class="fa-regular fa-circle-check"></i>
                      </div>
                      <div class="descripcion">
                        <p class="nombre"> ${element.description}</p>
                        <div class="cambios-estados">
                          <button class="change incompleta" id="${element.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                          <button class="borrar" id="${element.id}"><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                      </div>
                    </li>`;
                    cantFinalizadas.innerText = aux;          
      }
      else{
        tareasPendientes.innerHTML += //html
                    `<li class="tarea">
                    <button class="change" id="${element.id}"><i class="fa-regular fa-circle"></i></button>
                    <div class="descripcion">
                      <p class="nombre"> ${element.description} </p>
                      <p class="timestamp"> ${fecha.toLocaleDateString()}</p>
                    </div>
                  </li>`;
      }
    });
    botonesCambioEstado();
    botonBorrarTarea();
  };

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
       const botones = document.querySelectorAll('.change');
    
    botones.forEach(btn => {
      btn.addEventListener('click', function(evento){
        //console.log('Se hizo click', evento.target);
                                        // contains('incompleta') retorna un true o false
        const terminada = evento.target.classList.contains('incompleta');
        const id = evento.target.id;
        const endpoint = 'https://todo-api.ctd.academy/v1/tasks/'+id;
        const datos = {
          completed: !terminada
        }

        const config = {
          method: 'PUT',
          body:  JSON.stringify( datos),
          headers: {
            authorization: token,
            'Content-type': 'application/json; charset=UTF-8'
          }
        }
      
        fetch(endpoint, config)
        .then( response => response.json())
        .then( json => {
          console.log(json);
          consultarTareas();
        })


    })
  })
}

/* -------------------------------------------------------------------------- */
/*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
/* -------------------------------------------------------------------------- */
function botonBorrarTarea() {
  
  const botones = document.querySelectorAll('.borrar');

 botones.forEach(element => {
   element.addEventListener("click", function(evento) {
    
     const id = evento.target.id;
     const endPoint = 'https://todo-api.ctd.academy/v1/tasks/'+id;

     const config = {
      method: "DELETE",
      headers: {
        authorization: token,
        'Content-type': 'application/json; charset=UTF-8'
      }
     }

     fetch(endPoint, config)
     .then( response => response.json())
     .then( resp => {
      console.log(resp);
      window.location.reload();  
     })
   })
   
 });

  
  
  
}
})