import { createConfiguration } from "@minify-html/js";
import { formatMessages, transform } from 'esbuild';
import { getSources, setSources } from "./src-util.js";
import path from "path";


export function inputHTML() {
	let styles = "";
	let html = {};
	const minifyConfig = createConfiguration({
		keep_spaces_between_attributes: true,
		do_not_minify_doctype: true,
	 });
	return {
		name: "rollup-plugin-input-html",
		async transform(code, id) {
			if (id.endsWith(".css")) {
				styles += code;
				return "export default ''";
			}
			if (!id.endsWith(".html")) return;

			html[id] = html[id] || {};

			if (html[id].input !== code) {
				let data = getSources(code);
				data.code = data.sources
					.filter(({ tagName }) => tagName == "script")
					.map(script => {
						return `export * from ${JSON.stringify(script.src)};`;
					})
					.join(";\n");
				html[id] = data;
			}
			return {
				code: html[id].code
			};
		},
		async generateBundle(opts, bundle) {
			for (const key in bundle) {
				const extname = path.extname(key);
				const { facadeModuleId, code } = bundle[key];
				const htmlObj = html[facadeModuleId];
				if (!htmlObj) continue;
				htmlObj.output = setSources(htmlObj.output, `<script type="module">${await minify(code, "js")}</script>`);
				delete bundle[key];
			}
			for (const key in html) {
				if (Object.hasOwnProperty.call(html, key)) {
					let { output } = html[key];
					output = setSources(output, `<style>${await minify(styles, "css")}</style>`);
					const name = path.basename(key, ".html");
					let [_, body] = /<!--%open.body%-->(.*)<!--%close.body%-->/ms.exec(output);
					output = output.replace(/<!--%replace.body%-->|<!--%open.body%-->|<!--%close.body%-->/msg, "");
					body = body
						.replace(/<!--%replace.body%-->|<!--%open.body%-->|<!--%close.body%-->/msg, "")
						.trim();
					this.emitFile({
						type: 'asset',
						name: `${name}.html`,
						source: output,
					});
					this.emitFile({
						type: 'asset',
						name: `${name}-body.html`,
						source: body,
					});
				}
			}

		}
	};
}

async function minify(js, loader) {
	const { code, warnings } = await transform(js, {
		loader,
		minify: true,
	});

	if (warnings.length) {
		console.log("esbuild warnings", warnings);
	}

	return code;
}


