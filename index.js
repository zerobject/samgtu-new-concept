// поля
let theme = localStorage.getItem('theme') || 'light';
const wasSubmitted = { value: false };

const dmToggle = document.getElementById('dm-toggle');
const dmToggleIcon = document.getElementById('dm-toggle-icon');
const loginButton = document.getElementById('login-button');
const loginDialog = document.getElementById('login-dialog');
const login = document.getElementById('login');
const password = document.getElementById('password');
const params = new URLSearchParams(location.search);
const redirectTo = params.get("redirect") || "index.html";

// функции
function setTheme(newTheme) {
    theme = newTheme;
    document.documentElement.setAttribute('theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    updateDmToggleIcon();
    updateLogo();
}

function updateDmToggleIcon() {
    dmToggleIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
}

function updateLogo() {
    const logo = document.getElementById('page-logo');
    if (logo) {
        logo.src = theme === 'dark'
            ? 'images/logo_dark.png'
            : 'images/logo_light.png';
    }
}

function validateForm(event) {
    event.preventDefault();
    wasSubmitted.value = true;

    const loginValid = updateField(login, 'Введите логин!');
    const passValid = updateField(password, 'Введите пароль!');

    if (!loginValid || !passValid) return false;

    if (login.value === "abronin.ie" && password.value === "12345678") {
        localStorage.setItem("auth", "true");
        location.href = redirectTo;
        return true;
    }

    alert("Неверный логин или пароль");
    return false;
}

function updateField(field, errorText) {
    const empty = !field.value.trim();
    field.error = empty;
    field.supportingText = empty ? errorText : '';
    return !empty;
}

function logout() {
    localStorage.removeItem("auth");
    location.reload();
}

function drawElementsByData() {

}

// подписки
document.addEventListener('DOMContentLoaded', () => {
    setTheme(theme);
    updateDmToggleIcon();
    updateLogo();

    document
        .querySelectorAll('.fade-in')
        .forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 75));

    fetch("https://samgtu-new-concept-service.onrender.com/lessons")
        .then((res) => res.json())
        .then((data) => {
            console.log("Данные с сервера:", data);
            // сюда вставляй логику отрисовки карточек, таблиц и т.п.
        })
        .catch((err) => {
            console.error("Ошибка при загрузке данных:", err);
        });
});

dmToggle?.addEventListener('click', toggleTheme);

loginButton?.addEventListener('click', () => {
    loginDialog?.show();
    setTimeout(() => document.activeElement?.blur(), 0);
});

loginDialog?.addEventListener('open', () => {
    [login, password].forEach(field => {
        field.error = false;
        field.supportingText = '';
    });
});

login?.addEventListener('input', () => {
    if (wasSubmitted.value) updateField(login, 'Введите логин!');
});

password?.addEventListener('input', () => {
    if (wasSubmitted.value) updateField(password, 'Введите пароль!');
});
