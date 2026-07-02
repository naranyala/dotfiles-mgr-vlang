module main

import os
import src.core
import src.plugins.system
import src.plugins.files
import src.plugins.git
import src.plugins.tools
import src.plugins.processes
import src.plugins.probe
import src.plugins.search
import src.plugins.fstree
import src.plugins.metrics
import src.plugins.sqlite
import src.plugins.repo
import src.plugins.state
import src.plugins.llama
import src.plugins.tts

$if !test {
fn main() {
	html_content := os.read_file('frontend/dist/index.html') or {
		eprintln("Failed to read frontend/dist/index.html.")
		exit(1)
	}

	mut app := core.new_app()
	app.set_title("dotfiles-mgr")
	app.set_size(1024, 800)

	system.register(mut app)
	files.register(mut app)
	git.register(mut app)
	tools.register(mut app)
	processes.register(mut app)
	probe.register(mut app)
	search.register(mut app)
	fstree.register(mut app)
	metrics.register(mut app)
	sqlite.register(mut app)
	repo.register(mut app)
	state.register(mut app)
	llama.register(mut app)
	tts.register(mut app)

	app.set_html(html_content)
	app.run()
}
}
