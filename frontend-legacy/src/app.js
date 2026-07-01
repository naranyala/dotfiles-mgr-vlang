import './core/rpc.js'
import { signal } from './core/signals.js'
import { ReactiveComponent } from './core/component.js'
import { Terminal } from './components/terminal.js'

import { plugins, initAll } from './shell/plugins.js'
import { installStateDump } from './shell/state.js'
import { launchers, fuzzyMatch } from './shell/launchers.js'
import { styles } from './shell/styles.js'
import {
	renderTabBar, renderTabContent, renderStatusBar,
	renderOverlay, renderBottomDrawer, renderSidePanel,
} from './shell/templates.js'

installStateDump()

class SystemDashboard extends ReactiveComponent {
	constructor() {
		super()
		this.searchQuery = signal('')
		this.tabs = signal([{ id: 'home', title: 'Home', icon: '⊞', canClose: false }])
		this.activeTab = signal('home')
		this.bottomDrawerOpen = signal(false)
		this.bottomDrawerTab = signal('quick')
		this.sidePanelOpen = signal(false)
		this.sidePanelTab = signal('info')
	}

	openTab(card) {
		const tabs = [...this.tabs.value]
		if (!tabs.find(t => t.id === card.id)) {
			tabs.push({ id: card.id, title: card.title, icon: card.icon, canClose: true, content: card.content })
			this.tabs.value = tabs
		}
		this.activeTab.value = card.id
	}

	closeTab(tabId) {
		if (tabId === 'home') return
		const tabs = this.tabs.value.filter(t => t.id !== tabId)
		this.tabs.value = tabs
		if (this.activeTab.value === tabId) {
			this.activeTab.value = tabs.length > 0 ? tabs[tabs.length - 1].id : 'home'
		}
	}

	onMount() {
		initAll()
		for (const p of plugins) {
			if (p.onMount) p.onMount(this)
		}
		this.delegate('input', '#card-search', (e) => {
			this.searchQuery.value = e.target.value
		})
		this.delegate('click', '[data-open-tab]', (e) => {
			const el = e.target.closest('[data-open-tab]')
			if (!el) return
			const card = launchers.find(c => c.id === el.dataset.openTab)
			if (card) this.openTab(card)
		})
		this.delegate('click', '[data-tab]', (e) => {
			const el = e.target.closest('[data-tab]')
			if (!el) return
			this.activeTab.value = el.dataset.tab
		})
		this.delegate('click', '[data-close-tab]', (e) => {
			const el = e.target.closest('[data-close-tab]')
			if (!el) return
			this.closeTab(el.dataset.closeTab)
		})
		this.delegate('click', '#btn-bottom-drawer', () => {
			this.bottomDrawerOpen.value = !this.bottomDrawerOpen.value
		})
		this.delegate('click', '[data-bottom-tab]', (e) => {
			const el = e.target.closest('[data-bottom-tab]')
			if (!el) return
			this.bottomDrawerTab.value = el.dataset.bottomTab
			this.bottomDrawerOpen.value = true
		})
		this.delegate('click', '#btn-close-bottom-drawer', () => {
			this.bottomDrawerOpen.value = false
		})
		this.delegate('click', '#btn-side-panel', () => {
			this.sidePanelOpen.value = !this.sidePanelOpen.value
		})
		this.delegate('click', '[data-side-tab]', (e) => {
			const el = e.target.closest('[data-side-tab]')
			if (!el) return
			this.sidePanelTab.value = el.dataset.sideTab
			this.sidePanelOpen.value = true
		})
		this.delegate('click', '#btn-close-side-panel', () => {
			this.sidePanelOpen.value = false
		})
		this.delegate('click', '.drawer-overlay', (e) => {
			if (e.target.classList.contains('drawer-overlay')) {
				this.bottomDrawerOpen.value = false
				this.sidePanelOpen.value = false
			}
		})
		window.addEventListener('backend-log', (e) => {
			const term = this.shadowRoot && this.shadowRoot.querySelector('terminal-view')
			if (term) term.addLog(e.detail.msg, e.detail.level)
		})
	}

	render() {
		const q = this.searchQuery.value
		const tabs = this.tabs.value
		const active = this.activeTab.value
		const bottomOpen = this.bottomDrawerOpen.value
		const bottomTab = this.bottomDrawerTab.value
		const sideOpen = this.sidePanelOpen.value
		const sideTab = this.sidePanelTab.value

		const visible = q
			? launchers.filter(c => fuzzyMatch(c.title + ' ' + c.desc, q))
			: launchers

		return `
      <style>${styles}</style>
      ${renderTabBar(tabs, active)}
      ${renderTabContent(tabs, active, q, visible)}
      ${renderStatusBar(bottomOpen, bottomTab, sideOpen, sideTab)}
      ${renderOverlay(bottomOpen, sideOpen)}
      ${renderBottomDrawer(bottomOpen, bottomTab)}
      ${renderSidePanel(sideOpen, sideTab, tabs, active, bottomOpen, q)}`
	}
}

customElements.define('system-dashboard', SystemDashboard)
