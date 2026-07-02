module probe

import src.core
import src.util

import os
import json

struct SystemProbeResult {
	load_avg    []f64 @[json: 'loadAvg']
	procs_total int   @[json: 'procsTotal']
	procs_run   int   @[json: 'procsRunning']
	cpu_cores   int   @[json: 'cpuCores']
}

fn rpc_system_probe(req string, mut app &core.App) string {
	load_avg := os.read_file('/proc/loadavg') or { return util.err_resp("cannot read /proc/loadavg") }
	load_parts := load_avg.trim_space().split(' ')
	load1 := load_parts[0].f64()
	load5 := load_parts[1].f64()
	load15 := load_parts[2].f64()

	stat_content := os.read_file('/proc/stat') or { return util.err_resp("cannot read /proc/stat") }
	mut total_procs := 0
	mut running_procs := 0
	for line in stat_content.split('\n') {
		if line.starts_with('processes ') {
			total_procs = line.split(' ')[1].int()
		}
		if line.starts_with('procs_running ') {
			running_procs = line.split(' ')[1].int()
		}
	}

	cpuinfo := os.read_file('/proc/cpuinfo') or { return util.err_resp("cannot read /proc/cpuinfo") }
	mut cores := 0
	for line in cpuinfo.split('\n') {
		if line.starts_with('processor') {
			cores++
		}
	}

	core_count := if cores > 0 { cores } else { 1 }
	return json.encode(SystemProbeResult{
		load_avg: [load1, load5, load15]
		procs_total: total_procs
		procs_run: running_procs
		cpu_cores: core_count
	})
}

pub fn register(mut app core.App) {
	app.register_rpc('shell.systemProbe', fn (req string, mut app &core.App) string { return rpc_system_probe(req, mut app) })
}
