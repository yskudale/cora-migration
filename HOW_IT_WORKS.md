# Architecture & Migration Strategy

## Executive Summary

This proof-of-concept demonstrates a hybrid migration pattern for moving a legacy Java desktop application to a React web application one module at a time. The goal is to preserve the desktop application as the stable shell while incrementally introducing browser-based modules without forcing a risky full rewrite.

## 1. Core Migration Architecture

```text
+------------------------------------+
|   Java 17 Desktop Application      |
|  - Retains legacy core logic       |
|  - Triggers browser modules        |
|  - Listens on http://localhost:8080|
+-----------------+------------------+
                  |  1. Opens URL with params (?module=scanning&patientId=PT-9842)
                  |  2. Receives HTTP events POST /api/notify
                  v
+------------------------------------+
|     React Web Application          |
|  - Module Router (App.jsx)         |
|  - Feature Screens (Scanning, etc.)|
+-----------------+------------------+
                  |
                  v
+------------------------------------+
|  Abstracted Component Layer        |
|  (AppButton, AppModal, AppInput)   |
+-----------------+------------------+
                  |  Reads active theme
                  v
+------------------------------------+
|       Theme Engine (Context)       |
|  [ Windows Classic ] <-> [ Tailwind]
+------------------------------------+
```

## 2. How Java and React Communicate

### Desktop to Web
Java opens browser windows with specific URLs and query parameters such as:

```text
http://localhost:5173/?module=scanning
http://localhost:5173/?module=patient-search&patientId=PT-9842
```

This allows contextual data, such as patient IDs, to be passed into the web module safely.

### Web to Desktop
The Java desktop app runs a lightweight local HTTP listener using `com.sun.net.httpserver` on port `8080`. When a user performs an action in the React app, such as closing a modal or starting a scan, the app sends a `fetch()` POST request back to the desktop app to update state instantly.

## 3. How Dual Theme Switching Works

The main idea is to make the app look like a Windows desktop environment today without making it difficult to move to a modern Tailwind-based interface later.

### Step A: Absolute Component Abstraction
Feature modules such as `ScanningModule` and `PatientSearchModule` do not directly use raw HTML tags or inline styling. Instead, they rely on reusable application-level components.

```jsx
<AppModal title="E-Docs">
  <AppButton onClick={handleScan}>Start Scan</AppButton>
</AppModal>
```

This keeps the business logic and feature screens independent from visual implementation details.

### Step B: Central Theme Provider
A React `ThemeContext` maintains the active theme state, switching between `windows` and `modern` modes.

### Step C: Theme-Specific Rendering Inside Wrappers
The wrapper components decide what styling to render based on the active theme.

```jsx
export const AppButton = ({ children, onClick }) => {
  const { theme } = useTheme();

  if (theme === 'windows') {
    return <button style={winClassicStyles}>{children}</button>;
  }

  return <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm">{children}</button>;
};
```

This pattern allows the application to preserve a classic look now while gradually transitioning to a modern UI without rewriting feature modules.

## 4. Why This Architecture Protects the Business

| Strategic Benefit | How It Solves Legacy Problems |
| --- | --- |
| Zero Code Rewrites | Feature modules remain mostly unchanged while the visual layer evolves. |
| Phased Risk Reduction | The desktop app remains the primary shell while only critical modules are migrated. |
| AI-Assisted Scaling | New feature modules can be built with standardized wrappers such as `AppButton` and `AppGroupBox` without design-system overhead. |

### Zero Code Rewrites
When the Windows UI is eventually replaced, the feature modules can remain intact. Only the abstraction layer and theme implementation need to change.

### Phased Risk Reduction
There is no need to rewrite all Java modules at once. Migration can happen incrementally while the desktop app continues to function as the core application shell.

### AI-Assisted Scaling
AI-based code generation becomes easier because UI components follow a consistent pattern and can be created without worrying about application-specific design rules at the module level.

## Conclusion

This hybrid migration model reduces technical debt, supports gradual modernization, and keeps the organization from taking a risky full-platform rewrite. It provides a practical path from legacy desktop functionality to a modern web architecture with lower implementation risk.
