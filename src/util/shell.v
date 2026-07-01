module util

import os

pub struct CmdResult {
pub:
	exit_code int
	output    string
}

pub fn exec(cmd string) CmdResult {
	res := os.execute(cmd)
	return CmdResult{
		exit_code: res.exit_code
		output: res.output.trim_space()
	}
}

pub fn exec_ok(cmd string) ?string {
	res := exec(cmd)
	if res.exit_code != 0 { return none }
	return res.output
}

pub fn exec_output(cmd string) string {
	return exec(cmd).output
}

pub fn which(name string) bool {
	return exec('which ${name}').exit_code == 0
}
