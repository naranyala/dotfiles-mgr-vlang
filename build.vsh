import os

fn main() {
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
