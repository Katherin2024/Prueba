// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBnnbVdj_h3og0AfZd6EqQoxexoJVLq92c",
    authDomain: "aplicaciones-7e63f.firebaseapp.com",
    projectId: "aplicaciones-7e63f",
    storageBucket: "aplicaciones-7e63f.appspot.com", // Corregido el dominio
    messagingSenderId: "411353939307",
    appId: "1:411353939307:web:35c1886a850187ec40e02e"
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

// Verificar que los elementos del DOM existen
if (!nombreInput || !emailInput || !agregarBtn || !listado || !nombreEdit || !emailEdit || !guardarBtn) {
    console.error("Uno o más elementos del DOM no existen.");
}

// Función para agregar un nuevo registro
agregarBtn.addEventListener("click", async () => {
    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();

    if (nombre && email) {
        try {
            await addDoc(collection(db, "usuarios"), { nombre, email });
            console.log("Documento agregado");
            nombreInput.value = "";
            emailInput.value = "";
            cargarUsuarios();
        } catch (e) {
            console.error("Error añadiendo documento: ", e);
        }
    }
});

// Cargar usuarios desde Firestore
const cargarUsuarios = async () => {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    listado.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const usuario = doc.data();
        const li = document.createElement("li");
        li.textContent = `${usuario.nombre} - ${usuario.email}`; // Corregida la interpolación
        
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", () => editarUsuario(doc.id, usuario));
        
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
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
    if (!idEdicion) {
        console.warn("No se ha seleccionado un usuario para editar.");
        return;
    }

    const nombre = nombreEdit.value.trim();
    const email = emailEdit.value.trim();

    if (nombre && email) {
        try {
            const usuarioRef = doc(db, "usuarios", idEdicion);
            await updateDoc(usuarioRef, { nombre, email });
            console.log("Documento actualizado");
            nombreEdit.value = "";
            emailEdit.value = "";
            idEdicion = null;
            cargarUsuarios();
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
        cargarUsuarios();
    } catch (e) {
        console.error("Error eliminando documento: ", e);
    }
};

// Cargar los usuarios cuando se inicia la aplicación
cargarUsuarios();
