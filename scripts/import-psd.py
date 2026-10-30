"""Extract the source artwork and text metrics. Usage: python import-psd.py k24.psd.

Requires psd-tools and Pillow; these are only needed when reimporting the PSD.
The PSD and complete reference screenshots are not included in the web build.
"""

import argparse
import hashlib
import json
import math
from pathlib import Path

from psd_tools import PSDImage
from psd_tools.constants import Tag, Resource


LAYERS = {
    'background-gray': 139,
    'background-mint': 419,
    'background-triangles': 495,
    'program-mask': 71,
    'ident-classic': 81,
    'ident-modern': 458,
    'bars': 51,
    'mark': 338,
    'channel-wordmark': 3,
    'category': 27,
    'headline': 24,
    'description': 101,
    'speaker': 181,
    'event': 138,
    'quote': 355,
    'ticker-base': 180,
    'ticker': 156,
    'urgent-news': 160,
    'live': 294,
    'address': 31,
    'next': 384,
    'social': 291,
    'sms': 374,
}
TEXT = {
    'ident': 72,
    'event': 133,
    'date': 131,
    'program': 66,
    'speaker': 183,
    'news': 90,
    'clock': 18,
    'stock-name': 216,
    'stock-value': 317,
    'mood': 382,
    'street': 217,
    'traffic': 208,
    'headline': 15,
    'quote': 351,
    'description': 103,
    'channel': 3,
    'live': 296,
    'address': 32,
    'next': 304,
    'category': 28,
}


def plain(value):
    if hasattr(value, 'items'):
        return {str(plain(k)): plain(v) for k, v in value.items()}
    if hasattr(value, 'value'):
        return plain(value.value)
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    return [plain(v) for v in value]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    output = root / 'public/assets/psd'
    output.mkdir(parents=True, exist_ok=True)
    psd = PSDImage.open(args.source)
    assert psd.size == (1024, 576), 'Unexpected PSD canvas size'
    layers = {layer.layer_id: layer for layer in psd.descendants()}
    assets = {}

    def save(name, image, x, y, layer_id):
        image.save(output / f'{name}.png', optimize=True)
        assets[name] = dict(x=x, y=y, width=image.width, height=image.height, layerId=layer_id)

    for name, layer_id in LAYERS.items():
        layer = layers[layer_id]
        image = layer.topil().convert('RGBA')
        # Social/SMS source layers contain baked-in example text. Reuse an empty
        # vertical strip from the original artwork so every caption stays editable.
        if name in ('social', 'sms'):
            image = image.crop((image.width - 4, 0, image.width - 3, image.height)).resize(image.size)
        save(name, image, layer.left, layer.top, layer_id)

    ticker = layers[156]
    image = ticker.topil().convert('RGBA')
    for name, box in {
        'metrics': (62, 491, 962, 521),
        'news': (62, 522, 962, 551),
    }.items():
        left, top, right, bottom = box
        crop = image.crop((left - ticker.left, top - ticker.top, right - ticker.left, bottom - ticker.top))
        save(name, crop, left, top, ticker.layer_id)

    # The original curved mask, on its original silver backdrop. This also
    # replaces the old screenshot-derived backplate at its existing asset URL.
    background = layers[139].topil().convert('RGBA')
    mask = layers[71]
    program = background.copy()
    program.alpha_composite(mask.topil().convert('RGBA'), (mask.left, mask.top))
    program.convert('RGB').save(root / 'public/assets/program-background.webp', lossless=True)
    background.convert('RGB').save(root / 'public/assets/silver-background.webp', lossless=True)
    layers[338].topil().save(root / 'public/assets/mark.png')
    # White central emblem from the identification background, with its matte
    # removed so it can be reused on other source backgrounds.
    inverse = layers[81].topil().convert('RGBA').crop((414, 190, 609, 385))
    alpha = inverse.getchannel('R').point(lambda value: round(max(0, value - 6) * 255 / 249))
    inverse.paste((255, 255, 255), (0, 0, inverse.width, inverse.height))
    inverse.putalpha(alpha)
    inverse.save(root / 'public/assets/mark-inverse.png')

    text = {}
    for name, layer_id in TEXT.items():
        layer = layers[layer_id]
        font_table = plain(layer.resource_dict['FontSet'])
        runs = plain(layer.engine_dict['StyleRun'])
        styles = []
        for run in runs['RunArray']:
            style = run['StyleSheet']['StyleSheetData']
            postscript_name = font_table[int(style.get('Font', 0))]['Name']
            styles.append(dict(
                font=postscript_name,
                size=style['FontSize'],
                weight=700 if 'Bold' in postscript_name else 500 if 'Medium' in postscript_name else 300 if 'Light' in postscript_name else 400,
                italic='Ital' in postscript_name,
                tracking=style.get('Tracking', 0),
                leading=style.get('Leading', 0),
                color=style['FillColor']['Values'][1:],
            ))
        shadow = None
        effects = layer.tagged_blocks.get_data(Tag.OBJECT_BASED_EFFECTS_LAYER_INFO)
        drop = effects.get(b'DrSh') if effects else None
        if drop and plain(drop.get(b'enab')):
            angle = psd.image_resources.get_data(Resource.GLOBAL_ANGLE) if plain(drop.get(b'uglg')) else plain(drop[b'lagl'])
            angle = math.radians(angle)
            distance = plain(drop[b'Dstn'])
            shadow = dict(color=f'rgba(0,0,0,{plain(drop[b"Opct"]) / 100})', blur=plain(drop[b'blur']), offsetX=-math.cos(angle) * distance, offsetY=math.sin(angle) * distance)
        text[name] = dict(layerId=layer_id, x=layer.transform[4], baseline=layer.transform[5], bbox=list(layer.bbox), styles=styles, shadow=shadow)

    metadata = dict(width=psd.width, height=psd.height, sourceSha256=hashlib.sha256(args.source.read_bytes()).hexdigest(), assets=assets, text=text)
    (root / 'src/data/psd.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=4) + '\n')
    print(f'Extracted {len(assets)} assets and {len(text)} text styles to {output}')


if __name__ == '__main__':
    main()
