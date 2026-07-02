import { KanbanBoardComponent } from '../../components/kanban-board.js'

export const state = {}

export async function init() {
    if (!customElements.get('kanban-board')) {
        customElements.define('kanban-board', KanbanBoardComponent)
    }
}

export function render() {
    return `<kanban-board></kanban-board>`
}
