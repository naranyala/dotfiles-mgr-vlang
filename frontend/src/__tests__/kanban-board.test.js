import { describe, it, expect, beforeEach } from 'bun:test'

// Mock web component APIs for Node.js environment
if (typeof CSSStyleSheet === 'undefined') {
	globalThis.CSSStyleSheet = class CSSStyleSheet { replaceSync() {} }
}
if (typeof document === 'undefined') {
	globalThis.document = {
		createElement: (tag) => ({
			content: { innerHTML: '' },
			innerHTML: '',
		}),
		createDocumentFragment: () => ({
			appendChild: () => {},
			childNodes: [],
		}),
	}
}
if (typeof Node === 'undefined') {
	globalThis.Node = { TEXT_NODE: 3, ELEMENT_NODE: 1, COMMENT_NODE: 8 }
}
if (typeof customElements === 'undefined') {
	globalThis.customElements = { define: () => {}, get: () => null }
}
if (typeof HTMLElement === 'undefined') {
	globalThis.HTMLElement = class HTMLElement {
		constructor() {
			this._shadowRoot = null
			this._attributes = {}
		}
		attachShadow() {
			this._shadowRoot = {
				innerHTML: '',
				querySelector: () => null,
				querySelectorAll: () => [],
				addEventListener: () => {},
				removeEventListener: () => {},
				appendChild: () => {},
				removeChild: () => {},
				childNodes: [],
				children: [],
				adoptedStyleSheets: [],
				nodeType: 11,
				nodeName: '#document-fragment',
				contains: () => false,
			}
			return this._shadowRoot
		}
		get shadowRoot() { return this._shadowRoot }
		getAttribute(name) { return this._attributes[name] || null }
		setAttribute(name, value) { this._attributes[name] = value }
		hasAttribute(name) { return name in this._attributes }
		removeAttribute(name) { delete this._attributes[name] }
		dispatchEvent() {}
	}
}
if (typeof queueMicrotask === 'undefined') {
	globalThis.queueMicrotask = (fn) => setTimeout(fn, 0)
}

