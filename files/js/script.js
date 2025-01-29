let listadoGeneralPersonas = {};
document.addEventListener('DOMContentLoaded', () =>{
    fetch('https://registro.innovasistemas.pe/listar').then(response => response.json()).then(data => {

      listadoGeneralPersonas = data;

    });
})

document.addEventListener('DOMContentLoaded', () =>{
  /* Listado de registro */
  const initListarRegistro = () => {

    /* let listadoGeneralPersonas = {}; */
    const fragmento = document.createDocumentFragment();
    let cardReactivo = document.querySelector('#cardReactivo');
    let contenedorVerPersona = document.querySelector('#contenedorVerPersona');

    const templateRegistro = document.querySelector('#templateRegistro').content;
    const templateVerPersona = document.querySelector('#templateVerPersona').content;

    if(!cardReactivo || !templateRegistro || !contenedorVerPersona || !templateVerPersona) return;

    fetch('https://registro.innovasistemas.pe/listar').then(response => response.json()).then(data => {

      listadoGeneralPersonas = data;
      listarPersona();

    });

    function listarPersona() {
      cardReactivo.innerHTML = "";
    
      listadoGeneralPersonas.forEach((registro) => {
        
        if (registro.rol != 1) {
          templateRegistro.querySelector('.dni-registro').textContent = registro.dni;
          templateRegistro.querySelector('.nombre-registro').textContent = registro.nombres;
          templateRegistro.querySelector('.celular-registro').textContent = registro.telefono;
          templateRegistro.querySelector('.grado-registro').textContent = registro.grado_instruccion;
          templateRegistro.querySelector('.institucion-registro').textContent = registro.institucion;
          templateRegistro.querySelector('.fecha-registro').textContent = registro.fecha_registro;
          templateRegistro.querySelector('.descripcion-registro').textContent = registro.descripcion;
          if (registro.cv != null) {
            templateRegistro.querySelector('.cv-registro').innerHTML = `<span class=""><img src="/files/src/pdf_icono.png" alt="" width="20px"></span>`;
            templateRegistro.querySelector('.cv-registro').dataset.id = registro.cv;
          }else{
            templateRegistro.querySelector('.cv-registro').innerHTML = `<span class=""><img src="/files/src/error_pdf.jpg" alt="" width="20px"></span>`;
          }
          templateRegistro.querySelector(".btn-ver-registro").dataset.id = registro.dni;
    
          const clone = templateRegistro.cloneNode(true);
          fragmento.appendChild(clone);
          }
      });
      cardReactivo.appendChild(fragmento);
      
    }

    cardReactivo.addEventListener('click', e =>{
      if (e.target.classList.contains('btn-ver-registro')) {
        verPersona(e.target.parentElement);
        
        if ($('.modal-backdrop').is(':visible')) {
          $('.modal-backdrop').remove();
        }
        $('#modalVerPersona').modal("show");
      }
      e.stopPropagation();
    } )

    function verPersona(objeto) {
      contenedorVerPersona.innerHTML = "";
      
      let persona = listadoGeneralPersonas.find(data => data.dni === objeto.querySelector(".btn-ver-registro").dataset.id);
      console.log(persona.cv);
      
      templateVerPersona.querySelector(".dni-ver-persona").textContent = persona.dni;
      templateVerPersona.querySelector(".nombres-ver-persona").textContent = persona.nombres;
      templateVerPersona.querySelector(".celular-ver-persona").textContent = persona.telefono;
      templateVerPersona.querySelector(".grado-ver-persona").textContent = persona.grado_instruccion;
      templateVerPersona.querySelector(".institucion-ver-persona").textContent = persona.institucion;
      templateVerPersona.querySelector(".fecha-ver-persona").textContent = persona.fecha_registro;
      templateVerPersona.querySelector(".descripcion-ver-persona").textContent = persona.descripcion;
      if (persona.cv != null) {
        templateVerPersona.querySelector('.cv-ver-persona').innerHTML = `<a href="${persona.cv}" class="bi bi-search btn-ver-registro" target="_blank">&emsp;Ver CV</a>`;
      }else{
        templateVerPersona.querySelector('.cv-ver-persona').innerHTML = `<span class="bi bi-x-octagon btn-ver-registro bg-danger text-white">&emsp; No hay archivo</span>`;
      }

      const clone = templateVerPersona.cloneNode(true);
      fragmento.appendChild(clone);

      contenedorVerPersona.appendChild(fragmento);
    }
  }

  const initLogin = () => {
    const btnAcceso = document.querySelector("#btnAcceso");
    if (!btnAcceso) return;

    fetch('https://registro.innovasistemas.pe/listar').then(response => response.json()).then(data => {

      listadoGeneralPersonas = data;
    
    });

    function login() {
      let usuario = document.querySelector("#usuario").value;
      let password = document.querySelector("#password").value;
    
      if (usuario === "" || password === "") {
        alert("Complete los campos solicitados")
        return;
      } 
      console.log(listadoGeneralPersonas);
      
      let persona = listadoGeneralPersonas.find(data => data.usuario === usuario && data.contrasena === password);
      console.log(persona);
      
      if (!persona) {
        alert('Los datos de acceso son incorrectos o no se encuentran registrados.');
        return;
      }else{
        window.location.href = "/files/pages/admin.html"
      }
    }

    btnAcceso.addEventListener('click', () => {
      login();
    })
  }

  let initRegistrar = () => {
    let btnRegistrar = document.querySelector("#btnRegistrar");
    if (!btnRegistrar) return;
    
  }
  // Detectar página activa y ejecutar inicialización correspondiente
  const page = window.location.pathname;
  /* if (page.includes("index.html")) initRegistrar(); */
  if (page.includes("admin.html")) initListarRegistro();
  if (page.includes("login.html")) initLogin();
})














