let prohibirRegistro = false;
let sinHorarios = false;
async function autenticar() {
  if (Alumno == null || !Alumno.sesion) {
    if (sinHorarios && !admin) {
      await Swal.fire({
      icon: "warning",
      title: "¡Atención!",
      text: "No hay mas horarios disponibles hasta septimbre. Cualquier consulta, comunicarse por whatsapp",
      allowOutsideClick: false,
      allowEscapeKey: false,
      });
      window.location.href = "../";
      return;
    }
    
    Swal.fire({
      title: "¿Qué desea hacer?",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      },
      showDenyButton: true,
      confirmButtonText: "Iniciar Sesión",
      denyButtonText: "Registrarme",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "./IniciarSesion/IniciarSesion.html";
      } else if (result.isDenied) {
        const hoy = new Date();
        const fechaLimite = new Date(hoy.getFullYear(), 7, 17); // Mes 7 = agosto (0-indexed)
        if (prohibirRegistro && hoy < fechaLimite) {
          Swal.fire({
            icon: "warning",
            title: "No hay más espacio para reservas hasta el 25 de agosto. Consulte por Whatsapp",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            window.location.href = "../";
          });
          return;
        }
        else window.location.href = "./Registro/Registro.html";
      }
    });
  }
}

document.querySelector(".login").addEventListener("click", ()=>{
    if(Alumno == null || !Alumno.sesion){
        Swal.fire({
            title: "Que desea hacer?",
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            },
            showDenyButton: true,
              confirmButtonText: "Iniciar Sesion",
              denyButtonText: `Registrarme`
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "./IniciarSesion/IniciarSesion.html"
            } else if (result.isDenied) {
              window.location.href = "./Registro/Registro.html"
            }
          });
    }
    else{
        document.querySelector(".menu").style.display = "flex";
        let listaClases = document.querySelector(".menu").classList;
        if(!listaClases.contains("animate__zoomOutUp") && !listaClases.contains("animate__slideInDown")){
          listaClases.add("animate__slideInDown");
        }else if(listaClases.contains("animate__slideInDown")){
          listaClases.remove("animate__slideInDown");
          listaClases.add("animate__zoomOutUp");
        }else if(listaClases.contains("animate__zoomOutUp")){
          listaClases.remove("animate__zoomOutUp");
          listaClases.add("animate__slideInDown");
        }
    }
})

document.querySelector(".loginMovil").addEventListener("click", ()=>{
  if(Alumno == null || !Alumno.sesion){
    Swal.fire({
        title: "Que desea hacer?",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        },
        showDenyButton: true,
          confirmButtonText: "Iniciar Sesion",
          denyButtonText: `Registrarme`
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "./IniciarSesion/IniciarSesion.html"
        } else if (result.isDenied) {
          window.location.href = "./Registro/Registro.html"
        }
      });
    }else{
      document.querySelector(".menu").style.display = "flex";
      let listaClases = document.querySelector(".menu").classList;
      if(!listaClases.contains("animate__zoomOutUp") && !listaClases.contains("animate__slideInDown")){
        listaClases.add("animate__slideInDown");
      }else if(listaClases.contains("animate__slideInDown")){
        listaClases.remove("animate__slideInDown");
        listaClases.add("animate__zoomOutUp");
      }else if(listaClases.contains("animate__zoomOutUp")){
        listaClases.remove("animate__zoomOutUp");
        listaClases.add("animate__slideInDown");
      }
    }
})

function cerrarSesion(){
    sessionStorage.removeItem('persona');
    location.reload();
}