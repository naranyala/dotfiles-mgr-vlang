# Architecture

## Overview

Dotfiles Manager is designed as a hybrid application consisting of a high-performance backend written in V and a rich, interactive frontend written in JavaScript.

## Backend (V)

The backend is responsible for all "heavy lifting" and direct system interaction.

### Core Components

- `src/core/app.v`: The main application logic and lifecycle management.
- `src/core/webview.c.v`: Integration with the webview library to provide the GUI window and RPC bridge.
- `src/plugins/`: A collection of V-based plugins that extend the backend's capabilities (e.g., Git, Files, Processes).

### Plugin System

Backend plugins are modular components that register themselves with the core application. They provide specialized functionality that can be invoked by the frontend.

## Frontend (JavaScript)

The frontend provides the user experience through a modern web interface.

### Core Technologies

- **Reactive Engine:** A custom implementation of signals and reactivity for efficient DOM updates.
- **Component Model:** A component-based architecture for building reusable UI elements.
- **RPC Bridge:** A mechanism to call backend V functions from the frontend seamlessly.

### Directory Structure

- `frontend/src/core/`: Core library logic (signals, DOM, RPC, etc.).
- `frontend/src/plugins/`: Frontend-specific plugins for UI enhancements.
- `frontend/src/shell/`: UI components related to the application's shell/interface.

## Communication Bridge

The communication between the V backend and the JavaScript frontend is facilitated by a Webview.

1. **Frontend -> Backend:** The frontend makes asynchronous RPC calls. The Webview captures these calls and forwards them to the V backend.
2. **Backend -> Frontend:** The V backend can execute JavaScript in the webview context to push updates, trigger UI changes, or send signals.
