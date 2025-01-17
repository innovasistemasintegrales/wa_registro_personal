
let btnTest = document.querySelector("#data")
let btnRegistrar = document.querySelector("#btn_enviar");

const fragmento = document.createDocumentFragment();

let listaGeneralRegistros = [{
  dni: 123123, 
  nombre: "Juan Perez", 
  numero: "987654321", 
  grado: "Bachiller en Ingenieria", 
  institucion: "Universidad Nacional de Ingenieria", 
  cv: "Enlace al CV o resumen profesional", 
},
{
  dni: 456456,
  nombre: "Maria Gonzalez",
  numero: "987123456",
  grado: "Licenciada en Administración",
  institucion: "Universidad de Lima",
  cv: "Enlace al CV o resumen profesional"
},
];

let cardReactivo = document.querySelector('#cardReactivo');
const templateRegistros = document.querySelector('#templateRegistros').content;
const templateRegistrosMovil = document.querySelector('#templateRegistrosMovil').content;

btnTest.addEventListener('click', () => {
  listarPersona()
})
btnRegistrar.addEventListener('click', () => {
  registrarPersona()
})

/* function listarPersona() {
  fetch('http://localhost:3000/listar')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      let pdf = document.querySelector(".pdf");

      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        console.log(element.CV);
        
        if (element.CV != null) {
          pdf.innerHTML = leerPDF(element.CV);
        }
        
      }

    });
}

function leerPDF(pdf) {
  let innerHTML = `<iframe src="${pdf}" type="application/pdf" width="100%" height="100%"></iframe>`
  return innerHTML;
} */

/*---------------------------------------------------------------------------------------------------------------------*/

document.addEventListener("DOMContentLoaded", function () {
  listarRegistros();
});

function listarRegistros() {
  // Limpia el contenido existente
  cardReactivo.innerHTML = "";

  // Verifica si la vista es móvil o escritorio
  if (window.innerWidth <= 425) {
    listaGeneralRegistros.forEach((registro) => {
        templateRegistrosMovil.querySelector('.dni-registros').innerHTML = `<strong>DNI:</strong> ${registro.dni}`;
        templateRegistrosMovil.querySelector('.nombre-registros').innerHTML = `<strong>Nombre:</strong> ${registro.nombre}`;
        templateRegistrosMovil.querySelector('.numero-registros').innerHTML = `<strong>Celular:</strong> ${registro.numero}`;
        templateRegistrosMovil.querySelector('.grado-registros').innerHTML = `<strong>Grado:</strong> ${registro.grado}`;
        templateRegistrosMovil.querySelector('.instituticion-registros').innerHTML = `<strong>Institución:</strong> ${registro.institucion}`;
        templateRegistrosMovil.querySelector('.curriculum-registros').innerHTML = `<strong>CV:</strong> ${registro.cv}`;

        const clone = templateRegistrosMovil.cloneNode(true);
        fragmento.appendChild(clone);
    });
  } else {
      listaGeneralRegistros.forEach((registro) => {
          templateRegistros.querySelector('.dni-registros').textContent = registro.dni;
          templateRegistros.querySelector('.nombre-registros').textContent = registro.nombre;
          templateRegistros.querySelector('.numero-registros').textContent = registro.numero;
          templateRegistros.querySelector('.grado-registros').textContent = registro.grado;
          templateRegistros.querySelector('.instituticion-registros').textContent = registro.institucion;
          templateRegistros.querySelector('.curriculum-registros').textContent = registro.cv;

          const clone = templateRegistros.cloneNode(true);
          fragmento.appendChild(clone);
      });
  }

  // Agrega los nuevos elementos generados al DOM
  cardReactivo.appendChild(fragmento);
}

// Escucha el evento resize para cambiar dinámicamente el contenido
window.addEventListener('resize', function () {
  listarRegistros(); // Actualiza los registros al cambiar el tamaño de la ventana
});

/*------------------------------------------------------------------------------------------------------------------------------------*/
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

  fetch('http://localhost:3000/registrar', {
    method: 'POST',
    body: formData,     
  }).then(response => response.json()).then(data =>{
    if (data.status == 'success') {
      alert("Datos enviados correctamente...");
    }else{
      alert("Error al guardar datos, contactar con el administrador");
    }
  });

  
}