describe('KanbanBoardComponent', () => {
	it('should be importable', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		expect(KanbanBoardComponent).toBeDefined()
		expect(typeof KanbanBoardComponent).toBe('function')
	})

	it('should extend ReactiveComponent', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const { ReactiveComponent } = await import('../core/component.js')
		const instance = new KanbanBoardComponent()
		expect(instance).toBeInstanceOf(ReactiveComponent)
	})

	it('should have static styles', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		expect(KanbanBoardComponent.styles).toBeDefined()
		expect(typeof KanbanBoardComponent.styles).toBe('string')
		expect(KanbanBoardComponent.styles).toContain('.kanban')
	})

	it('should initialize with default cards', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		expect(instance.cards.value).toBeDefined()
		expect(Array.isArray(instance.cards.value)).toBe(true)
		expect(instance.cards.value.length).toBe(5)
	})

	it('should have cards in all three columns by default', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const columns = ['todo', 'progress', 'done']
		for (const col of columns) {
			const cards = instance.getColumnCards(col)
			expect(cards.length).toBeGreaterThan(0)
			for (const card of cards) {
				expect(card.column).toBe(col)
			}
		}
	})

	it('should initialize signals correctly', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		expect(instance.newTitle.value).toBe('')
		expect(instance.addColumn.value).toBe('todo')
		expect(instance.draggedCard.value).toBeNull()
	})

	it('should add a card to the default column', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const initialCount = instance.cards.value.length

		instance.newTitle.value = 'New task'
		instance.addCard()

		expect(instance.cards.value.length).toBe(initialCount + 1)
		const newCard = instance.cards.value[instance.cards.value.length - 1]
		expect(newCard.title).toBe('New task')
		expect(newCard.column).toBe('todo')
		expect(newCard.desc).toBe('')
		expect(instance.newTitle.value).toBe('')
	})

	it('should add a card to a specific column', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		instance.addColumn.value = 'done'

		instance.newTitle.value = 'Completed task'
		instance.addCard()

		const doneCards = instance.getColumnCards('done')
		const added = doneCards.find(c => c.title === 'Completed task')
		expect(added).toBeDefined()
		expect(added.column).toBe('done')
	})

	it('should not add a card with empty title', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const initialCount = instance.cards.value.length

		instance.newTitle.value = ''
		instance.addCard()
		expect(instance.cards.value.length).toBe(initialCount)

		instance.newTitle.value = '   '
		instance.addCard()
		expect(instance.cards.value.length).toBe(initialCount)
	})

	it('should delete a card by id', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const cardToDelete = instance.cards.value[0]
		const initialCount = instance.cards.value.length

		instance.deleteCard(cardToDelete.id)

		expect(instance.cards.value.length).toBe(initialCount - 1)
		expect(instance.cards.value.find(c => c.id === cardToDelete.id)).toBeUndefined()
	})

	it('should not crash when deleting non-existent card', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const initialCount = instance.cards.value.length

		instance.deleteCard(99999)
		expect(instance.cards.value.length).toBe(initialCount)
	})

	it('should move a card to a different column', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const card = instance.cards.value.find(c => c.column === 'todo')
		expect(card).toBeDefined()

		instance.moveCard(card.id, 'done')

		const moved = instance.cards.value.find(c => c.id === card.id)
		expect(moved.column).toBe('done')
		expect(instance.getColumnCards('done').some(c => c.id === card.id)).toBe(true)
		expect(instance.getColumnCards('todo').some(c => c.id === card.id)).toBe(false)
	})

	it('should maintain card data when moving', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const card = instance.cards.value[0]
		const originalTitle = card.title
		const originalDesc = card.desc

		instance.moveCard(card.id, 'progress')

		const moved = instance.cards.value.find(c => c.id === card.id)
		expect(moved.title).toBe(originalTitle)
		expect(moved.desc).toBe(originalDesc)
	})

	it('should handle moving to same column gracefully', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const card = instance.cards.value.find(c => c.column === 'todo')
		const initialCount = instance.getColumnCards('todo').length

		instance.moveCard(card.id, 'todo')
		expect(instance.getColumnCards('todo').length).toBe(initialCount)
	})

	it('should track card counts per column', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()

		const todoCount = instance.getColumnCards('todo').length
		const progressCount = instance.getColumnCards('progress').length
		const doneCount = instance.getColumnCards('done').length

		expect(todoCount + progressCount + doneCount).toBe(instance.cards.value.length)
	})

	it('should handle multiple add/delete cycles', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()

		for (let i = 0; i < 5; i++) {
			instance.newTitle.value = `Task ${i}`
			instance.addColumn.value = i % 2 === 0 ? 'todo' : 'done'
			instance.addCard()
		}
		expect(instance.cards.value.length).toBe(10)

		const toDelete = instance.cards.value.slice(0, 3)
		for (const card of toDelete) {
			instance.deleteCard(card.id)
		}
		expect(instance.cards.value.length).toBe(7)
	})

	it('should generate unique card ids', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const ids = new Set()

		for (let i = 0; i < 10; i++) {
			instance.newTitle.value = `Task ${i}`
			instance.addCard()
			ids.add(instance.cards.value[instance.cards.value.length - 1].id)
		}
		expect(ids.size).toBe(10)
	})

	it('should handle move across all columns', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const card = instance.cards.value.find(c => c.column === 'todo')
		expect(card).toBeDefined()

		instance.moveCard(card.id, 'progress')
		expect(instance.cards.value.find(c => c.id === card.id).column).toBe('progress')

		instance.moveCard(card.id, 'done')
		expect(instance.cards.value.find(c => c.id === card.id).column).toBe('done')

		instance.moveCard(card.id, 'todo')
		expect(instance.cards.value.find(c => c.id === card.id).column).toBe('todo')
	})
})

describe('KanbanBoardComponent reactivity', () => {
	it('should update getColumnCards when cards signal changes', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const initialTodo = instance.getColumnCards('todo').length

		instance.newTitle.value = 'React test'
		instance.addCard()

		expect(instance.getColumnCards('todo').length).toBe(initialTodo + 1)
	})

	it('should reflect deletions in column counts', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const progressCards = instance.getColumnCards('progress')
		expect(progressCards.length).toBeGreaterThan(0)

		instance.deleteCard(progressCards[0].id)
		expect(instance.getColumnCards('progress').length).toBe(progressCards.length - 1)
	})

	it('should update column counts after move', async () => {
		const { KanbanBoardComponent } = await import('../components/kanban-board.js')
		const instance = new KanbanBoardComponent()
		const todoBefore = instance.getColumnCards('todo').length
		const doneBefore = instance.getColumnCards('done').length
		const card = instance.cards.value.find(c => c.column === 'todo')

		instance.moveCard(card.id, 'done')

		expect(instance.getColumnCards('todo').length).toBe(todoBefore - 1)
		expect(instance.getColumnCards('done').length).toBe(doneBefore + 1)
	})
})

describe('KanbanBoardComponent plugin', () => {
	it('should export init and render functions', async () => {
		const plugin = await import('../plugins/kanban-board/index.js')
		expect(typeof plugin.init).toBe('function')
		expect(typeof plugin.render).toBe('function')
	})

	it('should render the custom element tag', async () => {
		const plugin = await import('../plugins/kanban-board/index.js')
		const html = plugin.render()
		expect(html).toContain('kanban-board')
	})
})
