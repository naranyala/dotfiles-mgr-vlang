module util

fn escape_json_str(s string) string {
	mut result := s
	result = result.replace('\\', '\\\\')
	result = result.replace('"', '\\"')
	result = result.replace('\n', '\\n')
	result = result.replace('\r', '\\r')
	result = result.replace('\t', '\\t')
	return result
}

pub fn err_resp(msg string) string {
	return '{"error": "${escape_json_str(msg)}"}'
}

pub fn ok_resp() string {
	return '{"success": true}'
}

pub fn json_resp(key string, val string) string {
	return '{"${key}": "${escape_json_str(val)}"}'
}
