import { ReactiveComponent } from '../core/component.js'
import { signal, computed } from '../core/signals.js'
import { html } from '../core/template.js'
import { componentStyles } from '../shared/component-styles.js'

let nextId = 1

const styles = componentStyles(`
    .kanban { width: 100%; }
    .kanban-header {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 1rem;
    }
    .kanban-header h3 { margin: 0; font-size: 1rem; font-weight: 600; }
    .kanban-board {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;
        min-height: 300px;
    }
    .kanban-column {
        background: rgba(15,23,42,0.5); border: 1px solid rgba(255,255,255,0.08);
        border-radius: 10px; padding: 0.5rem; display: flex; flex-direction: column;
    }
    .kanban-column.drag-over {
        border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.05);
    }
    .col-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 0.4rem 0.5rem; margin-bottom: 0.5rem;
        font-size: 0.78rem; font-weight: 600; text-transform: uppercase;
        letter-spacing: 0.04em; color: #94a3b8;
    }
    .col-count {
        background: rgba(99,102,241,0.15); color: #818cf8;
        font-size: 0.65rem; font-weight: 700; padding: 1px 6px;
        border-radius: 999px; min-width: 18px; text-align: center;
    }
    .col-cards { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; min-height: 60px; }
    .card {
        background: rgba(30,41,59,0.6); border: 1px solid rgba(255,255,255,0.08);
        border-radius: 8px; padding: 0.6rem 0.7rem; cursor: grab;
        transition: all 0.15s; user-select: none; position: relative;
    }
    .card:hover { border-color: rgba(255,255,255,0.15); background: rgba(30,41,59,0.8); }
    .card.dragging { opacity: 0.4; transform: scale(0.97); }
    .card-title { font-size: 0.82rem; color: #e2e8f0; font-weight: 500; margin-bottom: 0.2rem; }
    .card-desc { font-size: 0.72rem; color: #64748b; line-height: 1.4; }
    .card-delete {
        position: absolute; top: 6px; right: 6px; background: none;
        border: none; color: #475569; cursor: pointer; font-size: 0.7rem;
        padding: 2px 4px; border-radius: 4px; opacity: 0; transition: all 0.12s;
    }
    .card:hover .card-delete { opacity: 1; }
    .card-delete:hover { color: #f87171; background: rgba(239,68,68,0.15); }
    .add-card {
        display: flex; gap: 0.4rem; margin-top: 0.5rem;
    }
    .add-card input {
        flex: 1; padding: 0.4rem 0.5rem; font-size: 0.78rem;
        background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.08);
        border-radius: 6px; color: #f8fafc;
    }
    .add-card input:focus { border-color: rgba(99,102,241,0.5); outline: none; }
    .add-card button {
        padding: 0.4rem 0.6rem; font-size: 0.75rem; font-weight: 600;
        background: #6366f1; color: white; border: none; border-radius: 6px;
        cursor: pointer; white-space: nowrap;
    }
    .add-card button:hover { background: #4f46e5; }
    .empty-col { text-align: center; padding: 1.5rem 0.5rem; color: #475569; font-size: 0.75rem; font-style: italic; }
    .stats { display: flex; gap: 1rem; margin-top: 0.75rem; font-size: 0.72rem; color: #64748b; }
    .stat-item { display: flex; align-items: center; gap: 4px; }
    .stat-dot { width: 6px; height: 6px; border-radius: 50%; }
    .stat-dot.todo { background: #6366f1; }
    .stat-dot.progress { background: #f59e0b; }
    .stat-dot.done { background: #10b981; }
`)

const COLUMNS = [
    { id: 'todo', label: 'To Do', color: '#6366f1' },
    { id: 'progress', label: 'In Progress', color: '#f59e0b' },
    { id: 'done', label: 'Done', color: '#10b981' },
]

export class KanbanBoardComponent extends ReactiveComponent {
    static styles = styles

    constructor() {
        super()
        this.cards = signal([
            { id: nextId++, title: 'Design mockups', desc: 'Create wireframes for the new feature', column: 'todo' },
            { id: nextId++, title: 'Setup CI/CD', desc: 'Configure GitHub Actions pipeline', column: 'todo' },
            { id: nextId++, title: 'Implement auth', desc: 'Add JWT-based authentication', column: 'progress' },
            { id: nextId++, title: 'Write tests', desc: 'Unit tests for core modules', column: 'progress' },
            { id: nextId++, title: 'Project setup', desc: 'Initialize repo and tooling', column: 'done' },
        ])
        this.newTitle = signal('')
        this.addColumn = signal('todo')
        this.draggedCard = signal(null)
    }

