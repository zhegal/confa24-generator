import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from '@vue/compiler-dom';

async function files(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(
        entries.map(async (entry) => {
            const path = join(directory, entry.name);
            return entry.isDirectory() ? files(path) : path.endsWith('.vue') ? [path] : [];
        }),
    );
    return nested.flat();
}

function lines(source, indentation, original = 0) {
    const parts = source.trim().split('\n');
    return parts
        .map((line, index) => {
            if (!index) {
                return ' '.repeat(indentation) + line;
            }
            const shift = indentation - original;
            return shift < 0
                ? line.slice(Math.min(-shift, line.search(/\S/)))
                : ' '.repeat(shift) + line;
        })
        .join('\n');
}

function textLines(text, indentation) {
    const words = text.replace(/\s+/g, ' ').trim().split(' ');
    const result = [];
    let current = '';
    for (const word of words) {
        if (current && indentation + current.length + word.length + 1 > 100) {
            result.push(' '.repeat(indentation) + current);
            current = '';
        }
        current += (current ? ' ' : '') + word;
    }
    if (current) {
        result.push(' '.repeat(indentation) + current);
    }
    return result.join('\n');
}

function nodeLines(node, indentation) {
    if (node.type === 2) {
        return textLines(node.content, indentation);
    }
    if (node.type !== 1) {
        return lines(node.loc.source, indentation, node.loc.start.column - 1);
    }
    const pad = ' '.repeat(indentation);
    const ending = node.isSelfClosing ? ' />' : '>';
    const attributes = node.props.map((prop) => prop.loc.source);
    const inline = `<${node.tag}${attributes.length ? ' ' : ''}${attributes.join(' ')}${ending}`;
    let opening;
    if (attributes.length <= 2 && !inline.includes('\n') && indentation + inline.length <= 100) {
        opening = pad + inline;
    } else {
        const props = node.props.map((prop) => {
            return lines(prop.loc.source, indentation + 4, prop.loc.start.column - 1);
        });
        opening = `${pad}<${node.tag}\n${props.join('\n')}\n${pad}${ending.trimStart()}`;
    }
    if (node.isSelfClosing) {
        return opening;
    }
    const children = node.children
        .map((child) => nodeLines(child, indentation + 4))
        .filter(Boolean);
    return [opening, ...children, `${pad}</${node.tag}>`].join('\n');
}

let invalid = false;
for (const path of await files('src')) {
    const source = await readFile(path, 'utf8');
    const match = source.match(/<template>([\s\S]*?)<\/template>\s*\n\s*<script/);
    if (!match) {
        continue;
    }
    const ast = parse(match[1], { comments: true });
    const content = ast.children
        .map((node) => nodeLines(node, 4))
        .filter(Boolean)
        .join('\n');
    const updated = source.replace(match[0], `<template>\n${content}\n</template>\n\n<script`);
    if (source !== updated) {
        invalid = true;
        if (!process.argv.includes('--check')) {
            await writeFile(path, updated);
        } else {
            process.stderr.write(`Vue formatting differs: ${path}\n`);
        }
    }
}
if (process.argv.includes('--check') && invalid) {
    process.exitCode = 1;
}
