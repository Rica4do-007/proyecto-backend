// 1. Configuración Global
const API_URL = 'http://localhost:3000/app';

// 2. Funciones de Autenticación (Registro / Login)
async function register() {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            toggleAuth();
        } else {
            alert(data.message || "Error al registrar");
        }
    } catch (error) {
        console.error("Error en registro:", error);
        alert("No se pudo conectar con el servidor.");
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            mostrarSeccionTareas();
        } else {
            alert(data.message || "Credenciales incorrectas");
        }
    } catch (error) {
        console.error("Error en login:", error);
        alert("Error de conexión al intentar iniciar sesión.");
    }
}

// 3. Gestión de Tareas (CRUD)
async function crearTarea() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, status: 'pendiente' })
    });

    if (res.ok) {
        document.getElementById('task-title').value = ''; // Limpia el input
        document.getElementById('task-desc').value = '';
        cargarTareas(); // Recarga la lista automáticamente
    } else {
        alert("Error al crear la tarea");
    }
}

async function cargarTareas() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const tareas = await res.json();
        const container = document.getElementById('tasks-container');
        container.innerHTML = '';

        tareas.forEach(t => {
    container.innerHTML += `
        <div class="card">
            <h3>${t.title}</h3>
            <p>${t.description || 'Sin descripción'}</p>
            <p><strong>Estado:</strong> <span class="status-${t.status}">${t.status}</span></p>
            
            <div class="actions">
                <button onclick="actualizarEstado('${t._id}', 'en progreso')">⏳ Proceso</button>
                <button onclick="actualizarEstado('${t._id}', 'completado')">✅ Hecho</button>
                <button class="delete-btn" onclick="eliminarTarea('${t._id}')">🗑️ Borrar</button>
            </div>
        </div>
    `;
});

    } catch (error) {
        console.error("Error cargando tareas:", error);
    }
}

// Función para cambiar el estado de la tarea
async function actualizarEstado(id, nuevoEstado) {
    const token = localStorage.getItem('token');
    
    try {
        const res = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: nuevoEstado })
        });

        if (res.ok) {
            cargarTareas(); // Recargamos la lista para ver el cambio
        } else {
            alert("Error al actualizar el estado");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Función para eliminar la tarea
async function eliminarTarea(id) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;
    
    const token = localStorage.getItem('token');
    
    try {
        const res = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            cargarTareas();
        } else {
            alert("No se pudo eliminar la tarea");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// 4. Utilidades de Interfaz (UI)
function toggleAuth() {
    document.getElementById('login-section').classList.toggle('hidden');
    document.getElementById('register-section').classList.toggle('hidden');
}

function mostrarSeccionTareas() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('register-section').classList.add('hidden');
    document.getElementById('tasks-section').classList.remove('hidden');
    cargarTareas();
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}

// 5. Inicialización (Verificar si ya hay sesión activa al cargar la página)
window.onload = () => {
    if (localStorage.getItem('token')) {
        mostrarSeccionTareas();
    }
};