module tts

import src.core
import src.util

const tts_url = 'http://127.0.0.1:8082'

fn rpc_health(req string, mut app &core.App) string {
	res := util.http_get('${tts_url}/health')
	return res.body
}

fn rpc_voices(req string, mut app &core.App) string {
	res := util.http_get('${tts_url}/voices')
	return res.body
}

fn rpc_speak(req string, mut app &core.App) string {
	text := util.get_arg(req, 0) or { return util.err_resp('Missing text') }
	voice := util.get_arg(req, 1) or { 'en-US-AriaNeural' }
	rate := util.get_arg(req, 2) or { '+0%' }
	res := util.http_post_json('${tts_url}/speak', '{"text":"${text}","voice":"${voice}","rate":"${rate}"}')
	return res.body
}

pub fn register(mut app core.App) {
	app.register_rpc('tts.health', fn (req string, mut app &core.App) string { return rpc_health(req, mut app) })
	app.register_rpc('tts.voices', fn (req string, mut app &core.App) string { return rpc_voices(req, mut app) })
	app.register_rpc('tts.speak', fn (req string, mut app &core.App) string { return rpc_speak(req, mut app) })
}
