# Project Setup & Execution Guide

This guide explains how to run both the Java 17 desktop application and the React web application locally.

## Prerequisites

Before starting, make sure the following are installed:

- Java Development Kit (JDK 17)
- Node.js (v18 or higher)
- npm

## Project Structure

```text
cora-migration/
├── java-desktop/
│   └── MainFrame.java
├── react-web/
│   ├── src/
│   │   ├── components/      # Abstracted UI controls (AppButton, AppModal, etc.)
│   │   ├── context/         # ThemeContext provider
│   │   ├── modules/         # Scanning and Patient Search screens
│   │   ├── App.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
├── HOW_IT_WORKS.md
├── README.md
└── How to run project.md
```

## Step 1: Start the React Web Application

Open a terminal and navigate to the React project folder:

```bash
cd cora-migration/react-web
```

Install dependencies if this is your first time running it:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Verify the app is running at:

```text
http://localhost:5173
```

## Step 2: Start the Java Desktop Application

Open a second terminal and navigate to the Java project folder:

```bash
cd cora-migration/java-desktop
```

Compile the Java file:

```bash
javac MainFrame.java
```

Run the application:

```bash
java MainFrame
```

## How to Test the Integration

### 1. Launch modules from the desktop app
Click "Open Scanning" or "Open Patient Search" in the Java application. This opens the browser module with contextual parameters such as patient ID.

### 2. Toggle visual themes
Use the floating toolbar at the top-right of the web screen to switch between:

- Windows Classic
- Modern Tailwind

### 3. Verify Java-to-web notifications
Click "Start Scan" in the scanning module or close the modal using the close button. Check the bottom status bar of the Java app to confirm that real-time updates are being received from the local HTTP endpoint at `http://localhost:8080`.

## Summary

This project demonstrates a hybrid migration pattern where a legacy Java desktop app remains the primary shell while web features are launched and integrated progressively.
