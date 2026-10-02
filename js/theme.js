(function () {
    'use strict';

    var STORAGE_KEY = 'sonar-theme';
    var root = document.documentElement; // Etiqueta <html>

    // 1. Obtener tema guardado en localStorage
    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    // 2. Guardar selección en localStorage
    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            /* Si el navegador bloquea el almacenamiento, no se guarda permanente */
        }
    }

    // 3. Obtener tema inicial (guardado o preferencia del sistema)
    function getInitialTheme() {
        var saved = getSavedTheme();
        if (saved === 'light' || saved === 'dark') {
            return saved;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return 'dark'; // Por defecto Sónar arranca en oscuro
    }

    // 4. Aplicar el tema al <html> y actualizar accesibilidad
    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);

        var button = document.querySelector('.theme-toggle');
        if (button) {
            var isDark = theme === 'dark';
            button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            button.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        }
    }

    // APLICACIÓN INMEDIATA (Para evitar parpadeo al cargar)
    applyTheme(getInitialTheme());

    // EVENTOS AL CARGAR EL DOM
    document.addEventListener('DOMContentLoaded', function () {
        var button = document.querySelector('.theme-toggle');
        if (!button) {
            return;
        }

        // Re-sincronizar el estado del botón cuando el HTML esté listo
        applyTheme(root.getAttribute('data-theme'));

        // Toggle al hacer click
        button.addEventListener('click', function () {
            var current = root.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            saveTheme(next);
        });
    });
})();