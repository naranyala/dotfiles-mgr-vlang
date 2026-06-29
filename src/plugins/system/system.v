module system

import src.core

import os
import json

fn rpc_system_info(req string, mut app core.App) string {
	return json.encode({
		"platform": os.user_os()
		"homeDir": os.home_dir()
	})
}

fn rpc_hostname(req string, mut app core.App) string {
	res := os.execute("hostname")
	return json.encode({ "hostname": res.output.trim_space() })
}

fn rpc_username(req string, mut app core.App) string {
	res := os.execute("whoami")
	return json.encode({ "username": res.output.trim_space() })
}

fn rpc_uname(req string, mut app core.App) string {
	res := os.execute("uname -a")
	parts := res.output.trim_space().split(" ")
	if parts.len < 3 { return '{"error": "failed to parse uname"}' }
	return json.encode({
		"sysname": parts[0]
		"release": parts[2]
		"machine": parts[parts.len-2]
		"version": parts[3]
	})
}

fn rpc_memory_info(req string, mut app core.App) string {
	res := os.execute("free -b")
	lines := res.output.split("\n")
	if lines.len > 1 {
		cols := lines[1].split(" ").filter(it != "")
		if cols.len >= 7 {
			total := cols[1].f64()
			available := cols[6].f64()
			used := total - available
			return json.encode({
				"total": total
				"available": available
				"usedPercent": (used / total) * 100.0
			})
		}
	}
	return '{"error": "failed to read memory"}'
}

fn rpc_uptime(req string, mut app core.App) string {
	res := os.execute("cat /proc/uptime")
	parts := res.output.split(" ")
	if parts.len > 0 {
		return json.encode({ "seconds": parts[0].f64() })
	}
	return '{"error": "failed to read uptime"}'
}

fn rpc_disk_usage(req string, mut app core.App) string {
	path := core.get_arg(req, 0) or { "/" }
	res := os.execute("df -B1 $path")
	lines := res.output.split("\n")
	if lines.len > 1 {
		cols := lines[1].split(" ").filter(it != "")
		if cols.len >= 5 {
			total := cols[1].f64()
			used := cols[2].f64()
			free := cols[3].f64()
			return json.encode({
				"total": total
				"free": free
				"usedPercent": (used / total) * 100.0
			})
		}
	}
	return '{"error": "failed to read disk usage"}'
}

pub fn register(mut app core.App) {
	app.register_rpc('systemInfo', fn (req string, mut app core.App) string { return rpc_system_info(req, mut app) })
	app.register_rpc('hostname', fn (req string, mut app core.App) string { return rpc_hostname(req, mut app) })
	app.register_rpc('username', fn (req string, mut app core.App) string { return rpc_username(req, mut app) })
	app.register_rpc('uname', fn (req string, mut app core.App) string { return rpc_uname(req, mut app) })
	app.register_rpc('memoryInfo', fn (req string, mut app core.App) string { return rpc_memory_info(req, mut app) })
	app.register_rpc('uptime', fn (req string, mut app core.App) string { return rpc_uptime(req, mut app) })
	app.register_rpc('diskUsage', fn (req string, mut app core.App) string { return rpc_disk_usage(req, mut app) })
}
