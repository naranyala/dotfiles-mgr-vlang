import { effect, signal } from './signals.js'
import { morph } from './dom.js'

export class ReactiveComponent extends HTMLElement {
	constructor() {
		super()
		this.props = {}
		this._isMounted = false
		this._hasRendered = false
		this._effectCleanup = null
		this._delegatedEvents = new Map()
		this._delegationRoots = new Set()

		this.attachShadow({ mode: 'open' })

		const observed = this.constructor.observedAttributes || []
		for (const attr of observed) {
			this.props[attr] = signal(this.getAttribute(attr))
		}
	}

	connectedCallback() {
		this._isMounted = true
		this.onMount()

		this._effectCleanup = effect(() => {
			if (!this._isMounted || !this.shadowRoot) return

			if (!this._hasRendered) {
				this.shadowRoot.innerHTML = this.render()
				this._hasRendered = true
			} else {
				const template = document.createElement('template')
				template.innerHTML = this.render()
				morph(this.shadowRoot, template.content)
			}

			this.onRendered()
		})
	}

	disconnectedCallback() {
		this._isMounted = false
		if (this._effectCleanup) {
			this._effectCleanup()
			this._effectCleanup = null
		}
		this.onDestroy()
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (this.props[name] && oldValue !== newValue) {
			this.props[name].set(newValue)
		}
	}

	render() { return '' }

	onMount() {}
	onRendered() {}
	onDestroy() {}

	query(selector) {
		return this.shadowRoot ? this.shadowRoot.querySelector(selector) : null
	}

	delegate(type, selector, listener) {
		if (!this._delegatedEvents.has(type)) {
			this._delegatedEvents.set(type, [])
		}
		this._delegatedEvents.get(type).push({ selector, listener })

		if (!this._delegationRoots.has(type)) {
			this._delegationRoots.add(type)

			setTimeout(() => {
				if (!this.shadowRoot) return
				this.shadowRoot.addEventListener(type, (e) => {
					const target = e.target
					const listeners = this._delegatedEvents.get(type) || []
					for (const l of listeners) {
						if (target.matches(l.selector) || target.closest(l.selector)) {
							l.listener(e)
						}
					}
				})
			}, 0)
		}
	}
}
