
// MENÚ MÓVIL A PANTALLA COMPLETA
(function () {
    'use strict';

    var nav = document.querySelector('.nav');
    var menuButton = document.querySelector('#menu-toggle') || document.querySelector('.menu-toggle');
    var menu = document.getElementById('menu') || document.querySelector('.nav__menu');
    var mobileQuery = window.matchMedia ? window.matchMedia('(max-width: 768px)') : null;

    function isMobile() {
        return mobileQuery ? mobileQuery.matches : window.innerWidth <= 768;
    }

    function openMenu() {
        if (menu) menu.classList.add('is-open');
        document.body.classList.add('menu-open'); 
        if (nav) nav.classList.remove('nav--hidden');
        if (menuButton) {
            menuButton.setAttribute('aria-expanded', 'true');
            menuButton.setAttribute('aria-label', 'Cerrar menú');
        }
    }

    function closeMenu() {
        if (menu) menu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        if (menuButton) {
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.setAttribute('aria-label', 'Abrir menú');
        }
    }

    function toggleMenu() {
        if (menu && menu.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuButton && menu) {
        menuButton.addEventListener('click', toggleMenu);

        var links = menu.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', closeMenu);
        }

        document.addEventListener('keydown', function (event) {
            if ((event.key === 'Escape' || event.keyCode === 27) && menu.classList.contains('is-open')) {
                closeMenu();
                menuButton.focus();
            }
        });
    }

// NAV QUE SE OCULTA AL BAJAR EN MÓVIL
    var lastScrollY = window.pageYOffset;
    var ticking = false;
    var DELTA = 8;

    function updateNav() {
        var currentY = window.pageYOffset;

        if (currentY > 20) {
            if (nav) nav.classList.add('is-scrolled');
        } else {
            if (nav) nav.classList.remove('is-scrolled');
        }

        if (!isMobile() || (menu && menu.classList.contains('is-open')) || currentY <= 0) {
            if (nav) nav.classList.remove('nav--hidden');
            lastScrollY = currentY;
            ticking = false;
            return;
        }

        var diff = currentY - lastScrollY;

        if (Math.abs(diff) > DELTA) {
            if (diff > 0 && nav && currentY > nav.offsetHeight) {
                nav.classList.add('nav--hidden'); 
            } else if (diff < 0) {
                if (nav) nav.classList.remove('nav--hidden'); 
            }
            lastScrollY = currentY;
        }

        ticking = false;
    }

    if (nav) {
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(updateNav);
                ticking = true;
            }
        });

        nav.addEventListener('focusin', function () {
            nav.classList.remove('nav--hidden');
        });

        window.addEventListener('resize', function () {
            if (!isMobile()) {
                closeMenu();
                nav.classList.remove('nav--hidden');
            }
        });

        updateNav();
    }

// AOS
    if (window.AOS) {
        AOS.init({
            duration: 700,
            easing: 'ease-out-back',
            offset: 80,
            once: true
        });
    }
})();



// FORMULARIO COMPRA DE ENTRADAS:
var MAXIMO_POR_TIPO = 10;       // máximo de entradas de cada tipo
let cantidad = 1;

// BOTONES
function actualizarEstadoBotones() {
    var botones = document.querySelectorAll('.counter__btn');
    var btnMenos = botones[0]; // Primer botón: (-)
    var btnMas = botones[1];   // Segundo botón: (+)

    if (btnMenos) {
        btnMenos.disabled = (cantidad <= 1);
    }
    if (btnMas) {
        btnMas.disabled = (cantidad >= MAXIMO_POR_TIPO);
    }
}


function sumarUnidad() {
    if (cantidad < MAXIMO_POR_TIPO) {
        cantidad++;
        document.getElementById("numero").innerHTML = cantidad;
        actualizarEstadoBotones();
        costeTotal();
    }
}

function restarUnidad() {
    if (cantidad > 1) {
        cantidad--;
        document.getElementById("numero").innerHTML = cantidad;
        actualizarEstadoBotones();
        costeTotal();
    }
}

function costeTotal() {
    let costePorEntrada = 0;

    if (document.getElementById("radio-pass").checked) {
        costePorEntrada = 219;
    } else if (document.getElementById("radio-vip").checked) {
        costePorEntrada = 319;
    } else if (document.getElementById("radio-dia").checked) {
        costePorEntrada = 119;
    }

    let costeEntradas = (cantidad * costePorEntrada) + " €";
    document.getElementById("coste").innerHTML = costeEntradas;
}

function comprar() {
    document.getElementById("nom").innerHTML = document.getElementById("nombre").value;
    document.getElementById("corr").innerHTML = document.getElementById("correo").value;
    document.getElementById("num").innerHTML = cantidad;
    document.getElementById("ct").innerHTML = document.getElementById("coste").innerHTML;

    let nombreTicket = "";
    if (document.getElementById("radio-pass").checked) {
        nombreTicket = "SONAR PASS (219€)";
    } else if (document.getElementById("radio-vip").checked) {
        nombreTicket = "SONAR PASS VIP (319€)";
    } else if (document.getElementById("radio-dia").checked) {
        nombreTicket = "TICKET DÍA (119€)";
    }

    document.getElementById("ex").innerHTML = nombreTicket;
    document.getElementById("modal").style.display = "flex";

    return false; 
}

function cerrarVentana() {
    document.getElementById("modal").style.display = "none";
}


// Estado inicial
actualizarEstadoBotones();