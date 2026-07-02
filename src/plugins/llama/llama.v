module llama

import src.core
import src.util

const llama_url = 'http://127.0.0.1:8081'

fn rpc_health(req string, mut app &core.App) string {
	res := util.http_get('${llama_url}/health')
	return res.body
}

fn rpc_models(req string, mut app &core.App) string {
	res := util.http_get('${llama_url}/models')
	return res.body
}

fn rpc_load(req string, mut app &core.App) string {
	model_path := util.get_arg(req, 0) or { return util.err_resp('Missing model path') }
	res := util.http_post_json('${llama_url}/load', '{"model_path":"${model_path}"}')
	return res.body
}

fn rpc_unload(req string, mut app &core.App) string {
	res := util.http_post_json('${llama_url}/unload', '{}')
	return res.body
}

fn rpc_generate(req string, mut app &core.App) string {
	prompt := util.get_arg(req, 0) or { return util.err_resp('Missing prompt') }
	max_tokens := util.get_arg(req, 1) or { '512' }
	res := util.http_post_json('${llama_url}/generate', '{"prompt":"${prompt}","max_tokens":${max_tokens}}')
	return res.body
}

pub fn register(mut app core.App) {
	app.register_rpc('llama.health', fn (req string, mut app &core.App) string { return rpc_health(req, mut app) })
	app.register_rpc('llama.models', fn (req string, mut app &core.App) string { return rpc_models(req, mut app) })
	app.register_rpc('llama.load', fn (req string, mut app &core.App) string { return rpc_load(req, mut app) })
	app.register_rpc('llama.unload', fn (req string, mut app &core.App) string { return rpc_unload(req, mut app) })
	app.register_rpc('llama.generate', fn (req string, mut app &core.App) string { return rpc_generate(req, mut app) })
}
