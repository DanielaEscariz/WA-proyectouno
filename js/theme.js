/* =========================================================
   MODO CLARO / OSCURO (JavaScript nativo, ES5)
   Se carga en el <head> para aplicar el tema guardado
   antes de que se pinte la página (evita el "parpadeo").
   ========================================================= */
(function () {
    'use strict';

    var STORAGE_KEY = 'coolcats-tema';
    var root = document.documentElement;   // la etiqueta <html>

    // Leer y guardar en localStorage (con try/catch por si el navegador lo bloquea)
    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            /* sin almacenamiento: el tema dura solo mientras la página está abierta */
        }
    }

    // Tema inicial: el guardado o, si no hay, el del sistema operativo
    function getInitialTheme() {
        var saved = getSavedTheme();
        if (saved === 'light' || saved === 'dark') {
            return saved;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Aplica el tema al <html> y actualiza la accesibilidad del botón
    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);

        var button = document.querySelector('.theme-toggle');
        if (button) {
            var isDark = theme === 'dark';
            button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            button.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        }
    }

    // 1) Aplicar ya, antes de que cargue el resto del HTML
    applyTheme(getInitialTheme());

    // 2) Cuando el HTML está listo, conectar el botón
    document.addEventListener('DOMContentLoaded', function () {
        var button = document.querySelector('.theme-toggle');
        if (!button) {
            return;
        }

        applyTheme(root.getAttribute('data-theme'));

        button.addEventListener('click', function () {
            var current = root.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            saveTheme(next);
        });
    });
})();
