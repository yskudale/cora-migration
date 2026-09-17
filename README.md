# Cora Migration

A hybrid desktop-to-web migration prototype that keeps a Java desktop application as the main shell while opening React-based modules in the browser. This approach lets legacy desktop workflows remain intact while new web modules are introduced incrementally.

## Project Overview

This workspace contains two main applications:

- java-desktop: the legacy desktop application shell
- react-web: the browser-based module UI that replaces or supplements desktop screens

The desktop app launches web pages with module-specific URLs, and the React app sends status updates back to the Java app over a local HTTP listener.

## Main Features

- Java desktop launcher with action buttons for module access
- React web modules for scanning and patient search
- Dual-theme UI switching between Windows Classic and Modern Tailwind styles
- Browser-to-desktop notification flow using local HTTP server on port 8080
- Modular migration pattern for gradually moving legacy functionality to web interfaces

## Tech Stack

### Java Desktop
- Java 17
- Swing
- Java built-in HTTP server (`com.sun.net.httpserver.HttpServer`)

### React Web
- React
- Vite
- JavaScript / JSX
- Tailwind CSS

## Repository Structure

```text
cora-migration/
├── README.md
├── HOW_IT_WORKS.md
├── How to run project.md
├── java-desktop/
│   └── MainFrame.java
└── react-web/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    ├── public/
    └── src/
        ├── App.jsx
        ├── App.css
        ├── index.css
        ├── components/
        ├── context/
        └── modules/
```

## Prerequisites

Before running the project, make sure you have:

- Java JDK 17 installed
- Node.js 18+ installed
- npm installed

## Run the Project

### 1) Start the React app

Open a terminal in the project root and run:

```bash
cd react-web
npm install
npm run dev
```

The React app should be available at:

```text
http://localhost:5173
```

### 2) Start the Java desktop app

Open a second terminal and run:

```bash
cd java-desktop
javac MainFrame.java
java MainFrame
```

This opens the desktop window with buttons such as:

- Open Scanning
- Open Patient Search

## Application Flow

- The Java application opens a browser page using a URL like:
  - `http://localhost:5173/?module=scanning`
  - `http://localhost:5173/?module=patient-search&patientId=PT-9842`
- The React module loads based on the `module` query parameter
- User actions in the web UI trigger a POST request to:
  - `http://localhost:8080/api/notify`
- Java receives the notification and updates the status bar in the desktop window

## Theme Switching

The React UI supports two themes:

- Windows Classic
- Modern Tailwind

This is handled through the theme context and shared component wrappers so the feature modules remain mostly independent from the visual styling layer.

## Notes

This project is a migration prototype used to demonstrate a gradual transition from a legacy desktop system into a browser-based architecture without a full rewrite.

The project documentation in:

- `HOW_IT_WORKS.md`
- `How to run project.md`

provides more detailed explanations of the architecture and execution path.

## Useful Commands

```bash
# React dev server
cd react-web
npm run dev

# Java compile and run
cd java-desktop
javac MainFrame.java
java MainFrame
```

## License

This project is intended for demonstration and migration experimentation within the current workspace.