    getColumnCards(colId) {
        return this.cards.value.filter(c => c.column === colId)
    }

    addCard() {
        const title = this.newTitle.value.trim()
        if (!title) return
        this.cards.update(cards => [
            ...cards,
            { id: nextId++, title, desc: '', column: this.addColumn.value },
        ])
        this.newTitle.value = ''
    }

    deleteCard(id) {
        this.cards.update(cards => cards.filter(c => c.id !== id))
    }

    moveCard(cardId, toColumn) {
        this.cards.update(cards =>
            cards.map(c => c.id === cardId ? { ...c, column: toColumn } : c)
        )
    }

    onDragStart(e, cardId) {
        this.draggedCard.value = cardId
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', String(cardId))
        const el = e.target.closest('.card')
        if (el) requestAnimationFrame(() => el.classList.add('dragging'))
    }

    onDragEnd(e) {
        this.draggedCard.value = null
        const el = e.target.closest('.card')
        if (el) el.classList.remove('dragging')
        this.shadowRoot.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'))
    }

    onDragOver(e) {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    onDragEnter(e, colId) {
        e.preventDefault()
        const col = e.target.closest('.kanban-column')
        if (col) col.classList.add('drag-over')
    }

    onDragLeave(e, colId) {
        const col = e.target.closest('.kanban-column')
        if (col && !col.contains(e.relatedTarget)) col.classList.remove('drag-over')
    }

    onDrop(e, colId) {
        e.preventDefault()
        const col = e.target.closest('.kanban-column')
        if (col) col.classList.remove('drag-over')
        const cardId = parseInt(e.dataTransfer.getData('text/plain'), 10)
        if (cardId) this.moveCard(cardId, colId)
    }

    onMount() {
        this.delegate('keydown', '.add-card input', (e) => {
            if (e.key === 'Enter') this.addCard()
        })
        this.delegate('click', '.add-card button', () => this.addCard())
        this.delegate('click', '.col-tab', (e) => {
            const tab = e.target.closest('.col-tab')
            if (tab) this.addColumn.value = tab.dataset.col
        })
    }

    render() {
        const counts = {
            todo: this.getColumnCards('todo').length,
            progress: this.getColumnCards('progress').length,
            done: this.getColumnCards('done').length,
        }
        const total = counts.todo + counts.progress + counts.done

        return html`
            <div class="kanban">
                <div class="kanban-header">
                    <h3>Kanban Board</h3>
                    <div class="stats">
                        <span class="stat-item"><span class="stat-dot todo"></span> ${counts.todo} todo</span>
                        <span class="stat-item"><span class="stat-dot progress"></span> ${counts.progress} active</span>
                        <span class="stat-item"><span class="stat-dot done"></span> ${counts.done} done</span>
                        <span>${total} total</span>
                    </div>
                </div>
                <div class="kanban-board">
                    ${COLUMNS.map(col => html`
                        <div class="kanban-column"
                            data-col="${col.id}"
                            @dragover="${(e) => this.onDragOver(e)}"
                            @dragenter="${(e) => this.onDragEnter(e, col.id)}"
                            @dragleave="${(e) => this.onDragLeave(e, col.id)}"
                            @drop="${(e) => this.onDrop(e, col.id)}">
                            <div class="col-header">
                                <span>${col.label}</span>
                                <span class="col-count">${counts[col.id]}</span>
                            </div>
                            <div class="col-cards">
                                ${this.getColumnCards(col.id).length === 0
                                    ? html`<div class="empty-col">Drop cards here</div>`
                                    : this.getColumnCards(col.id).map(card => html`
                                        <div class="card" data-key="card-${card.id}" draggable="true"
                                            @dragstart="${(e) => this.onDragStart(e, card.id)}"
                                            @dragend="${(e) => this.onDragEnd(e)}">
                                            <div class="card-title">${card.title}</div>
                                            ${card.desc ? html`<div class="card-desc">${card.desc}</div>` : ''}
                                            <button class="card-delete" data-delete="${card.id}">✕</button>
                                        </div>
                                    `)
                                }
                            </div>
                            <div class="add-card">
                                <input placeholder="Add a card…" :value="${this.newTitle.value}"
                                    @input="${(e) => { this.newTitle.value = e.target.value }}" />
                                <button>+ Add</button>
                            </div>
                        </div>
                    `)}
                </div>
            </div>
        `
    }
}
