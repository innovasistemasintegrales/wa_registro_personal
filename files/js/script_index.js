$(document).ready(main);
function main(){
  let btnRegistrar = document.querySelector("#btnRegistrar");

  function registrarPersona() {
    let dni = document.querySelector("#dni").value;
    let nombres = document.querySelector("#nombres").value;
    let celular = document.querySelector("#celular").value;
    let grado = document.querySelector("#grado").value;
    let institucion = document.querySelector("#institucion").value;
    let descripcion = document.querySelector("#descripcion").value;
    let file = document.querySelector("#file").files[0];
  
    let rol = 2;
  
    if (!nombres || !dni || !celular || !grado || !institucion || !file) {
      alert("Todos los campos son obligatorios, incluido el archivo.");
      return;
    }
    if (dni.length !== 8) {
      alert("Ingrese un número de DNI válido.");
      return;
    }
    if (celular.length !== 9) {
      alert("Ingrese un número de celular válido.");
      return;
    }
    if (grado == "0") {
      alert("Seleccione su grado de instrucción");
      return;
    }
  
    const rand=()=>Math.random(0).toString(36).substr(2);
    const token=(length)=>(rand()+rand()+rand()+rand()).substr(0,length);
    let tokenData = token(5);
  
    let formData = new FormData();
    formData.append("dni", dni);
    formData.append("nombres", nombres);
    formData.append("celular", celular);
    formData.append("grado", grado);
    formData.append("institucion", institucion);
    formData.append("descripcion", descripcion);
    formData.append("file", file);     
    formData.append("token", tokenData);     
    formData.append("rol", rol);     
  
    fetch('https://registro.innovasistemas.pe/registrar', {
      method: 'POST',
      body: formData,     
    }).then(response => response.json()).then(data =>{
      console.log(data.status);
      
      if (data.status == 'success') {
        alert("Datos enviados correctamente...");
        return;
      }
      if(data.status == 'failure'){
        alert("Error al guardar datos, contactar con el administrador");
        return;
      }
      if (data.status == 'duplicate') {
        alert("Error: Esta persona ya se encuentra registrado en la base de datos");
        return;
      }
    });
    
  }
  
  
  btnRegistrar.addEventListener('click', () => {
    registrarPersona();
  })
}