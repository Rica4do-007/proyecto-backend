// 1. Global Configuration
const API_URL = '/app';

// 2. Authentication Functions (Register / Login)
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
            alert("Successfully registered! Please log in.");
            toggleAuthForms();
        } else {
            alert(data.message || "Registration failed. Please try again.");
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("Could not connect to the server. Please try again.");
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
            showLandingView();
        } else {
            alert(data.message || "Incorrect credentials");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Connection error while trying to log in.");
    }
}

// 3. Task Management Functions (CRUD)
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
        alert(`Error creating task: ${errorData.message || "Invalid input"}`);
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
                        <p>${t.description || 'No description'}</p>
                        <p><strong>Status:</strong> <span class="status-${t.status}">${t.status}</span></p>
                        
                        <div class="actions">
                            <button class="btn-proceso" onclick="actualizarEstado('${t._id}', 'in_progress')">⏳ In Progress</button>
                            <button class="btn-hecho" onclick="actualizarEstado('${t._id}', 'done')">✅ Done</button>
                            <button class="delete-btn" onclick="eliminarTarea('${t._id}')">🗑️ Delete</button>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Error loading tasks:", error);
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
            alert("Error updating status");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function eliminarTarea(id) {
    if (!confirm("Are you sure you want to delete this?")) return;

    const token = localStorage.getItem('token');

    try {
        const res = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            cargarTareas();
        } else {
            alert("The task could not be deleted. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// 4. Interface Management: Show/Hide Sections
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
    if (token) {
        showDashboardView();
    } else {
        showAuthView();
    }
}

function toggleAuthForms(event) {
    if (event) event.preventDefault();
    document.getElementById('login-sub-section').classList.toggle('hidden');
    document.getElementById('register-sub-section').classList.toggle('hidden');
}

function logout() {
    localStorage.removeItem('token');
    updateUIState();
    showLandingView();
}

// UI State Manager

function updateUIState() {
    const token = localStorage.getItem('token');
    const profileText = document.getElementById('profile-btn-text');
    const profileImg = document.getElementById('profile-icon-img');
    const heroButtonsContainer = document.getElementById('hero-buttons-container');

    if (token) {
        // --- LOGGED IN STATE: Show ONLY the profile icon ---
        if (profileText) profileText.style.display = 'none';
        if (profileImg) profileImg.style.display = 'inline-block';
        
        if (heroButtonsContainer) {
            heroButtonsContainer.innerHTML = `
                <button onclick="showDashboardView()" class="hero-btn-orange">Build your Routine</button>
                <button onclick="alert('Opening library...')" class="hero-btn-blue">Browse Library →</button>
            `;
        }
    } else {
        // --- LOGGED OUT STATE: Show ONLY "Sign Up" text ---
        if (profileText) {
            profileText.style.display = 'inline';
            profileText.innerText = "Sign Up";
        }
        if (profileImg) profileImg.style.display = 'none';
        
        if (heroButtonsContainer) {
            heroButtonsContainer.innerHTML = `
                <button onclick="showAuthView()" class="hero-btn-orange">Get Started</button>
            `;
        }
    }
}

// 5. Initialization: Update UI state on page load
document.addEventListener("DOMContentLoaded", () => {
    updateUIState();
});