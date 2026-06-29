import { reactive, batch } from './signals';
import { ReactiveComponent } from './component';

declare global {
  interface Window {
    rpc: {
      osInfo: () => Promise<any>;
      exec: (cmd: string) => Promise<{exit_code: string, output: string, error?: string}>;
      openExternal: (uri: string) => Promise<any>;
      getEnv: (key: string) => Promise<{value: string, error?: string}>;
      setEnv: (key: string, val: string) => Promise<any>;
      readDir: (path: string) => Promise<any[] | {error: string}>;
      readFile: (path: string) => Promise<any>;
      writeFile: (path: string, content: string) => Promise<any>;
      exists: (path: string) => Promise<boolean | {error: string}>;
      isDir: (path: string) => Promise<boolean | {error: string}>;
      mkdir: (path: string) => Promise<any>;
      remove: (path: string) => Promise<any>;
      copy: (src: string, dst: string) => Promise<any>;
      move: (src: string, dst: string) => Promise<any>;
    }
  }
}

const state = reactive({
  osInfo: null as any,
  currentDir: '/',
  files: [] as any[],
  cmdInput: 'echo "Hello World"',
  cmdOutput: '',
  selectedFile: '',
});

class RichDashboard extends ReactiveComponent {
  
  onMount() {
    if (window.rpc) {
      window.rpc.osInfo().then(info => {
        if (!info.error) {
          state.osInfo = info;
          state.currentDir = info.home_dir;
          this.loadDirectory(info.home_dir);
        }
      });
    }

    // Command Execution
    this.delegate('submit', '#cmd-form', async (e: Event) => {
      e.preventDefault();
      if (!window.rpc) return;
      state.cmdOutput = 'Running...';
      const res = await window.rpc.exec(state.cmdInput);
      if (res.error) state.cmdOutput = "Error: " + res.error;
      else state.cmdOutput = `[Exit: ${res.exit_code}]\n${res.output}`;
    });

    this.delegate('input', '#cmd-input', (e: any) => state.cmdInput = e.target.value);

    // Directory Navigation
    this.delegate('click', '.dir-link', (e: any) => {
      const folder = e.target.getAttribute('data-name');
      const newPath = state.currentDir === '/' ? '/' + folder : state.currentDir + '/' + folder;
      this.loadDirectory(newPath);
    });

    this.delegate('click', '#btn-up', () => {
      const parts = state.currentDir.split('/');
      parts.pop();
      const newPath = parts.join('/') || '/';
      this.loadDirectory(newPath);
    });
    
    // File Operations
    this.delegate('click', '.file-delete', async (e: any) => {
      if (!window.rpc) return;
      const filename = e.target.getAttribute('data-name');
      const targetPath = state.currentDir === '/' ? '/' + filename : state.currentDir + '/' + filename;
      
      if (confirm(`Are you sure you want to delete ${filename}?`)) {
         const res = await window.rpc.remove(targetPath);
         if (res.error) alert("Failed to delete: " + res.error);
         else this.loadDirectory(state.currentDir); // Refresh
      }
    });

    // Make new dir
    this.delegate('click', '#btn-mkdir', async () => {
      if (!window.rpc) return;
      const folder = prompt("New folder name:");
      if (folder) {
         const targetPath = state.currentDir === '/' ? '/' + folder : state.currentDir + '/' + folder;
         const res = await window.rpc.mkdir(targetPath);
         if (res.error) alert(res.error);
         else this.loadDirectory(state.currentDir);
      }
    });
  }

  async loadDirectory(path: string) {
    if (!window.rpc) return;
    state.currentDir = path;
    const res = await window.rpc.readDir(path);
    if (!Array.isArray(res) && res.error) {
       alert("Error reading dir: " + res.error);
    } else {
       const files = res as any[];
       state.files = files.sort((a, b) => {
           if (a.is_dir === 'true' && b.is_dir === 'false') return -1;
           if (a.is_dir === 'false' && b.is_dir === 'true') return 1;
           return a.name.localeCompare(b.name);
       });
    }
  }

  render() {
    return `
      <style>
        :host { display: block; max-width: 850px; margin: 40px auto; font-family: 'Inter', sans-serif; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; display: flex; flex-direction: column; }
        .header { background: #2f3542; color: white; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
        .header h3 { margin: 0; font-size: 16px; }
        .body { padding: 20px; flex: 1; overflow-y: auto; max-height: 400px; }
        
        .term-input-group { display: flex; margin-bottom: 10px; }
        .term-input-group input { flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px 0 0 4px; outline: none; }
        .term-input-group button { background: #ff4757; color: white; border: none; padding: 0 16px; border-radius: 0 4px 4px 0; cursor: pointer; font-weight: bold; }
        .term-output { background: #1e272e; color: #0be881; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 13px; white-space: pre-wrap; word-wrap: break-word; min-height: 200px; }
        
        .file-list { list-style: none; padding: 0; margin: 0; }
        .file-item { display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #f1f2f6; }
        .file-item:hover { background: #f8f9fa; }
        .file-icon { width: 24px; text-align: center; margin-right: 10px; }
        .dir-link { color: #3742fa; cursor: pointer; text-decoration: underline; font-weight: 500; }
        .file-delete { background: #ff4757; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: auto; }
        .toolbar button { background: rgba(255,255,255,0.2); border: none; color: white; cursor: pointer; padding: 4px 8px; border-radius: 4px; margin-left: 8px; }
      </style>
      
      <div style="margin-bottom: 20px;">
         <h2>Full OS Toolkit Dashboard</h2>
         <p>Comprehensive Filesystem & Exec access via Webview RPC.</p>
      </div>

      <div class="grid">
        <div class="card">
          <div class="header"><h3>Terminal Execution</h3></div>
          <div class="body" style="background: #f1f2f6;">
            <form id="cmd-form" class="term-input-group">
              <input type="text" id="cmd-input" value="${state.cmdInput}" placeholder="Enter shell command..." />
              <button type="submit">Run</button>
            </form>
            <div class="term-output">${state.cmdOutput || 'Ready.'}</div>
          </div>
        </div>

        <div class="card">
          <div class="header">
            <h3>File Explorer</h3>
            <div class="toolbar">
               <button id="btn-mkdir">📁 New Folder</button>
               <button id="btn-up">⬆ Up</button>
            </div>
          </div>
          <div class="body" style="padding: 0;">
            <div style="padding: 8px 12px; background: #dfe4ea; font-size: 12px; font-family: monospace; border-bottom: 1px solid #ccc;">
              ${state.currentDir}
            </div>
            <ul class="file-list">
              ${state.files.map(f => `
                <li class="file-item">
                  <div class="file-icon">${f.is_dir === 'true' ? '📁' : '📄'}</div>
                  <div style="flex: 1;">
                    ${f.is_dir === 'true' 
                       ? `<span class="dir-link" data-name="${f.name}">${f.name}</span>`
                       : `<span>${f.name}</span>`
                    }
                  </div>
                  <div style="color: #999; font-size: 12px; margin-right: 15px;">
                    ${f.is_dir === 'true' ? '--' : Math.round(parseInt(f.size)/1024) + ' KB'}
                  </div>
                  <button class="file-delete" data-name="${f.name}">Delete</button>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('rich-dashboard', RichDashboard);
