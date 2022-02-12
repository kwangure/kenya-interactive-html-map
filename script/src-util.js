// https://github.com/UpperCod/rollup-plugin-input-html

export function getSources(input) {
	let sources = [];
	/*
	/(<(script)([^\>]+)>\s*<\/script>|<(link)([^\>]+)(?:\/){0,1}>)/g
	*/
	let output = input.replace(/(<script[^\>]+>\s*<\/script>)/g, (all, tag) => {
		let tagName = tag.match(/<(\w+)\s+/)[1];
		let props = { tagName };
		if (tagName) {
			tag.replace(
				/ +([\w\-]+)=(?:"([^\"]+)"|'([^\']+)')/g,
				(all, index, value) => {
					props[index] = value;
				}
			);
            // Check it's a local module
			if (props.type == "module" && /^\./.test(props.src || "")) {
				sources.push(props);
				return "";
			}
		}
		return all;
	});

	return {
		output,
		input,
		sources
	};
}

export function setSources(html, inject) {
    let replaceBody = "<!--%replace.body%-->";
	return html.replace(replaceBody, `${inject}${replaceBody}`)
}
