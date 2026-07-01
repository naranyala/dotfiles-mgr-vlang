module util

import x.json2

pub fn get_arg(req string, index int) ?string {
	raw := json2.decode[json2.Any](req) or { return none }
	arr := raw.as_array()
	if index >= arr.len { return none }
	return arr[index].str()
}
