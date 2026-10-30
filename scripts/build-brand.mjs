import { readFile, writeFile } from 'node:fs/promises';

// Recolor the original app emblem as one shape: both its K and circular band
// become pure white. Preserve the original silhouette without adding a stroke.
const source = await readFile(new URL('../public/favicon.png', import.meta.url));
const blue = [0x3b, 0x59, 0x98];
const originalBackground = [179, 208, 244];
const channels = ['R', 'G', 'B']
    .map(
        (channel, index) =>
            `<feFunc${channel} type="linear" slope="${(blue[index] - 255) / originalBackground[index]}" intercept="1"/>`,
    )
    .join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <defs><filter id="brand-white" color-interpolation-filters="sRGB"><feComponentTransfer>${channels}</feComponentTransfer></filter></defs>
  <image width="128" height="128" href="data:image/png;base64,${source.toString('base64')}" filter="url(#brand-white)"/>
</svg>
`;
await writeFile(new URL('../public/favicon.svg', import.meta.url), svg);
