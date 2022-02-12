import commonjs from '@rollup/plugin-commonjs';
import { inputHTML } from "./script/rollup-plugin-html.js";
import jsonParse from "rollup-plugin-json-parse";
import replace from "@rollup/plugin-replace";
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';

export default {
    input: 'src/input.html',
    output: {
        file: 'build/bundle.js',
        entryFileNames: "[name].[ext]",
        assetFileNames: "[name].[ext]",
        format: 'esm'
    },
    plugins: [
        inputHTML(),
        commonjs(),
        svelte({
            emitCss: true,
            compilerOptions: {
                hydratable: false,
            }
        }),
        jsonParse(),
        resolve({ browser: true }),
        replace({
            preventAssignment: true,
            values: {
                'process.env.NODE_ENV': JSON.stringify('production'),
            }
        }),
    ]
}