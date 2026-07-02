import os

fn main() {
	args := os.args
	subcmd := if args.len > 1 { args[1] } else { '' }

	match subcmd {
		'longest' { show_longest_lines() }
		else { build_and_run() }
	}
}

fn build_and_run() {
	println("Building webview library...")
	make_res := os.execute('make -C lib/webview')
	if make_res.exit_code != 0 {
		eprintln(make_res.output)
		exit(1)
	}

	println("Building application...")
	pc := os.execute('pkg-config --cflags gtk+-3.0 webkit2gtk-4.1').output.trim_space()
	res := os.execute('v -cc gcc -cflags "$pc" -o main .')
	if res.exit_code != 0 {
		eprintln(res.output)
		exit(1)
	}

	println("Running...")
	run_res := os.execute('./main')
	if run_res.exit_code != 0 {
		eprintln(run_res.output)
		exit(run_res.exit_code)
	}
}

struct LineEntry {
	file  string
	line  int
	len   int
	content string
}

fn show_longest_lines() {
	lang_names := ['JS', 'CSS', 'V', 'C']
	lang_exts := ['.js', '.css', '.v', '.c']
	dirs := ['src', 'frontend/src']
	top_n := 10

	for li in 0 .. lang_names.len {
		ext := lang_exts[li]
		name := lang_names[li]
		mut entries := []LineEntry{}

		for dir in dirs {
			if !os.is_dir(dir) { continue }
			scan_dir(dir, [ext], mut entries)
		}

		entries.sort_with_compare(fn (a &LineEntry, b &LineEntry) int {
			return b.len - a.len
		})

		total := if entries.len < top_n { entries.len } else { top_n }
		println('')
		println('=== ${name} — Top ${total} longest lines ===')
		println('')

		for i in 0 .. total {
			e := entries[i]
			println('  ${e.len}  ${e.file}:${e.line}')
		}
		println('')
	}
}

fn scan_dir(dir string, extensions []string, mut entries []LineEntry) {
	items := os.ls(dir) or { return }
	for item in items {
		path := os.join_path(dir, item)
		if os.is_dir(path) {
			scan_dir(path, extensions, mut entries)
		} else {
			ext := os.file_ext(path)
			if ext in extensions {
				scan_file(path, mut entries)
			}
		}
	}
}

fn scan_file(path string, mut entries []LineEntry) {
	content := os.read_file(path) or { return }
	mut max_line := LineEntry{}
	mut found := false
	for i, line in content.split('\n') {
		trimmed := line.trim_space()
		if trimmed.len > 0 && trimmed.len > max_line.len {
			max_line = LineEntry{
				file: path
				line: i + 1
				len: trimmed.len
				content: if trimmed.len > 120 { trimmed[..120] + '...' } else { trimmed }
			}
			found = true
		}
	}
	if found {
		entries << max_line
	}
}