const firebaseConfig = {
  apiKey: "AIzaSyC9FLzdPx5wUGmcHOB64u_EN1fxo0n0LM8",
  authDomain: "wa-reclutamiento.firebaseapp.com",
  projectId: "wa-reclutamiento",
  storageBucket: "wa-reclutamiento.firebasestorage.app",
  messagingSenderId: "870284509075",
  appId: "1:870284509075:web:f9e52b98e2d133c7e97266"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/*  const storageRef = firebase.storage().ref(); */

/* Constantes */
const btn_enviar = document.querySelector("#btn_enviar");

/* Funciones */
function numOrden() {
  let orden = document.querySelector("#orden");
  db.collection("registros").onSnapshot(collection => {
    /* console.log(collection.docs); */
    let cantidad = collection.docs;
    let index = 0;
    index = cantidad.length + 1
    orden.innerHTML = index;
  })
}

function limpiarFormulario() {
  let empresa = document.querySelector("#empresa");
  let ruc = document.querySelector("#ruc");
  let representante = document.querySelector("#representante");
  let celular = document.querySelector("#celular");

  empresa.value = "";
  ruc.value = "";
  representante.value = "";
  celular.value = "";
}

function autoLlenado() {
  let ruc = document.querySelector("#ruc").value;
  let txt_empresa = document.querySelector("#txt_empresa");

  if (ruc == "") {
    alert("Es obligatorio completar el campo RUC")
    document.querySelector("#ruc").focus();
  } else if (ruc.length < 11) {
    alert("El RUC debe tener 11 dígitos")
  } else {
    var objeto = {
      documento: ruc
    };
    fetch("https://innovaqp.com/utils/consulta_ruc_dni.php", {
      method: "POST",
      body: JSON.stringify(objeto),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json()).then(data => {
      if (data.nombre === undefined) {
        alert("Datos de RUC ingresado no encontrado");
      }
      else {
        txt_empresa.innerHTML = data.nombre;
      }
    })
  }
}

function guardarRegistro() {

  let dni = document.querySelector("#dni").value;
  let nombres = document.querySelector("#nombres").value;
  let celular = document.querySelector("#celular").value;
  let grado = document.querySelector("#grado").value;
  let institucion = document.querySelector("#institucion").value;
  let descripcion = document.querySelector("#descripcion").value;
  let file = document.querySelector("#file").value;

  if (nombres != "" && dni != "" && celular != "" && grado != "" && institucion != "") {
    if (file =="") {
      alert("Debe subir su CV.");
      return;
    }
    if (dni.length != 8) {
      alert("Ingrese Numero de DNI válido.");
      return;
    } else if (celular.length != 9) {
      alert("Ingrese un número de celualr válido.");
      return;
    } else if (grado == "0") {
      alert("Seleccione su grado de instrucción");
      return;
    } else {
      const rand=()=>Math.random(0).toString(36).substr(2);
      const token=(length)=>(rand()+rand()+rand()+rand()).substr(0,length);
      let tokenImg = token(5);

      let persona ={

      }

      fetch('http://localhost:3000/listar', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(persona), 
      
        headers: { 
          "Content-Type": "application/json"
        }
      }).then(response => response.json()).then(data =>{
        console.log(data);
      });




      let documento = db.collection("registros").doc();
      documento.set({
        id: documento.id,
        nombres,
        dni,
        celular,
        grado,
        descripcion,
        /* urlStorage : url, */

      }).then((msj) => {
        /* window.location.reload(); */
        alert("Datos enviados correctamente...");
      })
    }
  }
  else {
    alert("Todos los campos son obligatorios...");
  }
}

/* Listar */
function listar() {
  let tb_registro = document.querySelector("#tb_registros");

  db.collection("registros").onSnapshot(collection => {
    array = collection.docs;

    /* for (let i = 0; i < array.length; i++) {
      let objeto = array[i].data();
      tb_registro.innerHTML = tb_registro.innerHTML + vista(objeto);
    } */
    var arrayOrdenar = [];
    for (let i = 0; i < array.length; i++) {
      arrayOrdenar[i] = array[i].data();
    }
    arrayOrdenar.sort(function (a, b) {
      return b.orden - a.orden;
    });

    for (let index = 0; index < arrayOrdenar.length; index++) {
      let objeto = arrayOrdenar[index];
      tb_registro.innerHTML = tb_registro.innerHTML + vista(objeto);

    }

  })
}

function vista(objeto) {
  let template = `
    <tr>
      <td>${objeto.orden}</td>
      <td>${objeto.empresa}</td>
      <td>${objeto.ruc}</td>
      <td>${objeto.representante}</td>
    </tr>
    `
  return template;
}

function listarAdmin() {
  let tb_admin = document.querySelector("#tb_registros");

  db.collection("registros").onSnapshot(collection => {
    array = collection.docs;
    var arrayOrdenar = [];
    for (let i = 0; i < array.length; i++) {
      arrayOrdenar[i] = array[i].data();
    }
    arrayOrdenar.sort(function (a, b) {
      return b.orden - a.orden;
    });

    for (let index = 0; index < arrayOrdenar.length; index++) {
      let objeto = arrayOrdenar[index];
      tb_admin.innerHTML = tb_admin.innerHTML + vistaAdmin(objeto);

    }

  })
}

function vistaAdmin(objeto) {
  let template = `
    <tr>
      <td>${objeto.orden}</td>
      <td>${objeto.empresa}</td>
      <td>${objeto.ruc}</td>
      <td>${objeto.representante}</td>
      <td>${objeto.celular}</td>
      <td>${objeto.facebook}</td>
    </tr>
    `
  return template;
}
function login() {
  let usuario = document.querySelector("#usuario").value;
  let password = document.querySelector("#password").value;

  db.collection("usuarios").get().then((coleccion) => {
    coleccion.forEach(documento => {
      /* console.log(documento.data()); */
      let objeto = documento.data();
      if (usuario === "" || password === "") {
        alert("Complete los campos solicitados")
      } else if (objeto.usuario == usuario && objeto.contrasena == password) {
        window.location.href = "../pages/admin.html"
      } else {
        alert("Usuario o Contraseña incorrecto...");
      }
    })
  })
}



/* btn_enviar.addEventListener("click", guardarRegistro); */