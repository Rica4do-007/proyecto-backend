// 1. Configuración Global
const API_URL = '/app';

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
            toggleAuthForms();
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
            // After successful login, return to hero landing view with updated routine buttons
            showLandingView();
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
        body: JSON.stringify({ title, description, status: 'pending' })
    });

    if (res.ok) {
        document.getElementById('task-title').value = '';
        document.getElementById('task-desc').value = '';
        cargarTareas();
    } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Error al crear la tarea: ${errorData.message || "Campos inválidos"}`);
    }
}

async function cargarTareas() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) return;

        const data = await res.json();
        const container = document.getElementById('tasks-container');
        if (!container) return;
        container.innerHTML = '';

        const listaDeTareas = data.tasks || data.tareas || data.data || (Array.isArray(data) ? data : null);

        if (listaDeTareas && Array.isArray(listaDeTareas)) {
            listaDeTareas.forEach(t => {
                container.innerHTML += `
                    <div class="card">
                        <h3>${t.title}</h3>
                        <p>${t.description || 'Sin descripción'}</p>
                        <p><strong>Estado:</strong> <span class="status-${t.status}">${t.status}</span></p>
                        
                        <div class="actions">
                            <button class="btn-proceso" onclick="actualizarEstado('${t._id}', 'in_progress')">⏳ Proceso</button>
                            <button class="btn-hecho" onclick="actualizarEstado('${t._id}', 'done')">✅ Hecho</button>
                            <button class="delete-btn" onclick="eliminarTarea('${t._id}')">🗑️ Borrar</button>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Error cargando tareas:", error);
    }
}

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
            cargarTareas();
        } else {
            alert("Error al actualizar el estado");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

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

// 4. Interfaz y Control de Vistas (SPA Flow)
function showAuthView() {
    document.getElementById('landing-section').classList.add('hidden');
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('tasks-section').classList.add('hidden');
}

function showLandingView() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('tasks-section').classList.add('hidden');
    document.getElementById('landing-section').classList.remove('hidden');
    updateUIState();
}

function showDashboardView() {
    document.getElementById('landing-section').classList.add('hidden');
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('tasks-section').classList.remove('hidden');
    cargarTareas();
}

function handleProfileClick() {
    const token = localStorage.getItem('token');
    if (!token) {
        showAuthView();
    } else {
        // If already logged in, profile click could take them to dashboard or show session info
        showDashboardView();
    }
}

function toggleAuthForms(event) {
    if (event) event.preventDefault();
    document.getElementById('login-sub-section').classList.toggle('hidden');
    document.getElementById('register-sub-section').classList.toggle('hidden');
}

function logout() {
    localStorage.removeItem('token');
    showLandingView();
}

// Actualiza dinámicamente el texto del perfil y los botones del hero según la sesión
function updateUIState() {
    const token = localStorage.getItem('token');
    const profileText = document.getElementById('profile-btn-text');
    const heroButtonsContainer = document.getElementById('hero-buttons-container');

    if (token) {
        // Usuario autenticado
        if (profileText) profileText.innerText = "Mi Cuenta";
        if (heroButtonsContainer) {
            heroButtonsContainer.innerHTML = `
                <button onclick="showDashboardView()" class="hero-btn">Build your Routine</button>
                <button onclick="alert('Abriendo biblioteca de guías y videos...')" class="hero-btn" style="background-color: var(--secondary-color);">Browse Library</button>
            `;
        }
    } else {
        // Usuario visitante (no logueado)
        if (profileText) profileText.innerText = "Sign Up";
        if (heroButtonsContainer) {
            heroButtonsContainer.innerHTML = `
                <button onclick="showAuthView()" class="hero-btn">Get Started</button>
            `;
        }
    }
}

// 5. Inicialización al cargar la página
window.onload = () => {
    updateUIState();
};