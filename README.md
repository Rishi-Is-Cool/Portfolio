# Rishikesh Patil's Portfolio

A modern, responsive personal portfolio designed to showcase projects, experience, and skills with a clean, dark aesthetic and interactive features.

This application is built with React and Vite, utilizing a two-column sticky layout on desktop that transforms into a fully stacked, mobile-friendly design on smaller screens.

### Live Demo  
**https://rishiportfolio-psi.vercel.app/**

## Key Features

* **Responsive Layout:** Full responsiveness ensured using CSS media queries, adapting from a sticky desktop sidebar to a single-column mobile view.
* **Dark Theme & Aesthetic:** A sleek, minimal dark theme utilizing a dark blue background (`#0d1117`) and neon cyan (`#64ffda`) as the primary accent color.
* **Smooth Navigation:** Custom smooth scrolling to sections (`About`, `Experience`, `Projects`) implemented via JavaScript (using `scrollTo` in `PortfolioLayout.jsx`).
* **Scroll Highlighting:** Dynamic navigation menu highlighting the active section based on scroll position using the `IntersectionObserver` API.
* **Interactive Effects (Desktop):**
    * **Mouse Spotlight:** A subtle radial gradient follows the mouse cursor on the background.
    * **Magnetic Cards:** Experience and project cards exhibit a slight "magnetic" wobble effect on hover.
    * **Click Ripples:** A visual ripple effect appears on mouse clicks.
* **Scroll Reveal Animation:** Sections and cards fade in and slide up gracefully as they enter the viewport.
* **Profile Integration:** Dedicated space for a circular profile photo and a direct link to the resume PDF.

## Technology Stack

This project is built using the following core technologies and libraries:

| Category | Technology | Version | Source |
| :--- | :--- | :--- | :--- |
| **Framework** | React | `^19.0.0` |
| **Build Tool** | Vite | `^6.2.0` |
| **Styling** | CSS | `^4.1.17` |
| **Animation** | Framer Motion | `^12.23.25` |
| **Icons** | React Icons | `^5.5.0` |
| **Linter** | ESLint (with React Hooks/Refresh) | `^9.21.0` |

## 🛠 Project Setup

### Prerequisites

You need to have Node.js (version 18 or later) installed.

### Installation

1.  **Clone the repository (or navigate to your project directory):**
    ```bash
    git clone [your-repo-url]
    cd portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Development Scripts

To run the project locally, use the following commands:

* **Start the development server:**
    ```bash
    npm intall
    # install all the necessary packages required
    ```
* **Build for production:**
    ```bash
    npm run dev
    # opens http://localhost:5173/ (or similar port) with Hot Module Replacement (HMR)
    ```

## Customization Guide

### 1. Update Content
All textual content (About, Experience, Projects) can be updated in the respective JSX files under `src/components/PortfolioLayout/`.

### 2. Assets (Image & Resume)

* **Profile Photo:** To use your own profile photo, replace the placeholder image (e.g., `profile_photo.jpg`) in the **`src/assets`** folder, ensuring the file name matches the import in `StaticSide.jsx`.
* **Resume PDF:** To link your resume, place your PDF file (e.g., `Rishikesh_Patil_Resume.pdf`) directly into the **`public`** directory. The link in `StaticSide.jsx` already references this path (`/Rishikesh_Patil_Resume.pdf`).

### 3. Styling & Theming

The primary theme and responsive breakpoints are defined in:

* `src/styles/PortfolioLayout.css` (Contains all custom variables, layout logic, and media queries for responsiveness).

You can easily adjust colors by modifying the CSS variables in the `:root` block, such as `--color-accent-primary`.
```css
:root {
    /* Primary color for titles and accents */
    --color-accent-primary: #64ffda; 
}
