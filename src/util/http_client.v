module util

import net.http

pub struct HttpResult {
pub:
	status int
	body   string
}

pub fn http_get(url string) HttpResult {
	resp := http.fetch(http.FetchConfig{
		url:    url
		method: .get
	}) or { return HttpResult{ status: 0, body: '{"error":"connection failed"}' } }
	return HttpResult{ status: resp.status_code, body: resp.body }
}

pub fn http_post_json(url string, json_body string) HttpResult {
	resp := http.fetch(http.FetchConfig{
		url:    url
		method: .post
		data:   json_body
		header: http.new_header_from_map({
			.content_type: 'application/json'
		})
	}) or { return HttpResult{ status: 0, body: '{"error":"connection failed"}' } }
	return HttpResult{ status: resp.status_code, body: resp.body }
}
