// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {

    apiKey: "AIzaSyBnnbVdj_h3og0AfZd6EqQoxexoJVLq92c",
    authDomain: "aplicaciones-7e63f.firebaseapp.com",
    projectId: "aplicaciones-7e63f",
    storageBucket: "aplicaciones-7e63f.firebasestorage.app",
    messagingSenderId: "411353939307",
    appId: "1:411353939307:web:35c1886a850187ec40e02e",
      
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Referencia al formulario
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const agregarBtn = document.getElementById("agregar");
const listado = document.getElementById("listado");
const nombreEdit = document.getElementById("nombreEdit");
const emailEdit = document.getElementById("emailEdit");
const guardarBtn = document.getElementById("guardar");
let idEdicion = null;

// Función para agregar un nuevo registro
agregarBtn.addEventListener("click", async () => {
  const nombre = nombreInput.value;
  const email = emailInput.value;

  if (nombre && email) {
    try {
      await addDoc(collection(db, "usuarios"), {
        nombre,
        email
      });
      console.log("Documento agregado");
      nombreInput.value = "";
      emailInput.value = "";
      cargarUsuarios(); // Recarga la lista de usuarios
    } catch (e) {
      console.error("Error añadiendo documento: ", e);
    }
  }
});

// Cargar usuarios desde Firestore
const cargarUsuarios = async () => {
  const querySnapshot = await getDocs(collection(db, "usuarios"));
  listado.innerHTML = ""; // Limpiar listado
  querySnapshot.forEach((doc) => {
    const usuario = doc.data();
    const li = document.createElement("li");
    li.textContent = `${usuario.nombre} - ${usuario.email}`;
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";

    btnEditar.addEventListener("click", () => editarUsuario(doc.id, usuario));
    btnEliminar.addEventListener("click", () => eliminarUsuario(doc.id));

    li.appendChild(btnEditar);
    li.appendChild(btnEliminar);
    listado.appendChild(li);
  });
};

// Función para editar usuario
const editarUsuario = (id, usuario) => {
  idEdicion = id;
  nombreEdit.value = usuario.nombre;
  emailEdit.value = usuario.email;
};

// Guardar cambios de un usuario
guardarBtn.addEventListener("click", async () => {
  const nombre = nombreEdit.value;
  const email = emailEdit.value;

  if (nombre && email && idEdicion) {
    try {
      const usuarioRef = doc(db, "usuarios", idEdicion);
      await updateDoc(usuarioRef, {
        nombre,
        email
      });
      console.log("Documento actualizado");
      nombreEdit.value = "";
      emailEdit.value = "";
      idEdicion = null;
      cargarUsuarios(); // Recarga la lista de usuarios
    } catch (e) {
      console.error("Error actualizando documento: ", e);
    }
  }
});

// Eliminar usuario
const eliminarUsuario = async (id) => {
  try {
    await deleteDoc(doc(db, "usuarios", id));
    console.log("Documento eliminado");
    cargarUsuarios(); // Recarga la lista de usuarios
  } catch (e) {
    console.error("Error eliminando documento: ", e);
  }
};

// Cargar los usuarios cuando se inicia la aplicación
cargarUsuarios();