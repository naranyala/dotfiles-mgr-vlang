# Getting Started

This guide will help you set up a development environment and build the Dotfiles Manager project.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### System Dependencies

- **V language:** [Install V](https://vlang.io/docs/install/)
- **C/C++ Compiler:** `gcc` and `g++`
- **Build Tools:** `make`, `pkg-config`
- **WebkitGTK:** `libwebkit2gtk-4.1-dev` (or equivalent for your distribution)

### Frontend Dependencies

- **Node.js** (version 16+) or **Bun**

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd dotfiles-mgr-vlang
   ```

2. **Build and Run:**
   The easiest way to get started is by running the provided `run.sh` script:
   ```bash
   ./run.sh
   ```

This script will:
1. Set up necessary libraries.
2. Build the webview static library.
3. Install frontend dependencies and build the UI.
4. Compile the V application.
5. Run the application.

## Development

### Building the Backend

To rebuild only the V backend:
```bash
v -cc gcc -o main .
```

### Building the Frontend

To rebuild the frontend:
```bash
cd frontend
[bun install || npm install]
node build.js
cd ..
```

### Running Tests

To run the V backend tests:
```bash
v run runtests.v
```

To run the frontend tests:
```bash
cd frontend
[bun test || npm test]
cd ..
```
