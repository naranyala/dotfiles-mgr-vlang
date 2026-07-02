(()=>{var Qt=Object.defineProperty;var at=t=>{throw TypeError(t)};var C=(t,e)=>{for(var r in e)Qt(t,r,{get:e[r],enumerable:!0})};var st=(t,e,r)=>e.has(t)||at("Cannot "+r);var R=(t,e,r)=>(st(t,e,"read from private field"),r?r.call(t):e.get(t)),be=(t,e,r)=>e.has(t)?at("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),Ie=(t,e,r,o)=>(st(t,e,"write to private field"),o?o.call(t,r):e.set(t,r),r);window.rpc=new Proxy({},{get(t,e){return async(...r)=>{let o=window[e];if(!o)throw new Error(`RPC method "${e}" not available`);try{let a=await Promise.race([o(...r),new Promise((s,n)=>setTimeout(()=>n(new Error(`RPC "${e}" timeout`)),3e4))]);try{return JSON.parse(a)}catch{return a}}catch(a){throw console.error(`[RPC] ${e} failed:`,a.message),a}}}});var he=null,ge=0,je=new Set;function Fe(t){ge++;try{t()}finally{if(ge--,ge===0){let e=Array.from(je);je.clear();for(let r of e)r()}}}function z(t){let e=t,r=new Set,o=()=>(he&&r.add(he),e),a=n=>{if(!Object.is(e,n))if(e=n,ge>0)for(let l of r)je.add(l);else for(let l of Array.from(r))l()};return{get value(){return o()},set value(n){a(n)},peek:()=>e,set:a,update:n=>a(n(e))}}function xe(t){let e=z(void 0),r=!1,o=!1;return te(()=>{o||(e.value=t(),r=!0)}),{get value(){return r?e.value:t()},peek:()=>r?e.peek():t()}}var K=new Map;function te(t){let e=()=>{let r=K.get(e);if(r)for(let a of r)a();K.set(e,new Set),he=e;let o;try{o=t()}catch(a){console.error("[Signal] effect error:",a)}finally{he=null}typeof o=="function"?K.get(e).add(o):o instanceof Promise&&o.then(a=>{typeof a=="function"&&K.has(e)&&K.get(e).add(a)}).catch(a=>console.error("[Signal] async effect error:",a))};return e(),()=>{let r=K.get(e);if(r){for(let o of r)o();K.delete(e)}}}function nt(t,e){if(typeof t=="function"){let o=t();te(()=>{let a=t();Object.is(a,o)||(e(a,o),o=a)});return}let r=t.peek();te(()=>{let o=t.value;Object.is(o,r)||(e(o,r),r=o)})}function it(){return{value:void 0}}function Ne(t,e){if(t===null||typeof t!="object"||e.has(t))return t;e.add(t);let r={};for(let o of Object.keys(t)){let a=t[o];a!==null&&typeof a=="object"&&!Array.isArray(a)&&(t[o]=Ne(a,e))}return new Proxy(t,{get(o,a){let s=t[a];return s!==null&&typeof s=="object"&&!Array.isArray(s)?s:(r[a]||(r[a]=z(s)),r[a].value)},set(o,a,s){return t[a]=s,s!==null&&typeof s=="object"&&!Array.isArray(s)&&(t[a]=Ne(s,e)),r[a]?r[a].value=s:r[a]=z(s),!0},getOwnPropertyDescriptor(o,a){return Object.getOwnPropertyDescriptor(o,a)},ownKeys(o){return Reflect.ownKeys(o)}})}function f(t){return Ne(t,new WeakSet)}var Wt=new WeakMap,O=class{constructor(e,r){this._value=e,this._type=r}};function Yt(t){let e=r=>{let o=t(r);return o instanceof O?o:new O(o,t)};return Wt.set(e,t),e}var Gt=Yt(t=>{let[e,r]=t;if(!(e instanceof Promise))return e;let o=new WeakMap;function a(s,n){o.has(s)||(o.set(s,{value:void 0,settled:!1}),s.then(d=>{o.get(s).value=d,o.get(s).settled=!0}).catch(()=>{o.get(s).settled=!0}));let l=o.get(s);return l.settled?l.value:n}return new O({promise:e,fallback:r,update:a},Gt)});function A(t,e){let r=t.map(a=>typeof a=="object"?JSON.stringify(a):String(a)).join("|");A._cache||(A._cache=new Map),A._cache.has(r)||A._cache.set(r,e());let o=A._cache.get(r);if(A._cache.size>100){let a=A._cache.keys().next().value;A._cache.delete(a)}return o}A._cache=new Map;var j=class{constructor(e,r,o){this.html=e,this.events=r??new Map,this.children=o??new Map}toString(){return this.html}},ve=0;function qe(t){if(t instanceof O){let{_value:e,_type:r}=t;if(r&&typeof r=="function"){let o=r(e);return o instanceof O?qe(o):o}return e}return t}function E(t,...e){let r=new Map,o=new Map,a=[];for(let s=0;s<t.length;s++)if(a.push(t[s]),s<e.length){let n=e[s];n=qe(n);let l=t[s];if(typeof n=="function"){let d=l.match(/@(\w+)=\s*$/);if(d){let p=d[1],c=`ev${ve++}`;a[a.length-1]=l.slice(0,d.index)+`data-e="${p}:${c}"`,r.set(c,n);continue}}if(n instanceof j){let d=`ch${ve++}`;a.push(`<!--${d}-->`),o.set(d,n);continue}if(Array.isArray(n)){let d=[];for(let p of n)if(p instanceof j){let c=`ch${ve++}`;d.push(`<!--${c}-->`),o.set(c,p)}else if(p instanceof O){let c=qe(p);if(c instanceof j){let $=`ch${ve++}`;d.push(`<!--${$}-->`),o.set($,c)}else d.push(String(c??""))}else d.push(String(p??""));a.push(d.join(""));continue}a.push(String(n??""))}return new j(a.join(""),r,o)}function Jt(t,e){if(t.nodeType!==e.nodeType||t.nodeName!==e.nodeName)return!1;if(t.nodeType===Node.TEXT_NODE||t.nodeType===Node.COMMENT_NODE)return t.textContent!==e.textContent&&(t.textContent=e.textContent),!0;let r=t,o=e,a=new Map;for(let s of Array.from(o.attributes))a.set(s.name,s.value);for(let s of Array.from(r.attributes))s.name.startsWith("data-e")||a.has(s.name)||r.removeAttribute(s.name);for(let[s,n]of a)r.getAttribute(s)!==n&&r.setAttribute(s,n);return lt(r,o),!0}function lt(t,e){let r=Array.from(t.childNodes),o=Array.from(e.childNodes),a=Math.max(r.length,o.length);for(let s=0;s<a;s++){let n=r[s],l=o[s];if(!n&&l){t.appendChild(document.importNode(l,!0));continue}if(n&&!l){t.removeChild(n);continue}if(!(!n||!l)){if(n instanceof Element&&l instanceof Element&&n.hasAttribute("data-key")&&l.getAttribute("data-key")!==n.getAttribute("data-key")){let d=l.getAttribute("data-key");if(d?t.querySelector(`[data-key="${d.replace(/"/g,'\\"')}"]`):null){t.insertBefore(document.importNode(l,!0),n);continue}}Jt(n,l)||t.replaceChild(document.importNode(l,!0),n)}}}function Xt(t,e){let r=document.createElement("template");r.innerHTML=e.trim(),lt(t,r.content)}function dt(t){let e=t.html;for(let[r,o]of t.children){let a=dt(o);e=e.replace(`<!--${r}-->`,a)}return e}function ct(t,e){let r=dt(t);Xt(e,r);let o=e.querySelectorAll("[data-e]");for(let a of o){let s=a.getAttribute("data-e"),n=s.indexOf(":");if(n===-1)continue;let l=s.slice(0,n),d=s.slice(n+1),p=t.events.get(d);p&&(a.addEventListener(l,p),a.removeAttribute("data-e"))}}function Ue(t,e){if(t.nodeType!==e.nodeType){t.parentNode?.replaceChild(e.cloneNode(!0),t);return}if(t.nodeType===Node.TEXT_NODE){t.nodeValue!==e.nodeValue&&(t.nodeValue=e.nodeValue);return}if(t.nodeType===Node.ELEMENT_NODE||t.nodeType===Node.DOCUMENT_FRAGMENT_NODE){let r=t,o=e;if(t.nodeType===Node.ELEMENT_NODE){if(r.tagName!==o.tagName){r.parentNode?.replaceChild(o.cloneNode(!0),r);return}let l=r.attributes,d=o.attributes;for(let p=l.length-1;p>=0;p--){let c=l[p].name;o.hasAttribute(c)||r.removeAttribute(c)}for(let p=0;p<d.length;p++){let c=d[p].name,$=d[p].value;c==="value"&&r.value!==void 0?r.value!==$&&(r.value=$):r.getAttribute(c)!==$&&r.setAttribute(c,$)}}let a=Array.from(t.childNodes),s=Array.from(e.childNodes),n=Math.max(a.length,s.length);for(let l=0;l<n;l++)l>=a.length?t.appendChild(s[l].cloneNode(!0)):l>=s.length?t.removeChild(a[l]):Ue(a[l],s[l])}}var re=class extends HTMLElement{constructor(){if(super(),this.props={},this._isMounted=!1,this._hasRendered=!1,this._updatePending=!1,this._updateResolve=null,this._updatePromise=null,this._controllers=new Set,this._delegatedEvents=new Map,this._delegationRoots=new Set,this._effectCleanup=null,this.attachShadow({mode:"open"}),this.constructor.styles)try{let r=new CSSStyleSheet;r.replaceSync(this.constructor.styles),this.shadowRoot.adoptedStyleSheets=[r]}catch(r){console.error(`[${this.tagName}] CSS error:`,r)}let e=this.constructor.properties||{};this._propSignals={};for(let[r,o]of Object.entries(e)){let a=typeof o=="function"?o:o.type,s=typeof o=="object"?o:{},n=s.attribute||r,l=this.hasAttribute(n)?this.getAttribute(n):s.value,d=z(this._cast(l,a));this._propSignals[r]=d,Object.defineProperty(this,r,{get:()=>d.value,set:p=>{d.value=this._cast(p,a),s.reflect&&(p==null||p===!1?this.removeAttribute(n):this.setAttribute(n,p===!0?"":p))}})}}_cast(e,r){return e==null?e:r===Boolean?e!==null&&e!=="false":r===Number?Number(e):String(e)}static get observedAttributes(){let e=this.properties||{};return Object.entries(e).map(([r,o])=>typeof o=="object"&&o.attribute?o.attribute:r)}attributeChangedCallback(e,r,o){let a=this.constructor.properties||{};for(let[s,n]of Object.entries(a)){let l=typeof n=="function"?n:n.type;(typeof n=="object"&&n.attribute?n.attribute:s)===e&&this._propSignals[s]&&(this._propSignals[s].value=this._cast(o,l))}}addController(e){if(this._controllers.add(e),this._isMounted&&e.hostConnected)try{e.hostConnected()}catch(r){console.error(`[${this.tagName}] controller.hostConnected error:`,r)}}removeController(e){if(this._controllers.delete(e),this._isMounted&&e.hostDisconnected)try{e.hostDisconnected()}catch(r){console.error(`[${this.tagName}] controller.hostDisconnected error:`,r)}}connectedCallback(){this._isMounted=!0;try{this.onMount()}catch(e){console.error(`[${this.tagName}] onMount error:`,e)}for(let e of this._controllers)if(e.hostConnected)try{e.hostConnected()}catch(r){console.error(`[${this.tagName}] controller.hostConnected error:`,r)}this._effectCleanup=te(()=>{try{let e=this.render();this.requestUpdate(e)}catch(e){console.error(`[${this.tagName}] render error:`,e),this._showError(e)}})}requestUpdate(e){return this._latestResult=e||this.render(),this._updatePending||(this._updatePending=!0,this._updatePromise=new Promise(r=>{this._updateResolve=r}),queueMicrotask(()=>this.performUpdate())),this._updatePromise}get updateComplete(){return this._updatePromise||Promise.resolve()}performUpdate(){if(!this._isMounted){this._updatePending=!1,this._updateResolve&&(this._updateResolve(),this._updateResolve=null);return}try{let e=this._latestResult;if(e instanceof j)ct(e,this.shadowRoot);else if(e)if(!this._hasRendered)this.shadowRoot.innerHTML=e,this._hasRendered=!0;else{let r=document.createElement("template");r.innerHTML=e,Ue(this.shadowRoot,r.content)}}catch(e){console.error(`[${this.tagName}] performUpdate error:`,e),this._showError(e)}this._updatePending=!1;try{this.onRendered()}catch(e){console.error(`[${this.tagName}] onRendered error:`,e)}for(let e of this._controllers)if(e.hostUpdated)try{e.hostUpdated()}catch(r){console.error(`[${this.tagName}] controller.hostUpdated error:`,r)}this._updateResolve&&(this._updateResolve(),this._updateResolve=null,this._updatePromise=null)}_showError(e){this.shadowRoot&&(this.shadowRoot.innerHTML=`
			<div style="padding:16px;background:#1e0000;border:1px solid #f87171;border-radius:8px;font-family:monospace;font-size:0.82rem;color:#fca5a5">
				<div style="font-weight:600;margin-bottom:6px">\u26A0 Component Error</div>
				<div style="color:#f87171;word-break:break-all">${e.message||e}</div>
			</div>`)}disconnectedCallback(){if(this._isMounted=!1,this._effectCleanup){try{this._effectCleanup()}catch(e){console.error(`[${this.tagName}] effect cleanup error:`,e)}this._effectCleanup=null}for(let e of this._controllers)if(e.hostDisconnected)try{e.hostDisconnected()}catch(r){console.error(`[${this.tagName}] controller.hostDisconnected error:`,r)}try{this.onDestroy()}catch(e){console.error(`[${this.tagName}] onDestroy error:`,e)}}render(){try{if(this.constructor.template)return this.constructor.template(this)}catch(e){console.error(`[${this.tagName}] template render error:`,e)}return""}onMount(){}onRendered(){}onDestroy(){}query(e){return this.shadowRoot?this.shadowRoot.querySelector(e):null}queryAll(e){return this.shadowRoot?this.shadowRoot.querySelectorAll(e):[]}emit(e,r={},o={}){let a=new CustomEvent(e,{detail:r,bubbles:o.bubbles!==!1,composed:o.composed!==!1,...o});return this.dispatchEvent(a),a}delegate(e,r,o){this._delegatedEvents.has(e)||this._delegatedEvents.set(e,[]),this._delegatedEvents.get(e).push({selector:r,listener:o}),this._delegationRoots.has(e)||(this._delegationRoots.add(e),setTimeout(()=>{this.shadowRoot&&this.shadowRoot.addEventListener(e,a=>{let s=a.target,n=this._delegatedEvents.get(e)||[];for(let l of n)if(s.matches(l.selector)||s.closest(l.selector))try{l.listener(a)}catch(d){console.error(`[${this.tagName}] delegate ${e} ${l.selector} error:`,d)}})},0))}static define(e){let r=class extends(e.base||this){};if(e.properties&&(r.properties=e.properties),e.template&&(r.template=e.template),e.styles&&(r.styles=e.styles),e.methods)for(let[o,a]of Object.entries(e.methods))r.prototype[o]=a;return customElements.define(e.name,r),r}};var D,N,oe,Be=class{constructor(){be(this,D,new Map);be(this,N,[]);be(this,oe,!1)}register(e){if(!e?.name)throw new Error("Plugin must have a name");if(R(this,D).has(e.name))throw new Error(`Plugin "${e.name}" already registered`);return e.state||(e.state=f({})),typeof e.init!="function"&&(e.init=async()=>{}),typeof e.render!="function"&&(e.render=()=>""),R(this,D).set(e.name,e),R(this,N).push(e.name),this}unregister(e){let r=R(this,D).get(e);return r?(typeof r.onUnmount=="function"&&r.onUnmount(),R(this,D).delete(e),Ie(this,N,R(this,N).filter(o=>o!==e)),!0):!1}get(e){return R(this,D).get(e)||null}has(e){return R(this,D).has(e)}get names(){return[...R(this,N)]}get all(){return R(this,N).map(e=>R(this,D).get(e))}get size(){return R(this,D).size}async initAll(){if(R(this,oe))return;let e=this.all.map(r=>Promise.resolve().then(()=>r.init()));await Promise.all(e),Ie(this,oe,!0)}mountAll(e){for(let r of this.all)typeof r.onMount=="function"&&r.onMount(e)}unmountAll(){for(let e of this.all)typeof e.onUnmount=="function"&&e.onUnmount()}collectStates(){let e={};for(let r of this.all){let o={};for(let a of Object.keys(r.state))try{o[a]=JSON.parse(JSON.stringify(r.state[a]))}catch{o[a]=String(r.state[a])}e[r.name]=o}return e}mergeStates(){let e={};for(let r of this.all)for(let[o,a]of Object.entries(r.state))e[o]=a;return e}};D=new WeakMap,N=new WeakMap,oe=new WeakMap;var pt=new Be;var we={};C(we,{init:()=>ut,render:()=>ye,state:()=>y});var y=f({sysInfo:null,hostname:"",username:"",uname:null,memory:null,uptime:null,diskInfo:null});async function ut(){try{y.sysInfo=await window.rpc.systemInfo()}catch(t){y.sysInfo={error:t.message}}try{y.hostname=(await window.rpc.hostname()).hostname}catch(t){y.hostname=`err: ${t.message}`}try{y.username=(await window.rpc.username()).username}catch(t){y.username=`err: ${t.message}`}try{y.uname=await window.rpc.uname()}catch(t){y.uname={error:t.message}}try{y.memory=await window.rpc.memoryInfo()}catch(t){y.memory={error:t.message}}try{y.uptime=await window.rpc.uptime()}catch(t){y.uptime={error:t.message}}try{y.diskInfo=await window.rpc.diskUsage("/")}catch(t){y.diskInfo={error:t.message}}}function ye(){let{sysInfo:t,hostname:e,username:r,uname:o,memory:a,uptime:s,diskInfo:n}=y;return`
    <!-- System Info -->
    <div class="card">
      <div class="hdr">System</div>
      <div class="bd">
        ${t?t.error?`<span class="err">${t.error}</span>`:`<div class="mono">Platform: ${t.platform}<br>Home: ${t.homeDir}</div>`:"<em>loading\u2026</em>"}
        <div class="mono" style="margin-top:6px">Host: ${e}<br>User: ${r}</div>
      </div>
    </div>

    <!-- Uname -->
    <div class="card">
      <div class="hdr">Kernel</div>
      <div class="bd">
        ${o?o.error?`<span class="err">${o.error}</span>`:`<div class="mono">${o.sysname} ${o.release}<br>${o.machine}<br>${o.version}</div>`:"<em>loading\u2026</em>"}
      </div>
    </div>

    <!-- Memory -->
    <div class="card">
      <div class="hdr">Memory</div>
      <div class="bd">
        ${a?a.error?`<span class="err">${a.error}</span>`:`<div class="mono">Total: ${(a.total/1024/1024).toFixed(1)} MB<br>Available: ${(a.available/1024/1024).toFixed(1)} MB<br>Used: ${a.usedPercent} %</div>`:"<em>loading\u2026</em>"}
      </div>
    </div>

    <!-- Uptime -->
    <div class="card">
      <div class="hdr">Uptime</div>
      <div class="bd">
        ${s?s.error?`<span class="err">${s.error}</span>`:`<div class="mono">${Math.floor(s.seconds/3600)}h ${Math.floor(s.seconds%3600/60)}m</div>`:"<em>loading\u2026</em>"}
      </div>
    </div>

    <!-- Disk -->
    <div class="card">
      <div class="hdr">Disk Usage (/)</div>
      <div class="bd">
        ${n?n.error?`<span class="err">${n.error}</span>`:`<div class="mono">Total: ${(n.total/1024/1024/1024).toFixed(1)} GB<br>Used: ${n.usedPercent} %<br>Free: ${(n.free/1024/1024/1024).toFixed(1)} GB</div>`:"<em>loading\u2026</em>"}
      </div>
    </div>`}var se={};C(se,{init:()=>Ke,loadRepos:()=>F,onMount:()=>Zt,render:()=>ae,state:()=>v});var v=f({gitUrl:"",gitStatus:"",gitLoading:!1,gitRepos:[],gitTrashRepos:[]});async function F(){try{let t=await window.rpc.gitList();v.gitRepos=t.repos||[]}catch{v.gitRepos=[]}try{let t=await window.rpc.gitTrashList();v.gitTrashRepos=t.repos||[]}catch{v.gitTrashRepos=[]}}async function Ke(){await F()}function Zt(t){t.delegate("click","#btn-git-clone",async()=>{if(v.gitUrl){v.gitLoading=!0,v.gitStatus="";try{let e=await window.rpc.gitClone(v.gitUrl);e.error?v.gitStatus=e.error:(v.gitStatus=`Cloned "${e.repoName}" into workspace/`,v.gitUrl="",await F())}catch(e){v.gitStatus=e.message}finally{v.gitLoading=!1}}}),t.delegate("input","#git-url",e=>v.gitUrl=e.target.value),t.delegate("click",".btn-git-remove",async e=>{let r=e.target.dataset.repo;if(!(!r||!confirm(`Remove "${r}" from workspace?`)))try{await window.rpc.gitRemove(r),await F()}catch(o){alert(o.message)}}),t.delegate("click",".btn-git-restore",async e=>{let r=e.target.dataset.repo;if(r)try{await window.rpc.gitRestore(r),await F()}catch(o){alert(o.message)}}),t.delegate("click","#btn-git-refresh",async()=>{await F()})}function ae(){let{gitUrl:t,gitStatus:e,gitLoading:r,gitRepos:o,gitTrashRepos:a}=v;return`
    <div class="card feature-card full-width">
      <div class="hdr">
        <span>Workspace</span>
        <button id="btn-git-refresh" class="btn-icon" title="Refresh">\u21BB Refresh</button>
      </div>
      <div class="bd">
        <label>Add Repository</label>
        <div class="clone-input-row">
          <input id="git-url" value="${t}" placeholder="https://github.com/user/repo.git" />
          <button id="btn-git-clone" ${r?"disabled":""}>
            ${r?"Cloning\u2026":"+ Add Repo"}
          </button>
        </div>
        ${e?`<div class="git-status ${e.includes("Error")||e.includes("error")?"err":"ok"}">${e}</div>`:""}

        <label style="margin-top:20px">Cloned Repositories</label>
        ${o.length?`
          <div class="repo-list">
            ${o.map(s=>`
              <div class="repo-item">
                <span class="repo-name">\u{1F4C1} ${s}</span>
                <button class="btn-remove btn-git-remove" data-repo="${s}" title="Remove">\u2715 Remove</button>
              </div>
            `).join("")}
          </div>
        `:'<div class="empty-state">No repositories cloned yet. Add a repo URL above to get started.</div>'}

        ${a.length?`
          <label style="margin-top:20px; color:#f87171;">Removed Repositories (Trash)</label>
          <div class="repo-list">
            ${a.map(s=>`
              <div class="repo-item" style="border-color:rgba(248,113,113,0.3); background:rgba(248,113,113,0.05);">
                <span class="repo-name" style="color:#fca5a5; text-decoration:line-through;">\u{1F4C1} ${s}</span>
                <button class="btn-restore btn-git-restore" data-repo="${s}" title="Undo removal">\u21A9 Undo</button>
              </div>
            `).join("")}
          </div>
        `:""}
      </div>
    </div>`}var ke={};C(ke,{init:()=>ft,onMount:()=>er,render:()=>$e,state:()=>g});var g=f({listDirPath:"/",dirEntries:[],fileContent:"",filePath:"/tmp/test.txt",statInfo:null,statPath:"/",globPat:"**/*.json",globResults:[]});async function ft(){}function er(t){t.delegate("click","#btn-ls",async()=>{let e=await window.rpc.listDir(g.listDirPath);e.error?alert("List Error: "+e.error):g.dirEntries=e.entries||[]}),t.delegate("input","#ls-path",e=>g.listDirPath=e.target.value),t.delegate("click","#btn-read",async()=>{let e=await window.rpc.readFile(g.filePath);e.error?alert("Read Error: "+e.error):g.fileContent=e.content||""}),t.delegate("click","#btn-write",async()=>{let e=await window.rpc.writeFile(g.filePath,g.fileContent);e.error?alert("Write Error: "+e.error):alert("Wrote to "+g.filePath)}),t.delegate("input","#file-path",e=>g.filePath=e.target.value),t.delegate("input","#file-content",e=>g.fileContent=e.target.value),t.delegate("click","#btn-stat",async()=>{let e=await window.rpc.stat(g.statPath);e.error?alert("Stat Error: "+e.error):g.statInfo=e}),t.delegate("input","#stat-path",e=>g.statPath=e.target.value),t.delegate("click","#btn-glob",async()=>{let e=await window.rpc.glob(g.globPat);e.error?alert("Glob Error: "+e.error):g.globResults=e.matches||[]}),t.delegate("input","#glob-pat",e=>g.globPat=e.target.value)}function $e(){let{listDirPath:t,dirEntries:e,filePath:r,fileContent:o,statInfo:a,statPath:s,globResults:n,globPat:l}=g;return`
    <!-- Glob -->
    <div class="card">
      <div class="hdr">Glob</div>
      <div class="bd">
        <label>Pattern</label>
        <input id="glob-pat" value="${l}" />
        <button id="btn-glob">Search</button>
        <div style="margin-top:6px">${n.length?n.map(d=>`<span class="badge">${d}</span>`).join(" "):'<span style="color:#94a3b8">(no matches)</span>'}</div>
      </div>
    </div>

    <!-- Stat -->
    <div class="card">
      <div class="hdr">Stat</div>
      <div class="bd">
        <label>Path</label>
        <input id="stat-path" value="${s}" />
        <button id="btn-stat">Stat</button>
        ${a?`<div class="mono" style="margin-top:6px">size: ${a.size}<br>dir: ${a.isDir}<br>link: ${a.isLink}<br>mode: ${a.mode}</div>`:""}
      </div>
    </div>

    <!-- File Browser (full width) -->
    <div class="card">
      <div class="hdr">File Browser</div>
      <div class="bd">
        <label>Path</label>
        <input id="ls-path" value="${t}" />
        <button id="btn-ls">List</button>
        <div style="margin-top:6px">${e.length?e.map(d=>`<span class="badge">${d}</span>`).join(" "):'<span style="color:#94a3b8">(empty)</span>'}</div>
      </div>
    </div>

    <!-- File Editor (full width) -->
    <div class="card">
      <div class="hdr">File Editor</div>
      <div class="bd">
        <label>File Path</label>
        <input id="file-path" value="${r}" />
        <label>Content</label>
        <textarea id="file-content">${o}</textarea>
        <div><button id="btn-read">Read</button><button id="btn-write">Write</button></div>
      </div>
    </div>`}var Ce={};C(Ce,{init:()=>mt,onMount:()=>tr,render:()=>Se,state:()=>w});var w=f({envKey:"HOME",envVal:"",clipText:"",execCmd:"uname -a",execResult:"",whichCmd:"",whichFound:!1});async function mt(){}function tr(t){t.delegate("click","#btn-env",async()=>{let e=await window.rpc.envGet(w.envKey);e.error?w.envVal="not set":w.envVal=e.value}),t.delegate("input","#env-key",e=>w.envKey=e.target.value),t.delegate("click","#btn-clip-get",async()=>{let e=await window.rpc.clipboardGet();e.error?alert("Clipboard Error: "+e.error):w.clipText=e.text}),t.delegate("click","#btn-clip-set",async()=>{let e=await window.rpc.clipboardSet(w.clipText);e.error?alert("Clipboard Error: "+e.error):alert("Copied!")}),t.delegate("input","#clip-text",e=>w.clipText=e.target.value),t.delegate("click","#btn-exec",async()=>{let e=await window.rpc.exec(w.execCmd);e.error?w.execResult="Error: "+e.error:w.execResult=e.output||"(no output)"}),t.delegate("input","#exec-cmd",e=>w.execCmd=e.target.value),t.delegate("click","#btn-which",async()=>{let e=await window.rpc.which(w.whichCmd);w.whichFound=e.found}),t.delegate("input","#which-cmd",e=>w.whichCmd=e.target.value)}function Se(){let{envKey:t,envVal:e,clipText:r,execCmd:o,execResult:a,whichCmd:s,whichFound:n}=w;return`
    <!-- Env -->
    <div class="card">
      <div class="hdr">Environment</div>
      <div class="bd">
        <label>Key</label>
        <input id="env-key" value="${t}" />
        <button id="btn-env">Get</button>
        ${e?`<div class="mono" style="margin-top:6px">${e}</div>`:""}
      </div>
    </div>

    <!-- Clipboard -->
    <div class="card">
      <div class="hdr">Clipboard</div>
      <div class="bd">
        <textarea id="clip-text">${r}</textarea>
        <div><button id="btn-clip-get">Paste</button><button id="btn-clip-set">Copy</button></div>
      </div>
    </div>

    <!-- Exec -->
    <div class="card">
      <div class="hdr">Execute</div>
      <div class="bd">
        <label>Command</label>
        <input id="exec-cmd" value="${o}" />
        <button id="btn-exec">Run</button>
        ${a?`<div class="mono" style="margin-top:6px">${a}</div>`:""}
      </div>
    </div>

    <!-- Which -->
    <div class="card">
      <div class="hdr">which</div>
      <div class="bd">
        <label>Program</label>
        <input id="which-cmd" value="${s}" />
        <button id="btn-which">Check</button>
        ${s?`<div style="margin-top:6px">${n?'<span class="ok">found</span>':'<span class="err">not found</span>'}</div>`:""}
      </div>
    </div>`}var H={};C(H,{init:()=>He,onMount:()=>or,refresh:()=>Ve,render:()=>q,state:()=>h});var h=f({memory:null,disk:null,uptime:null,hostname:"",loadAvg:"",refreshing:!1});function bt(t){let e=Math.max(0,Math.min(100,t||0)),r=Math.round(e/5),o=20-r;return`<span style="color:${e>80?"#f87171":e>60?"#fbbf24":"#34d399"}">${"\u2588".repeat(r)}${"\u2591".repeat(o)}</span> ${e.toFixed(1)}%`}function Re(t){return t==null?"\u2014":t<1024?t+" B":t<1048576?(t/1024).toFixed(1)+" KB":t<1073741824?(t/1048576).toFixed(1)+" MB":(t/1073741824).toFixed(2)+" GB"}function rr(t){if(t==null)return"\u2014";let e=Math.floor(t/86400),r=Math.floor(t%86400/3600),o=Math.floor(t%3600/60);return e>0?`${e}d ${r}h ${o}m`:r>0?`${r}h ${o}m`:`${o}m`}async function He(){try{h.memory=await window.rpc.memoryInfo()}catch(t){h.memory={error:t.message}}try{h.disk=await window.rpc.diskUsage("/")}catch(t){h.disk={error:t.message}}try{h.uptime=await window.rpc.uptime()}catch(t){h.uptime={error:t.message}}try{h.hostname=(await window.rpc.hostname()).hostname}catch{h.hostname="\u2014"}try{let t=await window.rpc.exec("cat /proc/loadavg");t.error||(h.loadAvg=t.output.trim().split(" ").slice(0,3).join("  "))}catch{h.loadAvg="\u2014"}}async function Ve(){h.refreshing=!0,await He(),h.refreshing=!1}function or(t){t.delegate("click","#btn-health-refresh",()=>Ve())}function q(){let t=h.memory,e=h.disk,r=h.uptime,o=t&&!t.error?t.usedPercent:0,a=e&&!e.error?e.usedPercent:0,s=t&&!t.error?Re(t.total-t.available):"\u2014",n=t&&!t.error?Re(t.total):"\u2014",l=e&&!e.error?Re(e.total-e.free):"\u2014",d=e&&!e.error?Re(e.total):"\u2014";return E`
		<div class="card">
			<div class="hdr">
				<span>System Health</span>
				<button id="btn-health-refresh" class="btn-icon" title="Refresh">↻</button>
			</div>
			<div class="bd">
				<div style="margin-bottom:12px">
					<label>Memory</label>
					<div class="mono" style="font-size:0.8rem">${t&&!t.error?bt(o):"\u2014"}</div>
					<div style="font-size:0.75rem;color:#64748b;margin-top:4px">${s} / ${n}</div>
				</div>
				<div style="margin-bottom:12px">
					<label>Disk (/)</label>
					<div class="mono" style="font-size:0.8rem">${e&&!e.error?bt(a):"\u2014"}</div>
					<div style="font-size:0.75rem;color:#64748b;margin-top:4px">${l} / ${d}</div>
				</div>
				<div>
					<label>System</label>
					<div class="mono" style="font-size:0.8rem">
Host: ${h.hostname}
Uptime: ${r&&!r.error?rr(r.seconds):"\u2014"}
Load: ${h.loadAvg||"\u2014"}
					</div>
				</div>
			</div>
		</div>
	`}var ne={};C(ne,{init:()=>gt,onMount:()=>sr,render:()=>Q,state:()=>b});var b=f({procs:[],loading:!1,sortBy:"cpu",autoRefresh:!1,_filter:""}),ar=xe(()=>{let t=b._filter.toLowerCase();return t?b.procs.filter(e=>(e.command+e.user).toLowerCase().includes(t)):b.procs}),ze=null;nt(()=>b.autoRefresh,t=>{t?ze=setInterval(V,3e3):ze&&(clearInterval(ze),ze=null)});async function gt(){await V()}async function V(){b.loading=!0;try{let t=await window.rpc.psList(b.sortBy);t&&!t.error&&(b.procs=t)}catch{}b.loading=!1}function sr(t){t.delegate("click","#btn-proc-refresh",()=>V()),t.delegate("click","#btn-proc-sort-cpu",()=>{b.sortBy="cpu",V()}),t.delegate("click","#btn-proc-sort-mem",()=>{b.sortBy="mem",V()}),t.delegate("click","#btn-proc-auto",()=>{b.autoRefresh=!b.autoRefresh}),t.delegate("input","#proc-filter",e=>{b._filter=e.target.value}),t.delegate("click","[data-kill-pid]",e=>{let r=e.target.closest("[data-kill-pid]").dataset.killPid;confirm(`Kill PID ${r}?`)&&window.rpc.psKill(r).then(()=>V())})}function Q(){let e=ar.value.map(r=>{let o=r.cpu>50?"#f87171":r.cpu>20?"#fbbf24":"#34d399",a=r.mem>50?"#f87171":r.mem>20?"#fbbf24":"#34d399";return`<div style="display:grid;grid-template-columns:40px 50px 50px 50px 1fr 40px;gap:4px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.03);font-size:0.78rem;font-family:ui-monospace,'Fira Code',monospace">
			<span style="color:#94a3b8">${r.pid}</span>
			<span style="color:${o}">${r.cpu}%</span>
			<span style="color:${a}">${r.mem}%</span>
			<span style="color:#94a3b8">${r.rss}</span>
			<span style="color:#cbd5e1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.command}</span>
			<button data-kill-pid="${r.pid}" style="background:rgba(248,113,113,0.15);border:1px solid rgba(248,113,113,0.3);color:#f87171;padding:1px 6px;border-radius:4px;cursor:pointer;font-size:0.7rem;margin:0;box-shadow:none">\u2715</button>
		</div>`}).join("");return E`
		<div class="card">
			<div class="hdr">
				<span>Process Monitor</span>
				<div style="display:flex;gap:6px">
					<button id="btn-proc-auto" class="btn-icon" title="Auto-refresh" style="font-size:0.75rem;padding:4px 8px;${b.autoRefresh?"color:#34d399;border-color:rgba(52,211,153,0.4)":""}">${b.autoRefresh?"\u23F8 Auto":"\u23F5 Auto"}</button>
					<button id="btn-proc-refresh" class="btn-icon" title="Refresh">↻</button>
				</div>
			</div>
			<div class="bd">
				<div style="display:flex;gap:8px;margin-bottom:10px;align-items:center">
					<input id="proc-filter" placeholder="Filter…" style="margin:0;flex:1;padding:8px 10px;font-size:0.8rem" value="${b._filter}" />
					<button id="btn-proc-sort-cpu" class="btn-icon" style="font-size:0.75rem;padding:4px 8px;${b.sortBy==="cpu"?"color:#818cf8;border-color:rgba(129,140,248,0.4)":""}">CPU</button>
					<button id="btn-proc-sort-mem" class="btn-icon" style="font-size:0.75rem;padding:4px 8px;${b.sortBy==="mem"?"color:#818cf8;border-color:rgba(129,140,248,0.4)":""}">MEM</button>
				</div>
				<div style="display:grid;grid-template-columns:40px 50px 50px 50px 1fr 40px;gap:4px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:0.7rem;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">
					<span>PID</span><span>CPU</span><span>MEM</span><span>RSS</span><span>COMMAND</span><span></span>
				</div>
				${b.loading?'<div style="text-align:center;padding:16px;color:#64748b">Loading\u2026</div>':e||'<div style="text-align:center;padding:16px;color:#64748b">No processes</div>'}
			</div>
		</div>
	`}var ie={};C(ie,{init:()=>ht,onMount:()=>ir,render:()=>W,state:()=>x});var nr=[{label:"uname -a",cmd:"uname -a",icon:"\u2295"},{label:"lsblk",cmd:"lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINT",icon:"\u2299"},{label:"lscpu",cmd:"lscpu | head -20",icon:"\u25CE"},{label:"df -h",cmd:"df -h --total",icon:"\u229E"},{label:"free -h",cmd:"free -h",icon:"\u229F"},{label:"ip addr",cmd:"ip -br addr",icon:"\u2297"},{label:"ss -tlnp",cmd:"ss -tlnp",icon:"\u2298"},{label:"docker ps",cmd:'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}" 2>/dev/null || echo "Docker not running"',icon:"\u229E"}],x=f({output:"",lastCmd:"",running:!1,history:[]});async function ht(){}function ir(t){t.delegate("click","[data-run-cmd]",e=>{let r=e.target.closest("[data-run-cmd]");r&&Qe(r.dataset.runCmd)}),t.delegate("click","#btn-run-custom",()=>{let e=t.shadowRoot&&t.shadowRoot.querySelector("#custom-cmd");e&&e.value.trim()&&Qe(e.value.trim())}),t.delegate("keydown","#custom-cmd",e=>{if(e.key==="Enter"){let r=e.target.value.trim();r&&Qe(r)}}),t.delegate("click","#btn-clear-output",()=>{x.output="",x.lastCmd=""})}async function Qe(t){x.running=!0,x.lastCmd=t;try{let e=await window.rpc.exec(t);e.error?x.output=`Error: ${e.error}`:(x.output=e.output||"(no output)",x.history=[{cmd:t,time:new Date().toLocaleTimeString()},...x.history.filter(r=>r.cmd!==t).slice(0,9)])}catch(e){x.output=`Error: ${e.message}`}x.running=!1}function W(){let t=nr.map(r=>`<button data-run-cmd="${r.cmd.replace(/"/g,"&quot;")}" class="btn-icon" style="font-size:0.78rem;padding:5px 10px;white-space:nowrap">${r.icon} ${r.label}</button>`).join(""),e=x.history.length?x.history.map(r=>`<span data-run-cmd="${r.cmd.replace(/"/g,"&quot;")}" style="cursor:pointer;font-size:0.72rem;color:#64748b;padding:2px 6px;background:rgba(255,255,255,0.03);border-radius:4px;white-space:nowrap" title="${r.cmd.replace(/"/g,"&quot;")}">${r.cmd.length>20?r.cmd.substring(0,20)+"\u2026":r.cmd}</span>`).join(" "):"";return E`
		<div class="card">
			<div class="hdr">
				<span>Quick Commands</span>
				${x.lastCmd?`<span style="font-size:0.75rem;color:#94a3b8;font-family:ui-monospace,'Fira Code',monospace">${x.lastCmd}</span>`:""}
			</div>
			<div class="bd">
				<div style="display:flex;gap:8px;margin-bottom:12px;align-items:stretch">
					<input id="custom-cmd" placeholder="Type a command…" style="margin:0;flex:1;padding:10px 12px;font-size:0.85rem;font-family:ui-monospace,'Fira Code',monospace" />
					<button id="btn-run-custom" style="margin:0;white-space:nowrap">Run</button>
				</div>
				<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">
					${t}
				</div>
				${e?`<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px">${e}</div>`:""}
				<div style="position:relative">
					<pre class="mono" style="margin:0;min-height:60px;max-height:300px;overflow:auto;font-size:0.8rem">${x.running?'<span style="color:#fbbf24">Running\u2026</span>':x.output||'<span style="color:#64748b">Output will appear here</span>'}</pre>
					${x.output?'<button id="btn-clear-output" class="btn-icon" style="position:absolute;top:4px;right:4px;font-size:0.7rem;padding:2px 6px">\u2715</button>':""}
				</div>
			</div>
		</div>
	`}var Ee={};C(Ee,{init:()=>xt,onMount:()=>lr,render:()=>We,state:()=>T});var T=f({interfaces:[],gateway:"",dns:"",publicIp:"",loading:!1});async function xt(){T.loading=!0;try{let t=await window.rpc.exec("ip -br addr");!t.error&&t.output&&(T.interfaces=t.output.trim().split(`
`).map(e=>{let r=e.trim().split(/\s+/),o=r[0]||"",a=r[1]==="UP",s=r.find(l=>l.includes("."))||"",n=r.find(l=>l.includes(":"))||"";return{name:o,isUp:a,ipv4:s,ipv6:n}}).filter(e=>e.name&&e.name!=="lo"))}catch{}try{let t=await window.rpc.exec("ip route show default");if(!t.error&&t.output){let e=t.output.match(/via\s+(\S+)/);T.gateway=e?e[1]:""}}catch{}try{let t=await window.rpc.exec("cat /etc/resolv.conf | grep nameserver");!t.error&&t.output&&(T.dns=t.output.trim().split(`
`).map(e=>e.replace("nameserver","").trim()).join(", "))}catch{}try{let t=await window.rpc.exec("curl -s --max-time 3 ifconfig.me");!t.error&&t.output&&(T.publicIp=t.output.trim())}catch{}T.loading=!1}function lr(t){t.delegate("click","#btn-net-refresh",()=>xt())}function We(){let t=T.interfaces.map(e=>{let r=e.isUp?"\u25CF":"\u25CB";return`<div style="display:grid;grid-template-columns:80px 1fr;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.03);font-size:0.82rem;align-items:center">
			<span style="color:${e.isUp?"#34d399":"#64748b"}">${r} ${e.name}</span>
			<span style="font-family:ui-monospace,'Fira Code',monospace;color:#cbd5e1;font-size:0.78rem">${e.ipv4||e.ipv6||"\u2014"}</span>
		</div>`}).join("");return E`
		<div class="card">
			<div class="hdr">
				<span>Network Info</span>
				<button id="btn-net-refresh" class="btn-icon" title="Refresh">↻</button>
			</div>
			<div class="bd">
				${T.loading?'<div style="text-align:center;padding:20px;color:#64748b">Loading\u2026</div>':`
				<div style="margin-bottom:12px">
					<label>Interfaces</label>
					${t||'<div style="color:#64748b;font-size:0.85rem">No interfaces found</div>'}
				</div>
				<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
					<div>
						<label>Gateway</label>
						<div class="mono" style="font-size:0.8rem">${T.gateway||"\u2014"}</div>
					</div>
					<div>
						<label>DNS</label>
						<div class="mono" style="font-size:0.8rem">${T.dns||"\u2014"}</div>
					</div>
				</div>
				${T.publicIp?`
				<div style="margin-top:12px">
					<label>Public IP</label>
					<div class="mono" style="font-size:0.8rem">${T.publicIp}</div>
				</div>`:""}
				`}
			</div>
		</div>
	`}var de={};C(de,{init:()=>wt,onMount:()=>fr,render:()=>Y,state:()=>_});var Ye=new Map,Te=new Map,le=new Map,vt=new Map;function U(t,e){if(Ye.has(t))return Ye.get(t);let r={name:t,defaultValue:e,get value(){return Te.get(t)??e},set value(o){Te.set(t,o),yt(t,o),dr(t,o)},subscribe(o){return le.has(t)||le.set(t,new Set),le.get(t).add(o),o(Te.get(t)??e),()=>le.get(t)?.delete(o)},css(){return`--${t}: ${Te.get(t)??e};`},var(){return`var(--${t})`}};return Ye.set(t,r),r}function yt(t,e){let r=`--${t}`;document.documentElement.style.setProperty(r,e)}function dr(t,e){let r=le.get(t);if(r)for(let o of r)o(e)}function cr(t){for(let[e,r]of Object.entries(t)){let o=U(e);o.value=r}}function Ge(t,e){let r={};for(let[o,a]of Object.entries(e)){let s=U(`${t}-${o}`);s.value=a,r[o]=s}return vt.set(t,r),r}function Je(t){let e=vt.get(t);if(e)for(let[r,o]of Object.entries(e))yt(o.name,o.value)}var pr={"color-bg":"#0f172a","color-bg-card":"rgba(30, 41, 59, 0.4)","color-bg-input":"rgba(15, 23, 42, 0.5)","color-bg-hover":"rgba(15, 23, 42, 0.8)","color-text":"#f8fafc","color-text-muted":"#94a3b8","color-text-secondary":"#cbd5e1","color-primary":"#4f46e5","color-primary-hover":"#4338ca","color-success":"#10b981","color-success-hover":"#059669","color-error":"#f87171","color-error-bg":"rgba(248, 113, 113, 0.1)","color-border":"rgba(255, 255, 255, 0.08)","color-border-focus":"#6366f1","spacing-xs":"4px","spacing-sm":"8px","spacing-md":"16px","spacing-lg":"24px","spacing-xl":"40px","radius-sm":"6px","radius-md":"8px","radius-lg":"16px","font-family":"'Inter', system-ui, sans-serif","font-family-mono":"ui-monospace, 'Fira Code', monospace","font-size-sm":"0.85rem","font-size-md":"0.95rem","font-size-lg":"1.05rem"};function Pe(){cr(pr)}Pe();var wo=U("color-success"),$o=U("color-bg-hover"),_=f({data:null,refreshing:!1}),ur=xe(()=>{if(!_.data||!Array.isArray(_.data.loadAvg))return null;let t=_.data.cpuCores||1;return _.data.loadAvg.map(e=>(e/t).toFixed(2))});async function wt(){await $t()}async function $t(){_.refreshing=!0;try{_.data=await window.rpc.systemProbe()}catch(t){_.data={error:t.message}}_.refreshing=!1}function fr(t){t.delegate("click","#btn-probe-refresh",()=>$t())}function Y(){let t=_.data,e=ur.value;return E`
		<div class="card">
			<div class="hdr">
				<span>System Probe</span>
				<button id="btn-probe-refresh" class="btn-icon" title="Refresh">↻</button>
			</div>
			<div class="bd">
				${t?t.error?`<span class="err">${t.error}</span>`:t.loadAvg?`
					<label style="font-size:0.8rem;margin-bottom:12px">CPU Load (per core)</label>
					<div class="mono" style="font-size:0.8rem">
						${["1m","5m","15m"].map((r,o)=>`
							<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
								<span style="color:#64748b;width:24px">${r}</span>
								<span style="color:${t.loadAvg[o]>t.cpuCores?"#f87171":t.loadAvg[o]>t.cpuCores*.7?"#fbbf24":"#34d399"}">
									${"\u2588".repeat(Math.min(20,Math.round(t.loadAvg[o]/Math.max(t.cpuCores,1)*20)))}
								</span>
								<span style="color:#94a3b8;font-size:0.75rem">${e?e[o]:"\u2014"}</span>
							</div>`).join("")}
					</div>

					<label style="font-size:0.8rem;margin:16px 0 8px">Processes</label>
					<div class="mono" style="font-size:0.8rem">
						Total: <span style="color:#cbd5e1">${t.procsTotal}</span>
						&nbsp;&nbsp;Running: <span style="color:#34d399">${t.procsRunning}</span>
					</div>

					<label style="font-size:0.8rem;margin:16px 0 8px">CPU Cores</label>
					<div class="mono" style="font-size:0.8rem">
						<span style="color:#cbd5e1">${t.cpuCores}</span>
					</div>
				`:'<div style="color:#64748b">No data available</div>':'<div style="color:#64748b">Loading\u2026</div>'}
			</div>
		</div>
	`}var ce={};C(ce,{init:()=>Ct,onMount:()=>mr,render:()=>G,state:()=>k});function kt(t,e){let r=f(t),o={};for(let a of Object.keys(e))o[a]=(...s)=>{let n=e[a](r,...s);return typeof n=="function"?n():n};return{state:r,actions:o}}var St=kt({path:"",exists:null,isDir:null,stat:null,error:null,busy:!1},{setPath:(t,e)=>{t.path=e,t.error=null},check:t=>async()=>{if(t.path){t.busy=!0,t.error=null;try{let[e,r,o]=await Promise.all([window.rpc.exists(t.path),window.rpc.isDir(t.path),window.rpc.stat(t.path)]);Fe(()=>{t.exists=e,t.isDir=r,t.stat=o})}catch(e){t.error=e.message}t.busy=!1}},mkdir:t=>async()=>{if(t.path){t.busy=!0,t.error=null;try{await window.rpc.mkdir(t.path),await t.actions.check()}catch(e){t.error=e.message}t.busy=!1}},remove:t=>async()=>{if(!(!t.path||!confirm(`Remove ${t.path}?`))){t.busy=!0,t.error=null;try{await window.rpc.remove(t.path),Fe(()=>{t.exists=!1,t.stat=null})}catch(e){t.error=e.message}t.busy=!1}}}),k=St.state,{actions:Me}=St;async function Ct(){}function mr(t){t.delegate("input","#ft-path",e=>Me.setPath(e.target.value)),t.delegate("click","#ft-check",()=>Me.check()),t.delegate("click","#ft-mkdir",()=>Me.mkdir()),t.delegate("click","#ft-remove",()=>Me.remove())}function G(){return E`
		<div class="card">
			<div class="hdr">File Tools</div>
			<div class="bd">
				<label style="font-size:0.8rem">Path</label>
				<div style="display:flex;gap:8px">
					<input id="ft-path" placeholder="/tmp/example" value="${k.path}" style="flex:1;margin:0" />
				</div>
				<div style="display:flex;gap:6px;margin-top:8px">
					<button id="ft-check" class="btn-icon" style="font-size:0.8rem" ${k.busy?"disabled":""}>Check</button>
					<button id="ft-mkdir" class="btn-icon" style="font-size:0.8rem" ${k.busy?"disabled":""}>Mkdir</button>
					<button id="ft-remove" class="btn-icon" style="font-size:0.8rem;color:#f87171" ${k.busy?"disabled":""}>Remove</button>
				</div>
				${k.error?`<div class="err" style="margin-top:8px">${k.error}</div>`:""}
				${k.exists!==null?`
					<div class="mono" style="margin-top:12px;font-size:0.8rem">
						Exists: <span style="color:${k.exists?"#34d399":"#f87171"}">${k.exists}</span>
						${k.isDir!==null?`<br>Is Dir: <span style="color:#94a3b8">${k.isDir}</span>`:""}
						${k.stat?`<br>Size: ${k.stat.size||"\u2014"}<br>Mode: ${k.stat.mode||"\u2014"}`:""}
					</div>
				`:""}
			</div>
		</div>
	`}var Ae={};C(Ae,{init:()=>zt,onMount:()=>hr,render:()=>_e,state:()=>L});Pe();var L=f({accentColor:"",successColor:""}),De=it("dark");Ge("dark",{card:"rgba(30, 41, 59, 0.4)","card-text":"#f1f5f9",accent:"#818cf8",success:"#34d399"});Ge("light",{card:"rgba(255, 255, 255, 0.85)","card-text":"#1e293b",accent:"#6366f1",success:"#059669"});Je("dark");var Rt=U("dark-accent"),br=U("dark-success");async function zt(){Xe()}function Xe(){L.accentColor=Rt.value,L.successColor=br.value}var gr;function hr(t){gr=Rt.subscribe(()=>Xe()),t.delegate("click","#btn-theme-toggle",()=>{let e=De.value==="dark"?"light":"dark";De.value=e,Je(e),Xe()})}function _e(){let t=De.value==="dark";return E`
		<div class="card">
			<div class="hdr">
				<span>Theme Switcher</span>
			</div>
			<div class="bd">
				<button id="btn-theme-toggle" style="background:${L.accentColor};color:#fff;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-weight:600;font-size:1rem;width:100%">
					Switch to ${t?"Light":"Dark"} Theme
				</button>

				<div class="mono" style="margin-top:16px;font-size:0.8rem">
					<div style="margin-bottom:8px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;font-size:0.75rem">Current Theme: ${De.value}</div>
					<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
						<span style="color:#94a3b8">Accent:</span>
						<span style="width:20px;height:20px;border-radius:4px;background:${L.accentColor};display:inline-block;border:1px solid rgba(255,255,255,0.1)"></span>
						<span style="color:#cbd5e1">${L.accentColor}</span>
					</div>
					<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
						<span style="color:#94a3b8">Success:</span>
						<span style="width:20px;height:20px;border-radius:4px;background:${L.successColor};display:inline-block;border:1px solid rgba(255,255,255,0.1)"></span>
						<span style="color:#cbd5e1">${L.successColor}</span>
					</div>
				</div>
			</div>
		</div>
	`}var pe={};C(pe,{init:()=>Et,onMount:()=>xr,render:()=>J,state:()=>M});var M=f({query:"",results:"",loading:!1});async function Et(){}function xr(t){t.delegate("click","#btn-search",async()=>{if(M.query.trim()){M.loading=!0,M.results="";try{let e=await window.rpc.search_query(M.query);e.error?M.results="Error: "+e.error:M.results=e.results||"(no matches)"}catch(e){M.results="Error: "+e.message}finally{M.loading=!1}}}),t.delegate("input","#search-term",e=>M.query=e.target.value),t.delegate("keydown","#search-term",e=>{e.key==="Enter"&&e.target.closest(".card").querySelector("#btn-search")?.click()})}function J(){let{query:t,results:e,loading:r}=M;return`
    <div class="card">
      <div class="hdr">
        <span>Code Search (git grep)</span>
        ${r?'<span style="color:#fbbf24;font-size:0.8rem">Searching\u2026</span>':""}
      </div>
      <div class="bd">
        <label>Search Term</label>
        <div style="display:flex;gap:8px">
          <input id="search-term" value="${t}" placeholder="e.g. TODO, function name, regex\u2026" style="flex:1;margin:0" />
          <button id="btn-search" ${r?"disabled":""}>Search</button>
        </div>
        ${e?`<div class="mono" style="margin-top:12px;max-height:400px;overflow:auto;white-space:pre-wrap;font-size:0.78rem">${e}</div>`:""}
      </div>
    </div>`}var ue={};C(ue,{init:()=>Tt,onMount:()=>vr,render:()=>X,state:()=>B});var B=f({data:null,loading:!1});async function Tt(){}function vr(t){t.delegate("click","#btn-metrics-refresh",async()=>{B.loading=!0;try{let e=await window.rpc.metrics_getStats();e.error?B.data={error:e.error}:B.data=e}catch(e){B.data={error:e.message}}finally{B.loading=!1}})}function yr(t){return t==null?"\u2014":t<1024?t+" B":t<1048576?(t/1024).toFixed(1)+" KB":t<1073741824?(t/1048576).toFixed(1)+" MB":(t/1073741824).toFixed(2)+" GB"}function X(){let{data:t,loading:e}=B;return`
    <div class="card">
      <div class="hdr">
        <span>Workspace Metrics</span>
        <button id="btn-metrics-refresh" class="btn-icon" title="Refresh">\u21BB</button>
      </div>
      <div class="bd">
        ${e?'<div style="text-align:center;padding:16px;color:#64748b">Loading\u2026</div>':t?t.error?`<span class="err">${t.error}</span>`:`
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div>
                <label>Total Files</label>
                <div class="mono" style="font-size:1.1rem">${t.total_files??"\u2014"}</div>
              </div>
              <div>
                <label>Total Size</label>
                <div class="mono" style="font-size:1.1rem">${yr(t.total_size_bytes)}</div>
              </div>
            </div>`:'<div style="color:#64748b;text-align:center;padding:16px">No workspace selected. Click Refresh to load metrics.</div>'}
      </div>
    </div>`}var fe={};C(fe,{init:()=>Pt,onMount:()=>wr,render:()=>Z,state:()=>m});var m=f({repoId:"",tree:null,fileContent:"",selectedFile:"",loading:!1,error:""});async function Pt(){}function wr(t){t.delegate("click","#btn-tree-load",async()=>{if(m.repoId.trim()){m.loading=!0,m.tree=null,m.error="",m.fileContent="",m.selectedFile="";try{let e=await window.rpc.get_tree(m.repoId);e.error?m.error=e.error:m.tree=e}catch(e){m.error=e.message}finally{m.loading=!1}}}),t.delegate("input","#tree-repo-id",e=>m.repoId=e.target.value),t.delegate("click",".tree-file",async e=>{let r=e.target.closest(".tree-file")?.dataset.entryId;if(r){m.loading=!0,m.error="";try{let o=await window.rpc.get_file_content(r);o.error?m.error=o.error:(m.fileContent=o,m.selectedFile=r.split("/").pop())}catch(o){m.error=o.message}finally{m.loading=!1}}})}function Mt(t,e=0){let r=e*16;if(t.type==="folder"){let o=t.children||[];return`
			<div style="padding-left:${r}px;margin-top:4px">
				<span style="color:#fbbf24">\u{1F4C1} ${t.name}</span>
			</div>
			${o.map(a=>Mt(a,e+1)).join("")}`}return`
		<div class="tree-file" data-entry-id="${t.id}" style="padding-left:${r}px;margin-top:2px;cursor:pointer;color:#94a3b8;font-size:0.82rem" onmouseover="this.style.color='#e2e8f0'" onmouseout="this.style.color='#94a3b8'">
			\u{1F4C4} ${t.name}
		</div>`}function Z(){let{repoId:t,tree:e,fileContent:r,selectedFile:o,loading:a,error:s}=m;return`
    <div class="card">
      <div class="hdr">
        <span>File Tree Browser</span>
      </div>
      <div class="bd">
        <label>Repo ID</label>
        <div style="display:flex;gap:8px">
          <input id="tree-repo-id" value="${t}" placeholder="e.g. 1" style="flex:1;margin:0" />
          <button id="btn-tree-load" ${a?"disabled":""}>Load</button>
        </div>
        ${s?`<div class="err" style="margin-top:8px">${s}</div>`:""}
        ${e?`
          <div style="margin-top:12px;max-height:300px;overflow:auto;background:rgba(0,0,0,0.2);border-radius:8px;padding:8px;font-size:0.82rem">
            ${Array.isArray(e)?e.map(n=>Mt(n)).join(""):'<span style="color:#64748b">No tree data</span>'}
          </div>`:""}
        ${r?`
          <div style="margin-top:12px">
            <label>${o}</label>
            <pre class="mono" style="max-height:300px;overflow:auto;font-size:0.78rem">${r}</pre>
          </div>`:""}
      </div>
    </div>`}var et={};C(et,{init:()=>$r,onMount:()=>zr,render:()=>Er,state:()=>i});var i=f({dbPath:"data.sqlite",tables:[],selectedTable:"",columns:[],rows:[],schema:[],newRow:{},editIdx:-1,editRow:{},sql:"",queryResult:null,loading:!1,error:""});async function $r(){try{await Ze()}catch(t){i.error=t.message}}async function Ze(){try{let t=await window.rpc.dbTables();if(t.error){i.error=t.error;return}i.tables=(t.rows||[]).map(e=>e.name),i.tables.length>0&&!i.selectedTable&&(i.selectedTable=i.tables[0],await me())}catch(t){i.error=t.message}}async function me(){if(i.selectedTable){i.loading=!0,i.error="";try{let t=await window.rpc.dbQuery(`SELECT * FROM ${i.selectedTable} LIMIT 200`);if(t.error){i.error=t.error,i.columns=[],i.rows=[];return}i.columns=t.columns||[],i.rows=t.rows||[];let e=await window.rpc.dbSchema(i.selectedTable);i.schema=(e.rows||[]).map(r=>({name:r.name,type:r.type,notnull:r.notnull==="1",dflt:r.dflt_value,pk:r.pk==="1"})),i.newRow={},i.columns.forEach(r=>{i.newRow[r]=""})}catch(t){i.error=t.message}finally{i.loading=!1}}}async function kr(){let t=i.columns.filter(o=>i.newRow[o]!=="");if(t.length===0)return;let e=t.map(o=>{let a=i.newRow[o];return isNaN(a)||a===""?`'${a.replace(/'/g,"''")}'`:a}).join(", "),r=`INSERT INTO ${i.selectedTable} (${t.join(", ")}) VALUES (${e})`;i.loading=!0;try{let o=await window.rpc.dbExec(r);if(o.error){i.error=o.error;return}i.newRow={},i.columns.forEach(a=>{i.newRow[a]=""}),await me()}catch(o){i.error=o.message}finally{i.loading=!1}}async function Sr(){if(i.editIdx<0)return;let t=i.schema.find(a=>a.pk)?.name||i.columns[0],e=i.rows[i.editIdx][t],r=i.columns.filter(a=>a!==t).map(a=>{let s=i.editRow[a];return isNaN(s)||s===""?`${a}='${s.replace(/'/g,"''")}'`:`${a}=${s}`}).join(", "),o=`UPDATE ${i.selectedTable} SET ${r} WHERE ${t}='${e}'`;i.loading=!0;try{let a=await window.rpc.dbExec(o);if(a.error){i.error=a.error;return}i.editIdx=-1,i.editRow={},await me()}catch(a){i.error=a.message}finally{i.loading=!1}}async function Cr(t){let e=i.schema.find(a=>a.pk)?.name||i.columns[0],r=i.rows[t][e],o=`DELETE FROM ${i.selectedTable} WHERE ${e}='${r}'`;i.loading=!0;try{let a=await window.rpc.dbExec(o);if(a.error){i.error=a.error;return}await me()}catch(a){i.error=a.message}finally{i.loading=!1}}async function Rr(){if(i.sql.trim()){i.loading=!0,i.error="",i.queryResult=null;try{let t=i.sql.trim().toLowerCase();if(t.startsWith("select")||t.startsWith("pragma")){let e=await window.rpc.dbQuery(i.sql);if(e.error){i.error=e.error;return}i.queryResult=e}else{let e=await window.rpc.dbExec(i.sql);if(e.error){i.error=e.error;return}i.queryResult={message:`OK \u2014 ${e.changes} row(s) affected`},await Ze()}}catch(t){i.error=t.message}finally{i.loading=!1}}}function zr(t){t.delegate("click","#btn-refresh-tables",()=>Ze()),t.delegate("change","#select-table",e=>{i.selectedTable=e.target.value,me()}),t.delegate("click","#btn-insert",()=>kr()),t.delegate("click","#btn-run-sql",()=>Rr()),t.delegate("input","#sql-input",e=>i.sql=e.target.value),t.delegate("click",".btn-edit",e=>{let r=parseInt(e.target.dataset.idx);i.editIdx=r,i.editRow={...i.rows[r]}}),t.delegate("click",".btn-cancel-edit",()=>{i.editIdx=-1,i.editRow={}}),t.delegate("click",".btn-save-edit",()=>Sr()),t.delegate("click",".btn-delete",e=>{let r=parseInt(e.target.dataset.idx);confirm("Delete this row?")&&Cr(r)}),t.delegate("input",".edit-input",e=>{let r=e.target.dataset.col;i.editRow[r]=e.target.value}),t.delegate("input",".new-input",e=>{let r=e.target.dataset.col;i.newRow[r]=e.target.value})}function Er(){let{tables:t,selectedTable:e,columns:r,rows:o,newRow:a,editIdx:s,editRow:n,sql:l,queryResult:d,loading:p,error:c,schema:$}=i;return`
	<div class="card full-width">
		<div class="hdr">
			<span>SQLite Database</span>
			<div style="display:flex;gap:8px;align-items:center">
				<select id="select-table" style="padding:4px 8px;border-radius:6px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;font-size:0.82rem">
					${t.map(u=>`<option value="${u}" ${u===e?"selected":""}>${u}</option>`).join("")}
				</select>
				<button id="btn-refresh-tables" class="btn-icon" title="Refresh">\u21BB</button>
			</div>
		</div>
		<div class="bd">
			${c?`<div class="err" style="margin-bottom:12px">${c}</div>`:""}

			<!-- SQL Console -->
			<div style="margin-bottom:16px">
				<label>SQL Console</label>
				<div style="display:flex;gap:8px">
					<textarea id="sql-input" rows="2" style="flex:1;font-family:monospace;font-size:0.82rem;padding:8px;border-radius:6px;border:1px solid #334155;background:#0f172a;color:#e2e8f0;resize:vertical" placeholder="SELECT * FROM ${e}">${l}</textarea>
					<button id="btn-run-sql" ${p?"disabled":""} style="align-self:flex-end">Run</button>
				</div>
			</div>

			${d?d.message?`<div style="color:#4ade80;margin-bottom:12px;font-size:0.85rem">${d.message}</div>`:d.columns?`
				<div style="max-height:200px;overflow:auto;border:1px solid #1e293b;border-radius:6px;margin-bottom:16px">
					<table style="width:100%;border-collapse:collapse;font-size:0.8rem">
						<thead><tr>${d.columns.map(u=>`<th style="padding:6px 10px;text-align:left;border-bottom:1px solid #334155;color:#94a3b8;position:sticky;top:0;background:#0f172a">${u}</th>`).join("")}</tr></thead>
						<tbody>${(d.rows||[]).map(u=>`<tr>${d.columns.map(S=>`<td style="padding:4px 10px;border-bottom:1px solid #1e293b;color:#e2e8f0">${u[S]??""}</td>`).join("")}</tr>`).join("")}</tbody>
					</table>
				</div>`:"":""}

			<!-- Schema -->
			${$.length?`
			<details style="margin-bottom:16px">
				<summary style="cursor:pointer;color:#94a3b8;font-size:0.82rem;margin-bottom:6px">Schema (${e})</summary>
				<div style="max-height:120px;overflow:auto;border:1px solid #1e293b;border-radius:6px">
					<table style="width:100%;border-collapse:collapse;font-size:0.78rem">
						<thead><tr><th style="padding:4px 8px;text-align:left;border-bottom:1px solid #334155;color:#94a3b8">Column</th><th style="padding:4px 8px;text-align:left;border-bottom:1px solid #334155;color:#94a3b8">Type</th><th style="padding:4px 8px;text-align:left;border-bottom:1px solid #334155;color:#94a3b8">PK</th></tr></thead>
						<tbody>${$.map(u=>`<tr><td style="padding:3px 8px;color:#e2e8f0">${u.name}</td><td style="padding:3px 8px;color:#94a3b8">${u.type}</td><td style="padding:3px 8px;color:${u.pk?"#fbbf24":"#475569"}">${u.pk?"\u2713":""}</td></tr>`).join("")}</tbody>
					</table>
				</div>
			</details>`:""}

			<!-- Data Table -->
			${r.length?`
			<div style="max-height:400px;overflow:auto;border:1px solid #1e293b;border-radius:6px;margin-bottom:12px">
				<table style="width:100%;border-collapse:collapse;font-size:0.8rem">
					<thead><tr>
						${r.map(u=>`<th style="padding:6px 10px;text-align:left;border-bottom:1px solid #334155;color:#94a3b8;position:sticky;top:0;background:#0f172a">${u}</th>`).join("")}
						<th style="padding:6px 10px;border-bottom:1px solid #334155;color:#94a3b8;position:sticky;top:0;background:#0f172a"></th>
					</tr></thead>
					<tbody>
						${o.map((u,S)=>s===S?`
						<tr style="background:#1e293b">
							${r.map(I=>`<td style="padding:2px 4px"><input class="edit-input" data-col="${I}" value="${n[I]??""}" style="width:100%;padding:2px 6px;border-radius:4px;border:1px solid #475569;background:#0f172a;color:#e2e8f0;font-size:0.8rem" /></td>`).join("")}
							<td style="padding:2px 4px;white-space:nowrap">
								<button class="btn-save-edit" style="font-size:0.75rem;padding:2px 6px">\u2713</button>
								<button class="btn-cancel-edit" style="font-size:0.75rem;padding:2px 6px">\u2715</button>
							</td>
						</tr>`:`
						<tr>
							${r.map(I=>`<td style="padding:4px 10px;border-bottom:1px solid #1e293b;color:#e2e8f0">${u[I]??""}</td>`).join("")}
							<td style="padding:4px 10px;border-bottom:1px solid #1e293b;white-space:nowrap">
								<button class="btn-edit" data-idx="${S}" style="font-size:0.75rem;padding:1px 5px">\u270E</button>
								<button class="btn-delete" data-idx="${S}" style="font-size:0.75rem;padding:1px 5px;color:#f87171">\u2715</button>
							</td>
						</tr>`).join("")}
						<!-- Insert row -->
						<tr style="background:#0f172a;border-top:1px solid #334155">
							${r.map(u=>`<td style="padding:2px 4px"><input class="new-input" data-col="${u}" value="${a[u]??""}" placeholder="${u}" style="width:100%;padding:2px 6px;border-radius:4px;border:1px solid #334155;background:#020617;color:#e2e8f0;font-size:0.8rem" /></td>`).join("")}
							<td style="padding:2px 4px"><button id="btn-insert" style="font-size:0.75rem;padding:2px 6px">+ Add</button></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div style="color:#64748b;font-size:0.78rem">${o.length} row(s)${o.length>=200?" (limited to 200)":""}</div>
			`:`<div style="color:#64748b;text-align:center;padding:24px">${t.length?"Select a table above":"No tables found. Use SQL Console to create one."}</div>`}
		</div>
	</div>`}var P=[we,se,ke,Ce,H,ne,ie,Ee,de,ce,Ae,pe,ue,fe,et],Oe=["system","git","files","tools","health","processes","commands","network","probe","filetools","theme","search","metrics","fstree","sqlite"];for(let t=0;t<P.length;t++)pt.register({name:Oe[t],...P[t]});function tt(t){let e=P.indexOf(t);return e>=0?Oe[e]||`plugin-${e}`:t.name||"unknown"}function Dt(){let t={};for(let e=0;e<P.length;e++){let r=Oe[e]||`plugin-${e}`,o={};for(let a of Object.keys(P[e].state))try{o[a]=JSON.parse(JSON.stringify(P[e].state[a]))}catch{o[a]=String(P[e].state[a])}t[r]=o}return t}async function _t(){let t=await Promise.allSettled(P.map((e,r)=>e.init()));for(let e=0;e<t.length;e++)t[e].status==="rejected"&&console.error(`[Plugin] ${Oe[e]} init failed:`,t[e].reason);try{window.dumpAllState&&setTimeout(()=>window.dumpAllState(),500)}catch(e){console.error("[Plugin] dumpAllState failed:",e)}}function At(){window.dumpAllState=async function(){let t=Dt(),e="\u2550".repeat(60);if(window.rpc&&window.rpc.log){window.rpc.log(`
${e}
  FRONTEND STATE DUMP
${e}`,"info");for(let[r,o]of Object.entries(t))window.rpc.log(`[plugin:${r}] ${JSON.stringify(o,null,2)}`,"info")}if(window.rpc&&window.rpc.dumpBackendState)try{let r=await window.rpc.dumpBackendState();window.rpc.log&&window.rpc.log(`[BACKEND STATE JSON] ${JSON.stringify(r,null,2)}`,"info")}catch(r){console.error("Failed to dump backend state",r)}window.rpc&&window.rpc.log&&window.rpc.log(`${e}
  END STATE DUMP
${e}
`,"info")},document.addEventListener("keydown",t=>{t.ctrlKey&&t.shiftKey&&t.key==="D"&&(t.preventDefault(),window.dumpAllState())})}function Ot(){return`
		${ye()}
		${q()}
		${Y()}
		${Q()}
	`}function rt(){return`
		${ae()}
		${Z()}
	`}function Lt(){return`
		${$e()}
		${G()}
	`}function It(){return`
		${Se()}
		${W()}
		${J()}
		${X()}
	`}function jt(){return _e()}var ee=[{id:"dashboard",icon:"\u229E",title:"Dashboard",desc:"System overview, workspace management & tools",content:()=>`
			${rt()}
			<div class="grid2">
				${Ot()}
				${It()}
				${Lt()}
			</div>
			<div class="full-width">
				<label>Terminal Logs</label>
				<terminal-view></terminal-view>
			</div>`},{id:"health",icon:"\u2665",title:"System Health",desc:"Memory, disk usage, uptime & load averages",content:()=>`${q()}`},{id:"processes",icon:"\u2699",title:"Processes",desc:"Live process monitor with CPU & memory usage",content:()=>`${Q()}`},{id:"commands",icon:"\u2328",title:"Commands",desc:"Run shell commands with preset shortcuts",content:()=>`${W()}`},{id:"network",icon:"\u2295",title:"Network",desc:"Interfaces, gateway, DNS & public IP",content:()=>`${We()}`},{id:"git",icon:"\u2442",title:"Git",desc:"Clone, manage & restore git repositories",content:()=>`${rt()}`},{id:"terminal",icon:"\u3009",title:"Terminal",desc:"Interactive terminal with command history",content:()=>`
			<div class="full-width">
				<xterm-terminal></xterm-terminal>
			</div>`},{id:"probe",icon:"\u25CE",title:"System Probe",desc:"CPU load, processes & core info via /proc",content:()=>`${Y()}`},{id:"monitor",icon:"\u25EB",title:"System Monitor",desc:"Real-time CPU & memory usage charts",content:()=>'<div class="full-width"><system-monitor></system-monitor></div>'},{id:"editor",icon:"\u270E",title:"Config Editor",desc:"Edit config files with syntax highlighting",content:()=>'<div class="full-width"><config-editor></config-editor></div>'},{id:"filetools",icon:"\u2692",title:"File Tools",desc:"Quick path check, mkdir & remove",content:()=>`${G()}`},{id:"theme",icon:"\u25D0",title:"Theme Switcher",desc:"Toggle dark/light design tokens",content:()=>`${jt()}`},{id:"search",icon:"\u2315",title:"Code Search",desc:"Search code with git grep",content:()=>`${J()}`},{id:"metrics",icon:"\u{1F4CA}",title:"Metrics",desc:"File count and total size of workspace",content:()=>`${X()}`},{id:"fstree",icon:"\u{1F333}",title:"File Tree",desc:"Browse repository directory tree",content:()=>`${Z()}`}];function Nt(t,e){if(!e)return!0;t=t.toLowerCase(),e=e.toLowerCase();let r=0;for(let o=0;o<t.length&&r<e.length;o++)t[o]===e[r]&&r++;return r===e.length}var Ft=`
  :host {
    display: block;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    font-family: 'Inter', system-ui, sans-serif;
    color: #f8fafc;
    box-sizing: border-box;
  }
  .shell-wrap {
    padding: 24px 48px 80px;
  }
  .card {
    background: rgba(30, 41, 59, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }
  .hdr {
    background: rgba(15, 23, 42, 0.6);
    color: #f1f5f9;
    padding: 16px 20px;
    font-size: 1.05rem;
    font-weight: 600;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .bd {
    padding: 24px;
    font-size: 0.95rem;
    color: #cbd5e1;
    flex-grow: 1;
  }
  .mono {
    background: rgba(0, 0, 0, 0.3);
    color: #34d399;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: ui-monospace, 'Fira Code', monospace;
    font-size: 0.85rem;
    white-space: pre-wrap;
    word-break: break-all;
    border: 1px solid rgba(255,255,255,0.02);
  }
  label {
    font-weight: 500;
    font-size: 0.85rem;
    display: block;
    margin-bottom: 8px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  input, textarea {
    width: 100%;
    padding: 12px 14px;
    margin-bottom: 16px;
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    box-sizing: border-box;
    color: #f8fafc;
    font-family: inherit;
    font-size: 0.95rem;
    transition: all 0.2s ease;
  }
  input:focus, textarea:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(15, 23, 42, 0.8);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
  textarea { height: 100px; resize: vertical; }
  button {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: #fff;
    border: none;
    padding: 10px 20px;
    margin: 4px 8px 0 0;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.3);
  }
  button:hover {
    background: linear-gradient(135deg, #4338ca, #6d28d9);
    transform: translateY(-1px);
    box-shadow: 0 6px 8px -1px rgba(124, 58, 237, 0.4);
  }
  button:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px -1px rgba(124, 58, 237, 0.3);
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  .badge {
    display: inline-block;
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
    border: 1px solid rgba(99, 102, 241, 0.3);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    margin: 4px;
    font-weight: 500;
  }
  .grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px; margin-bottom: 28px; }
  .ok { color: #34d399; font-weight: 600; }
  .err { color: #f87171; background: rgba(248, 113, 113, 0.1); padding: 8px 12px; border-radius: 6px; display: inline-block; font-family: monospace; }
  .full-width { margin-bottom: 28px; }
  .feature-card {
     background: linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
     border: 1px solid rgba(16, 185, 129, 0.3);
     box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.15);
  }
  .feature-card .hdr {
     background: rgba(16, 185, 129, 0.08);
     border-bottom: 1px solid rgba(16, 185, 129, 0.2);
     color: #6ee7b7;
  }
  .clone-input-row {
    display: flex;
    gap: 12px;
    align-items: stretch;
  }
  .clone-input-row input {
    flex: 1;
    margin-bottom: 0;
  }
  .clone-input-row button {
    margin: 0;
    white-space: nowrap;
    background: linear-gradient(135deg, #10b981, #059669);
    box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
  }
  .clone-input-row button:hover {
    background: linear-gradient(135deg, #059669, #047857);
    box-shadow: 0 6px 8px -1px rgba(16, 185, 129, 0.4);
  }
  .repo-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }
  .repo-item {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.25);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 0.9rem;
  }
  .repo-item .repo-name {
    color: #6ee7b7;
    font-weight: 500;
  }
  .btn-remove {
    background: rgba(248, 113, 113, 0.2);
    color: #f87171;
    border: 1px solid rgba(248, 113, 113, 0.3);
    padding: 4px 10px;
    font-size: 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    margin: 0;
    box-shadow: none;
  }
  .btn-remove:hover {
    background: rgba(248, 113, 113, 0.4);
    transform: none;
    box-shadow: none;
  }
  .btn-restore {
    background: rgba(99, 102, 241, 0.2);
    color: #818cf8;
    border: 1px solid rgba(99, 102, 241, 0.3);
    padding: 4px 10px;
    font-size: 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    margin: 0;
    box-shadow: none;
  }
  .btn-restore:hover {
    background: rgba(99, 102, 241, 0.4);
    transform: none;
    box-shadow: none;
  }
  .btn-icon {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #94a3b8;
    padding: 6px 10px;
    font-size: 0.85rem;
    border-radius: 6px;
    cursor: pointer;
    margin: 0;
    box-shadow: none;
  }
  .btn-icon:hover {
    border-color: rgba(255, 255, 255, 0.3);
    color: #f1f5f9;
    transform: none;
    box-shadow: none;
  }
  .git-status {
    margin-top: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 0.9rem;
  }
  .git-status.ok {
    background: rgba(52, 211, 153, 0.1);
    border: 1px solid rgba(52, 211, 153, 0.25);
  }
  .git-status.err {
    background: rgba(248, 113, 113, 0.1);
    border: 1px solid rgba(248, 113, 113, 0.25);
  }
  .empty-state {
    color: #64748b;
    font-style: italic;
    padding: 12px 0;
    font-size: 0.9rem;
  }

  /* --- tab bar --- */
  .tab-bar {
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
    padding: 4px;
    background: rgba(15, 23, 42, 0.92);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.04);
    overflow-x: auto;
    position: sticky;
    top: 16px;
    z-index: 100;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #94a3b8;
    white-space: nowrap;
    transition: all 0.15s ease;
    user-select: none;
    flex-shrink: 0;
  }
  .tab:hover {
    background: rgba(255,255,255,0.04);
    color: #e2e8f0;
  }
  .tab.active {
    background: rgba(99, 102, 241, 0.15);
    color: #a5b4fc;
    font-weight: 600;
  }
  .tab-close {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    padding: 0 2px;
    margin: 0;
    box-shadow: none;
    border-radius: 4px;
    transition: all 0.1s;
  }
  .tab-close:hover {
    background: rgba(248,113,113,0.2);
    color: #f87171;
  }
  .tab-icon { font-size: 1rem; }
  .tab-close-all {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.78rem;
    color: #64748b;
    white-space: nowrap;
    transition: all 0.12s ease;
    margin-left: auto;
    flex-shrink: 0;
    background: none;
    border: 1px solid transparent;
    font-family: inherit;
  }
  .tab-close-all:hover {
    background: rgba(248,113,113,0.15);
    color: #f87171;
    border-color: rgba(248,113,113,0.3);
  }

  /* --- tab content --- */
  .tab-content {
    position: relative;
  }
  .tab-pane {
    display: none;
  }
  .tab-pane.active {
    display: block;
  }

  /* --- launcher grid --- */
  .search-row {
    margin-bottom: 24px;
  }
  .search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .search-wrap input {
    margin: 0;
    padding: 14px 18px;
    padding-right: 40px;
    font-size: 1rem;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255,255,255,0.08);
    transition: all 0.2s ease;
    width: 100%;
    box-sizing: border-box;
  }
  .search-wrap input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }
  .search-clear {
    position: absolute;
    right: 8px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #94a3b8;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    padding: 0;
    line-height: 1;
  }
  .search-clear:hover {
    background: rgba(248,113,113,0.15);
    border-color: rgba(248,113,113,0.3);
    color: #f87171;
  }
  .launcher-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
    justify-content: center;
  }
  @media (min-width: 1024px) {
    .launcher-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .launcher-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    min-height: 56px;
    background: rgba(30, 41, 59, 0.3);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
  }
  .launcher-item:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-1px);
  }
  .launcher-item:active {
    transform: translateY(0);
  }
  .launcher-icon {
    font-size: 1.4rem;
    width: 32px;
    text-align: center;
    flex-shrink: 0;
  }
  .launcher-info {
    flex: 1;
    min-width: 0;
  }
  .launcher-title {
    font-weight: 600;
    font-size: 0.95rem;
    color: #e2e8f0;
  }
  .launcher-desc {
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .no-match {
    text-align: center;
    padding: 48px 20px;
    color: #64748b;
    font-style: italic;
  }
  .launcher-badge {
    font-size: 0.7rem;
    color: #6366f1;
    background: rgba(99,102,241,0.12);
    padding: 2px 8px;
    border-radius: 6px;
    flex-shrink: 0;
  }

  /* --- status bar --- */
  .status-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 32px;
    background: rgba(15, 23, 42, 0.92);
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    font-size: 0.75rem;
    color: #94a3b8;
    z-index: 9999;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    user-select: none;
  }
  .status-bar .status-left,
  .status-bar .status-right {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .sb-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 4px;
    cursor: pointer;
    color: #94a3b8;
    font-size: 0.72rem;
    font-family: inherit;
    background: none;
    border: 1px solid transparent;
    transition: all 0.12s ease;
    margin: 0;
    box-shadow: none;
    white-space: nowrap;
  }
  .sb-btn:hover {
    background: rgba(255,255,255,0.06);
    color: #e2e8f0;
    border-color: rgba(255,255,255,0.08);
  }
  .sb-btn.active {
    background: rgba(99, 102, 241, 0.15);
    color: #a5b4fc;
    border-color: rgba(99, 102, 241, 0.25);
  }
  .sb-sep {
    width: 1px;
    height: 14px;
    background: rgba(255,255,255,0.08);
    margin: 0 4px;
    flex-shrink: 0;
  }

  /* --- overlay --- */
  .drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 32px;
    background: rgba(0,0,0,0.4);
    z-index: 9998;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }
  .drawer-overlay.visible {
    opacity: 1;
    pointer-events: auto;
  }

  /* --- bottom drawer (slides up) --- */
  .bottom-drawer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 32px;
    height: 50vh;
    max-height: 420px;
    background: rgba(15, 23, 42, 0.96);
    border-top: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px 12px 0 0;
    z-index: 10000;
    transform: translateY(calc(100% + 32px));
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 -8px 32px rgba(0,0,0,0.4);
    will-change: transform;
  }
  .bottom-drawer.open {
    transform: translateY(0);
  }
  .bottom-drawer.dragging {
    transition: none;
  }
  .drawer-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 0 4px;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }
  .drawer-handle:active {
    cursor: grabbing;
  }
  .drawer-handle::after {
    content: '';
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: rgba(255,255,255,0.15);
    transition: background 0.15s ease;
  }
  .drawer-handle:hover::after {
    background: rgba(255,255,255,0.25);
  }
  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 20px 10px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .drawer-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: #e2e8f0;
  }
  .drawer-close {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    font-size: 1.1rem;
    padding: 2px 6px;
    margin: 0;
    box-shadow: none;
    border-radius: 4px;
    transition: all 0.1s;
  }
  .drawer-close:hover {
    background: rgba(255,255,255,0.08);
    color: #e2e8f0;
  }
  .drawer-tabs {
    display: flex;
    gap: 2px;
    padding: 8px 16px 0;
  }
  .drawer-tab {
    padding: 6px 14px;
    font-size: 0.78rem;
    color: #64748b;
    cursor: pointer;
    border-radius: 6px 6px 0 0;
    transition: all 0.12s;
    background: none;
    border: none;
    margin: 0;
    box-shadow: none;
  }
  .drawer-tab:hover { color: #94a3b8; background: rgba(255,255,255,0.03); }
  .drawer-tab.active {
    color: #a5b4fc;
    background: rgba(99, 102, 241, 0.12);
    font-weight: 600;
  }
  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
  }

  /* --- side panel (slides from right) --- */
  .side-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 32px;
    width: 340px;
    max-width: 85vw;
    background: rgba(15, 23, 42, 0.96);
    border-left: 1px solid rgba(255,255,255,0.08);
    z-index: 10001;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: -8px 0 32px rgba(0,0,0,0.4);
    will-change: transform;
  }
  .side-panel.open {
    transform: translateX(0);
  }
  .side-panel.dragging {
    transition: none;
  }
  .side-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .side-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #e2e8f0;
  }
  .side-close {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    font-size: 1.1rem;
    padding: 2px 6px;
    margin: 0;
    box-shadow: none;
    border-radius: 4px;
    transition: all 0.1s;
  }
  .side-close:hover {
    background: rgba(255,255,255,0.08);
    color: #e2e8f0;
  }
  .side-tabs {
    display: flex;
    gap: 2px;
    padding: 8px 16px 0;
  }
  .side-tab {
    padding: 6px 12px;
    font-size: 0.78rem;
    color: #64748b;
    cursor: pointer;
    border-radius: 6px 6px 0 0;
    transition: all 0.12s;
    background: none;
    border: none;
    margin: 0;
    box-shadow: none;
  }
  .side-tab:hover { color: #94a3b8; background: rgba(255,255,255,0.03); }
  .side-tab.active {
    color: #a5b4fc;
    background: rgba(99, 102, 241, 0.12);
    font-weight: 600;
  }
  .side-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
  }
`;function qt(t,e){let r=t.some(o=>o.canClose);return`<div class="tab-bar">
		${t.map(o=>`
			<div class="tab${o.id===e?" active":""}" data-tab="${o.id}">
				<span class="tab-icon">${o.icon}</span>
				<span>${o.title}</span>
				${o.canClose?`<button class="tab-close" data-close-tab="${o.id}">\u2715</button>`:""}
			</div>`).join("")}
		${r?'<button class="tab-close-all" data-close-all>\u2715 Close All</button>':""}
	</div>`}function Ut(t,e,r,o){return`<div class="tab-content">
		${t.map(a=>`
			<div class="tab-pane${a.id===e?" active":""}">
				${a.id==="home"?`
						<div class="search-row">
							<div class="search-wrap">
								<input id="card-search" placeholder="Search features\u2026" value="${r}" />
								${r?'<button class="search-clear" id="btn-search-clear">\u2715</button>':""}
							</div>
						</div>
						${o.length>0?'<div class="launcher-grid">'+o.map(s=>'<div class="launcher-item" data-open-tab="'+s.id+'"><div class="launcher-info"><div class="launcher-title">'+s.title+'</div><div class="launcher-desc">'+s.desc+"</div></div></div>").join("")+"</div>":'<div class="no-match">No features match &quot;'+r+"&quot;</div>"}
					`:a.content()}

			</div>`).join("")}
	</div>`}function Bt(t,e,r,o){return`<div class="status-bar">
		<div class="status-left">
			<button class="sb-btn${t?" active":""}" id="btn-bottom-drawer">Drawer</button>
			<span class="sb-sep"></span>
			<button class="sb-btn${e==="quick"&&t?" active":""}" data-bottom-tab="quick">Quick</button>
			<button class="sb-btn${e==="logs"&&t?" active":""}" data-bottom-tab="logs">Logs</button>
			<button class="sb-btn${e==="health"&&t?" active":""}" data-bottom-tab="health">Health</button>
		</div>
		<div class="status-right">
			<button class="sb-btn${o==="info"&&r?" active":""}" data-side-tab="info">Info</button>
			<button class="sb-btn${o==="plugins"&&r?" active":""}" data-side-tab="plugins">Plugins</button>
			<button class="sb-btn${o==="debug"&&r?" active":""}" data-side-tab="debug">Debug</button>
			<span class="sb-sep"></span>
			<button class="sb-btn${r?" active":""}" id="btn-side-panel">Panel</button>
		</div>
	</div>`}function Kt(t,e){return`<div class="drawer-overlay${t||e?" visible":""}"></div>`}function Ht(t,e){return`<div class="bottom-drawer${t?" open":""}">
		<div class="drawer-handle"></div>
		<div class="drawer-header">
			<span class="drawer-title">${e==="quick"?"Quick Actions":e==="logs"?"Terminal Logs":"System Health"}</span>
			<button class="drawer-close" id="btn-close-bottom-drawer">\u2715</button>
		</div>
		<div class="drawer-tabs">
			<button class="drawer-tab${e==="quick"?" active":""}" data-bottom-tab="quick">Quick</button>
			<button class="drawer-tab${e==="logs"?" active":""}" data-bottom-tab="logs">Logs</button>
			<button class="drawer-tab${e==="health"?" active":""}" data-bottom-tab="health">Health</button>
		</div>
		<div class="drawer-body">
			${e==="quick"?`
				<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">
					${ee.filter(o=>o.id!=="dashboard").map(o=>`
						<div class="launcher-item" data-open-tab="${o.id}" style="padding:10px 14px">
							<div class="launcher-info">
								<div class="launcher-title" style="font-size:0.85rem">${o.title}</div>
								<div class="launcher-desc" style="font-size:0.72rem">${o.desc}</div>
							</div>
						</div>`).join("")}
				</div>`:e==="logs"?`
				<terminal-view style="height:100%;min-height:200px"></terminal-view>`:`
				${q()}`}
		</div>
	</div>`}function Vt(t,e,r,o,a,s){return`<div class="side-panel${t?" open":""}">
		<div class="side-header">
			<span class="side-title">${e==="info"?"About":e==="plugins"?"Plugins":"Debug Inspector"}</span>
			<button class="side-close" id="btn-close-side-panel">\u2715</button>
		</div>
		<div class="side-tabs">
			<button class="side-tab${e==="info"?" active":""}" data-side-tab="info">\u2139 Info</button>
			<button class="side-tab${e==="plugins"?" active":""}" data-side-tab="plugins">\u2699 Plugins</button>
			<button class="side-tab${e==="debug"?" active":""}" data-side-tab="debug">\u2318 Debug</button>
		</div>
		<div class="side-body">
			${e==="info"?Ar():e==="plugins"?Or():Lr(r,o,a,s)}
		</div>
	</div>`}function Ar(){return`
		<div style="margin-bottom:16px">
			<label>dotfiles-mgr</label>
			<div class="mono" style="font-size:0.8rem">A desktop dotfiles & system manager built with V + webview.</div>
		</div>
		<div style="margin-bottom:16px">
			<label>Registered RPCs</label>
			<div class="mono" style="font-size:0.8rem">
				system \xB7 git \xB7 files \xB7 tools
			</div>
		</div>
		<div style="margin-bottom:16px">
			<label>Plugins</label>
			<div class="mono" style="font-size:0.8rem">
${P.map(t=>`  \u2022 ${tt(t)}`).join(`
`)}
			</div>
		</div>`}function Or(){return`<div style="display:flex;flex-direction:column;gap:8px">
		${P.map(t=>{let e=tt(t),r=Object.keys(t.state);return`<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:10px 14px">
				<div style="font-weight:600;font-size:0.85rem;color:#e2e8f0;margin-bottom:4px">${e}</div>
				<div style="font-size:0.72rem;color:#64748b">state keys: ${r.join(", ")}</div>
			</div>`}).join("")}
	</div>`}function Lr(t,e,r,o){return`
		<div style="margin-bottom:16px">
			<label>Frontend State</label>
			<pre class="mono" style="font-size:0.72rem;max-height:200px;overflow:auto">${JSON.stringify({tabs:t.length,active:e,bottomOpen:r,searchQuery:o||"(empty)"},null,2)}</pre>
		</div>
		<div style="margin-bottom:16px">
			<label>Backend State</label>
			<button class="btn-icon" style="font-size:0.78rem;padding:4px 10px" onclick="window.rpc?.dumpBackendState?.()">Dump to Console</button>
			<div style="font-size:0.72rem;color:#64748b;margin-top:6px">Click to dump backend state to terminal logs.</div>
		</div>
		<div>
			<label>Keyboard Shortcuts</label>
			<div class="mono" style="font-size:0.78rem">
Ctrl+Shift+D \u2014 Dump all state
			</div>
		</div>`}window.onerror=(t,e,r,o,a)=>{console.error("[Global]",t,a?.stack||`${e}:${r}:${o}`)};window.addEventListener("unhandledrejection",t=>{console.error("[Global] Unhandled rejection:",t.reason),t.preventDefault()});At();var ot=class extends re{constructor(){super(),this.searchQuery=z(""),this.tabs=z([{id:"home",title:"Home",icon:"\u229E",canClose:!1}]),this.activeTab=z("home"),this.bottomDrawerOpen=z(!1),this.bottomDrawerTab=z("quick"),this.sidePanelOpen=z(!1),this.sidePanelTab=z("info")}openTab(e){let r=[...this.tabs.value];r.find(o=>o.id===e.id)||(r.push({id:e.id,title:e.title,icon:e.icon,canClose:!0,content:e.content}),this.tabs.value=r),this.activeTab.value=e.id}closeTab(e){if(e==="home")return;let r=this.tabs.value.filter(o=>o.id!==e);this.tabs.value=r,this.activeTab.value===e&&(this.activeTab.value=r.length>0?r[r.length-1].id:"home")}closeAllTabs(){this.tabs.value=[{id:"home",title:"Home",icon:"\u229E",canClose:!1}],this.activeTab.value="home"}_initDrawerDrag(){let e=this.shadowRoot;if(!e)return;let r=e.querySelector(".drawer-handle"),o=e.querySelector(".bottom-drawer");if(!r||!o)return;let a=0,s=0,n=()=>{let c=o.getBoundingClientRect();return window.innerHeight-32-c.height},l=c=>{c.preventDefault(),a=(c.touches?c.touches[0]:c).clientY;let u=window.getComputedStyle(o);s=new DOMMatrixReadOnly(u.transform).m42,o.classList.add("dragging"),document.addEventListener("mousemove",d),document.addEventListener("mouseup",p),document.addEventListener("touchmove",d,{passive:!1}),document.addEventListener("touchend",p)},d=c=>{c.preventDefault();let u=(c.touches?c.touches[0]:c).clientY-a,S=0,I=n()+40,Le=Math.max(I,Math.min(S,s+u));o.style.transform=`translateY(${Le}px)`},p=()=>{o.classList.remove("dragging"),document.removeEventListener("mousemove",d),document.removeEventListener("mouseup",p),document.removeEventListener("touchmove",d),document.removeEventListener("touchend",p);let c=window.getComputedStyle(o),u=new DOMMatrixReadOnly(c.transform).m42,S=n()*.4;u>S?this.bottomDrawerOpen.value=!1:this.bottomDrawerOpen.value=!0,o.style.transform=""};r.addEventListener("mousedown",l),r.addEventListener("touchstart",l,{passive:!1})}_initSidePanelDrag(){let e=this.shadowRoot;if(!e)return;let r=e.querySelector(".side-panel"),o=e.querySelector(".side-header");if(!r||!o)return;let a=0,s=0,n=()=>r.getBoundingClientRect().width,l=c=>{if(c.target.closest("button"))return;c.preventDefault(),a=(c.touches?c.touches[0]:c).clientX;let u=window.getComputedStyle(r);s=new DOMMatrixReadOnly(u.transform).m41,r.classList.add("dragging"),document.addEventListener("mousemove",d),document.addEventListener("mouseup",p),document.addEventListener("touchmove",d,{passive:!1}),document.addEventListener("touchend",p)},d=c=>{c.preventDefault();let u=(c.touches?c.touches[0]:c).clientX-a,S=0,I=-n(),Le=Math.max(I,Math.min(S,s+u));r.style.transform=`translateX(${Le}px)`},p=()=>{r.classList.remove("dragging"),document.removeEventListener("mousemove",d),document.removeEventListener("mouseup",p),document.removeEventListener("touchmove",d),document.removeEventListener("touchend",p);let c=window.getComputedStyle(r),u=new DOMMatrixReadOnly(c.transform).m41,S=-n()*.4;u<S?this.sidePanelOpen.value=!1:this.sidePanelOpen.value=!0,r.style.transform=""};o.addEventListener("mousedown",l),o.addEventListener("touchstart",l,{passive:!1})}onMount(){_t();for(let e of P)e.onMount&&e.onMount(this);this.delegate("input","#card-search",e=>{this.searchQuery.value=e.target.value}),this.delegate("click","#btn-search-clear",()=>{this.searchQuery.value="";let e=this.shadowRoot&&this.shadowRoot.querySelector("#card-search");e&&(e.value="")}),this.delegate("click","[data-open-tab]",e=>{let r=e.target.closest("[data-open-tab]");if(!r)return;let o=ee.find(a=>a.id===r.dataset.openTab);o&&this.openTab(o)}),this.delegate("click","[data-tab]",e=>{let r=e.target.closest("[data-tab]");r&&(this.activeTab.value=r.dataset.tab)}),this.delegate("click","[data-close-tab]",e=>{let r=e.target.closest("[data-close-tab]");r&&this.closeTab(r.dataset.closeTab)}),this.delegate("click","[data-close-all]",()=>{this.closeAllTabs()}),this.delegate("click","#btn-bottom-drawer",()=>{this.bottomDrawerOpen.value=!this.bottomDrawerOpen.value}),this.delegate("click","[data-bottom-tab]",e=>{let r=e.target.closest("[data-bottom-tab]");r&&(this.bottomDrawerTab.value=r.dataset.bottomTab,this.bottomDrawerOpen.value=!0)}),this.delegate("click","#btn-close-bottom-drawer",()=>{this.bottomDrawerOpen.value=!1}),this.delegate("click","#btn-side-panel",()=>{this.sidePanelOpen.value=!this.sidePanelOpen.value}),this.delegate("click","[data-side-tab]",e=>{let r=e.target.closest("[data-side-tab]");r&&(this.sidePanelTab.value=r.dataset.sideTab,this.sidePanelOpen.value=!0)}),this.delegate("click","#btn-close-side-panel",()=>{this.sidePanelOpen.value=!1}),this.delegate("click",".drawer-overlay",e=>{e.target.classList.contains("drawer-overlay")&&(this.bottomDrawerOpen.value=!1,this.sidePanelOpen.value=!1)}),this._initDrawerDrag(),this._initSidePanelDrag(),window.addEventListener("backend-log",e=>{let r=this.shadowRoot&&this.shadowRoot.querySelector("terminal-view");r&&r.addLog(e.detail.msg,e.detail.level)})}render(){let e=this.searchQuery.value,r=this.tabs.value,o=this.activeTab.value,a=this.bottomDrawerOpen.value,s=this.bottomDrawerTab.value,n=this.sidePanelOpen.value,l=this.sidePanelTab.value,d=e?ee.filter(p=>Nt(p.title+" "+p.desc,e)):ee;return requestAnimationFrame(()=>{this._initDrawerDrag(),this._initSidePanelDrag()}),`
      <style>${Ft}</style>
      <div class="shell-wrap">
        ${qt(r,o)}
        ${Ut(r,o,e,d)}
      </div>
      ${Bt(a,s,n,l)}
      ${Kt(a,n)}
      ${Ht(a,s)}
      ${Vt(n,l,r,o,a,e)}`}};customElements.define("system-dashboard",ot);})();
