# Dotfiles Manager (vlang)

A high-performance, plugin-based dotfiles manager written in V, featuring a modern web-based GUI.

## Overview

Dotfiles Manager provides a unified interface for managing your system configurations. It combines the speed and safety of the V language for system-level operations with the flexibility and rich UI capabilities of a modern JavaScript-based frontend.

## Architecture

The application uses a multi-layered architecture:

- **Backend (V):** Handles low-level system operations, file management, git integration, and process monitoring. It exposes functionality to the frontend through a Webview-based RPC mechanism.
- **Frontend (JavaScript):** A responsive web application that provides the user interface. It uses a custom reactive component system and communicates with the V backend via RPC.
- **Communication:** The backend hosts a webview that renders the frontend and provides an asynchronous RPC bridge for seamless interaction between the UI and the system.

## Key Features

- **Plugin System:** Easily extend functionality with both V-based backend plugins and JavaScript-based frontend plugins.
- **System Management:** Monitor and manage processes, system information, and network status.
- **Git Integration:** Manage dotfiles repositories with built-in git support.
- **File Explorer:** A powerful file management interface with specialized tools.

## Getting Started

### Prerequisites

- [V language](https://vlang.io/)
- [GCC/G++]
- `pkg-config` and `webkit2gtk-4.1` development headers
- [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/) (for frontend builds)

### Installation & Running

The simplest way to build and run the project is:

```bash
./run.sh
```

This script will:
1. Set up necessary libraries.
2. Build the webview static library.
3. Install frontend dependencies and build the UI.
4. Compile the V application.
5. Run the application.

## Project Structure

- `src/`: V backend source code.
- `frontend/`: JavaScript frontend source code.
- `lib/`: External libraries and dependencies.
- `docs/`: Project documentation.
