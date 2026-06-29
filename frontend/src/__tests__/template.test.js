import { describe, it, expect, beforeEach } from 'bun:test'
import { html, TemplateResult, classMap, styleMap, when, each, render, reconcile } from '../core/template.js'

describe('classMap', () => {
	it('should return space-separated class names for truthy values', () => {
		const result = classMap({ active: true, hidden: false, selected: true })
		expect(result).toBe('active selected')
	})

	it('should return empty string for all falsy', () => {
		const result = classMap({ a: false, b: 0, c: null })
		expect(result).toBe('')
	})

	it('should handle empty object', () => {
		const result = classMap({})
		expect(result).toBe('')
	})

	it('should handle truthy non-boolean values', () => {
		const result = classMap({ a: 1, b: 'yes', c: [] })
		expect(result).toBe('a b c')
	})
})

describe('styleMap', () => {
	it('should return semicolon-separated styles', () => {
		const result = styleMap({ color: 'red', fontSize: '14px' })
		expect(result).toBe('color:red;fontSize:14px')
	})

	it('should exclude null/undefined values', () => {
		const result = styleMap({ color: 'red', bg: null, size: undefined })
		expect(result).toBe('color:red')
	})

	it('should handle zero as valid value', () => {
		const result = styleMap({ padding: 0 })
		expect(result).toBe('padding:0')
	})

	it('should handle empty object', () => {
		const result = styleMap({})
		expect(result).toBe('')
	})
})

describe('html tagged template', () => {
	it('should return a TemplateResult', () => {
		const result = html`<div></div>`
		expect(result).toBeInstanceOf(TemplateResult)
	})

	it('should interpolate string values', () => {
		const name = 'world'
		const result = html`<div>Hello ${name}</div>`
		expect(result.toString()).toBe('<div>Hello world</div>')
	})

	it('should interpolate number values', () => {
		const count = 42
		const result = html`<span>${count}</span>`
		expect(result.toString()).toBe('<span>42</span>')
	})

	it('should handle null/undefined interpolation', () => {
		const result = html`<div>${null}${undefined}</div>`
		expect(result.toString()).toBe('<div></div>')
	})

	it('should capture event handlers', () => {
		const handler = () => {}
		const result = html`<button @click=${handler}>Click</button>`
		expect(result.events.size).toBe(1)
		expect(result.toString()).toContain('data-e=')
	})

	it('should capture nested TemplateResult children', () => {
		const inner = html`<span>inner</span>`
		const result = html`<div>${inner}</div>`
		expect(result.children.size).toBe(1)
	})

	it('should handle multiple interpolations', () => {
		const a = 'A'
		const b = 'B'
		const result = html`<div>${a} and ${b}</div>`
		expect(result.toString()).toBe('<div>A and B</div>')
	})

	it('should handle boolean event handlers', () => {
		const handler = () => {}
		const result = html`<input @input=${handler} />`
		expect(result.events.size).toBe(1)
	})
})

describe('when', () => {
	it('should return then_ when condition is true', () => {
		const result = when(true, 'yes', 'no')
		expect(result).toBe('yes')
	})

	it('should return else_ when condition is false', () => {
		const result = when(false, 'yes', 'no')
		expect(result).toBe('no')
	})

	it('should return empty TemplateResult when condition false and no else', () => {
		const result = when(false, 'yes')
		expect(result).toBeInstanceOf(TemplateResult)
		expect(result.toString()).toBe('')
	})
})

describe('each', () => {
	it('should map items to results', () => {
		const result = each([1, 2, 3], (item) => html`<span>${item}</span>`)
		expect(result).toBeInstanceOf(TemplateResult)
		expect(result.toString()).toContain('<span>1</span>')
		expect(result.toString()).toContain('<span>2</span>')
		expect(result.toString()).toContain('<span>3</span>')
	})

	it('should return empty TemplateResult for empty array', () => {
		const result = each([], (item) => html`<div>${item}</div>`)
		expect(result).toBeInstanceOf(TemplateResult)
		expect(result.toString()).toBe('')
	})

	it('should return empty TemplateResult for null/undefined', () => {
		const result = each(null, (item) => html`<div>${item}</div>`)
		expect(result.toString()).toBe('')
	})

	it('should pass index to callback', () => {
		const indices = []
		each(['a', 'b'], (item, i) => {
			indices.push(i)
			return html`<div>${item}</div>`
		})
		expect(indices).toEqual([0, 1])
	})

	it('should collect events from items', () => {
		const handler = () => {}
		const result = each([1], (item) => html`<button @click=${handler}>${item}</button>`)
		expect(result.events.size).toBe(1)
	})
})

// reconcile tests require DOM API (document.createElement)
// These tests should be run in a browser environment
describe.skip('reconcile (requires DOM)', () => {
	it('should update text content', () => {})
	it('should add new children', () => {})
	it('should remove extra children', () => {})
	it('should update attributes', () => {})
})
