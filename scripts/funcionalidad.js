let totalSubs = 0;
let totalBits = 0;
let totalCofres = 0;
let tarjetaEditando = null;
let idEditando = null;

// Obtener datos del localStorage o inicializar vacío
let personas = JSON.parse(localStorage.getItem("personas")) || [];

document.getElementById("btnAgregar").addEventListener("click", agregarPersona);
document.addEventListener("DOMContentLoaded", cargarPersonas);

// =======================
// 📥 CARGAR PERSONAS
// =======================
function cargarPersonas() {
    totalSubs = 0;
    totalBits = 0;
    totalCofres = 0;

    personas.forEach(persona => {
        crearTarjeta(persona);
        totalSubs += persona.subs;
        totalBits += persona.bits;
        totalCofres += persona.cofres;
    });

    actualizarTotales();
}

// =======================
// ➕ AGREGAR / EDITAR
// =======================
function agregarPersona() {
    const nombre = document.getElementById("nombre").value.trim();
    const subs = parseInt(document.getElementById("subs").value) || 0;
    const bits = parseInt(document.getElementById("bits").value) || 0;
    const cofres = parseInt(document.getElementById("cofres").value) || 0;

    if (!nombre) {
        alert("Ingresa un nombre");
        return;
    }

    if (bits % 100 !== 0) {
        alert("Los bits deben ser de 100 en 100");
        return;
    }

    const persona = { id: idEditando || Date.now().toString(), nombre, subs, bits, cofres };

    // ✏️ EDITAR
    if (idEditando) {
        // Reemplazar en array
        const index = personas.findIndex(p => p.id === idEditando);
        if (index > -1) {
            // Restar totales anteriores
            totalSubs -= personas[index].subs;
            totalBits -= personas[index].bits;
            totalCofres -= personas[index].cofres;

            personas[index] = persona;

            // Actualizar tarjeta visual
            tarjetaEditando.remove();
            crearTarjeta(persona);

            // Sumar totales nuevos
            totalSubs += subs;
            totalBits += bits;
            totalCofres += cofres;

            guardarPersonas();
            actualizarTotales();
            limpiarFormulario();
        }
        return;
    }

    // ➕ CREAR
    personas.push(persona);
    crearTarjeta(persona);

    totalSubs += subs;
    totalBits += bits;
    totalCofres += cofres;

    guardarPersonas();
    actualizarTotales();
    limpiarFormulario();
}

// =======================
// 🧱 CREAR TARJETA
// =======================
function crearTarjeta(persona) {
    const minutosSubs = persona.subs * 30;
    const minutosBits = (persona.bits / 100) * 6;
    const minutosCofres = persona.cofres * 10;
    const totalMin = minutosSubs + minutosBits + minutosCofres;

    const horas = Math.floor(totalMin / 60);
    const minutos = totalMin % 60;

    const div = document.createElement("div");
    div.className = "persona";
    div.dataset.id = persona.id;

    div.innerHTML = `
        <h3>${persona.nombre}</h3>

        <p>Subs: <span class="subs">${persona.subs}</span> (${minutosSubs} min)</p>
        <p>Bits: <span class="bits">${persona.bits}</span> (${minutosBits} min)</p>
        <p>Cofres: <span class="cofres">${persona.cofres}</span> (${minutosCofres} min)</p>

        <p><strong>Tiempo:</strong> ${horas}h ${minutos}min</p>

        <div class="acciones">
            <button onclick="editarPersona(this)">✏️ Editar</button>
            <button onclick="eliminarPersona(this)">❌ Eliminar</button>
        </div>
    `;

    document.getElementById("listaPersonas").appendChild(div);
}

// =======================
// ✏️ EDITAR
// =======================
function editarPersona(boton) {
    const tarjeta = boton.closest(".persona");

    idEditando = tarjeta.dataset.id;
    tarjetaEditando = tarjeta;

    document.getElementById("nombre").value = tarjeta.querySelector("h3").textContent;
    document.getElementById("subs").value = tarjeta.querySelector(".subs").textContent;
    document.getElementById("bits").value = tarjeta.querySelector(".bits").textContent;
    document.getElementById("cofres").value = tarjeta.querySelector(".cofres").textContent;
}

// =======================
// ❌ ELIMINAR
// =======================
function eliminarPersona(boton) {
    const tarjeta = boton.closest(".persona");
    const id = tarjeta.dataset.id;

    const persona = personas.find(p => p.id === id);
    if (!persona) return;

    totalSubs -= persona.subs;
    totalBits -= persona.bits;
    totalCofres -= persona.cofres;

    // Eliminar del array y del DOM
    personas = personas.filter(p => p.id !== id);
    tarjeta.remove();

    guardarPersonas();
    actualizarTotales();
}

// =======================
// 🔢 TOTALES
// =======================
function actualizarTotales() {
    document.getElementById("totalSubs").textContent = totalSubs;
    document.getElementById("totalBits").textContent = totalBits;
    document.getElementById("totalCofres").textContent = totalCofres;

    const totalMin =
        (totalSubs * 30) +
        ((totalBits / 100) * 6) +
        (totalCofres * 10);

    const horas = Math.floor(totalMin / 60);
    const minutos = totalMin % 60;

    document.getElementById("tiempoTotal").textContent =
        `${horas} horas ${minutos} minutos`;
}

// =======================
// 🧹 LIMPIAR
// =======================
function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("subs").value = "";
    document.getElementById("bits").value = "";
    document.getElementById("cofres").value = "";
    tarjetaEditando = null;
    idEditando = null;
}

// =======================
// 💾 GUARDAR EN LOCALSTORAGE
// =======================
function guardarPersonas() {
    localStorage.setItem("personas", JSON.stringify(personas));
}
