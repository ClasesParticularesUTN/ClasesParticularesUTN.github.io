# Clases Particulares UTN — Sitio web

Sitio estático para **clases particulares de Ingeniería en Sistemas**: landing, información de materias y precios, y un módulo de **reserva de turnos** con autenticación de usuarios. El proyecto está pensado para publicarse en **GitHub Pages** con dominio propio.

**Dominio en producción:** [clasesparticularesutn.com.ar](https://clasesparticularesutn.com.ar)

---

## Contenido del repositorio

| Sección | Descripción |
|--------|-------------|
| **Portada** (`index.html`) | Hero, navegación y accesos rápidos a servicios |
| **Horarios** (`/Horarios`) | Calendario de reservas, modalidad de clase, panel de usuario |
| **Materias** (`/Materias`) | Materias dictadas y planes de estudio |
| **Precios** (`/Precios`) | Tarifas individuales, grupales y packs |
| **Pagos** (`/Pagos`) | Flujo informativo / enlaces relacionados al pago |
| **Otros** | Foro, materiales de Algoritmos, Arquitectura, Paradigmas, ubicación, carga de comprobantes, área administrativa, etc. |

---

## Stack tecnológico

- **HTML5, CSS3 y JavaScript** (vanilla, sin framework de aplicación)
- **Fuentes:** Google Fonts (Inter, Poppins)
- **UI:** [SweetAlert2](https://sweetalert2.github.io/), [Font Awesome](https://fontawesome.com/)
- **Backend ligero:** [Google Apps Script](https://developers.google.com/apps-script) (web apps desplegadas como URL `script.google.com/macros/...`) para horarios y usuarios — configuración en `Horarios/JS/URLS.js`

---

## Requisitos

No hay dependencias de Node ni build obligatorio. Solo un navegador moderno y, para desarrollo local cómodo, un servidor HTTP estático (recomendado para rutas absolutas y `fetch`).

---

## Cómo ejecutarlo en local

1. Cloná o descargá el repositorio.
2. Serví la carpeta raíz como sitio estático, por ejemplo:

   ```bash
   npx --yes serve .
   ```

   También podés usar la extensión “Live Server” de VS Code/Cursor u otro servidor estático equivalente.

3. Abrí la URL que indique el servidor (por ejemplo `http://localhost:3000`).

> **Nota:** Algunas rutas usan enlaces absolutos con `/` (p. ej. `/Horarios`). Un servidor en la raíz del proyecto evita problemas de rutas respecto a abrir `index.html` directamente desde el disco.

---

## Despliegue (GitHub Pages)

Este repositorio sigue el patrón **`usuario.github.io`**: GitHub Pages suele servir la rama configurada (habitualmente `main` o `master`) desde la raíz del repo.

1. Subí los cambios al remoto.
2. En el repositorio: **Settings → Pages** y elegí la rama/origen correctos.
3. El archivo `CNAME` define el dominio personalizado; el DNS del dominio debe apuntar a GitHub Pages según [la documentación oficial](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).

---

## Estructura general (resumen)

```
├── index.html          # Landing principal
├── precios.js          # Lógica compartida de precios (usada desde varias secciones)
├── Horarios/           # Reservas, login/registro, estilos y scripts
├── Materias/, Precios/, Pagos/, Foro/, …
├── assets/             # Recursos globales (imágenes, etc.)
└── CNAME               # Dominio personalizado
```

---

## Licencia y contacto

El contenido y el código son de uso del proyecto **Clases Particulares / C/S Ingeniería en Sistemas**. Para consultas comerciales o académicas, el sitio público incluye canales de contacto (por ejemplo WhatsApp en la portada).

---

*Última actualización del README: marzo de 2026.*
