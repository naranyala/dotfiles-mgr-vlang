# Plugins

Dotfiles Manager features a powerful plugin architecture that allows for easy extension of both the backend and frontend.

## Backend Plugins (V)

Backend plugins are written in V and are integrated into the core application. They provide system-level capabilities.

### Available Backend Plugins

- **Files:** Advanced file management and navigation.
- **Git:** Integration with Git for managing dotfiles repositories.
- **Processes:** Monitoring and managing system processes.
- **Probe:** System probing and information gathering.
- **System:** General system utility functions.
- **Tools:** Additional backend utilities.

### Developing Backend Plugins

To create a new backend plugin, you need to implement the plugin interface defined in the core and register it during the application startup.

## Frontend Plugins (JavaScript)

Frontend plugins are written in JavaScript and extend the user interface.

### Available Frontend Plugins

- **Commands:** Adds new commands to the application shell.
- **Files:** Enhances the file explorer UI.
- **Git:** Adds Git-specific UI elements.
- **Network:** Provides network monitoring visualization.
- **System:** Displays system status in the UI.
- **Theme:** Allows for UI customization and theming.

### Developing Frontend Plugins

Frontend plugins are loaded dynamically and can interact with the application's core services and the V backend via the RPC bridge.
