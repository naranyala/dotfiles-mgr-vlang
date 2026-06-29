module main

import os
import src.core
import src.plugins.system
import src.plugins.files
import src.plugins.git
import src.plugins.tools

$if !test {
fn main() {
	html_content := os.read_file('frontend/dist/app.html') or {
		eprintln("Failed to read frontend/dist/app.html.")
		exit(1)
	}

	mut app := core.new_app()
	app.set_title("dotfiles-mgr")
	app.set_size(1024, 800)

	system.register(mut app)
	files.register(mut app)
	git.register(mut app)
	tools.register(mut app)

	app.set_html(html_content)
	app.run()
}
}
