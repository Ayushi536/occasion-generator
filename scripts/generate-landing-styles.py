"""Regenerate Wishly's explicit theme recipes and deterministic confetti CSS.

No build step is required. Run python3 scripts/generate-landing-styles.py when
changing palettes; generated CSS is checked in for straightforward review.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PALETTES = {
    'coral': ('#fff3e8', '#cb5942', '#69483a', '#947260', '#eed6bf', '#f5c7b0', '#ffffff'),
    'rose': ('#f5e9e9', '#aa5464', '#744856', '#967280', '#e8cdd2', '#e5b8c3', '#ffffff'),
    'sage': ('#e9eddf', '#58734e', '#3e573b', '#718169', '#d0d9bd', '#b7c9a0', '#ffffff'),
    'lavender': ('#eee9f4', '#806599', '#5c4970', '#8d7e9d', '#dbcee5', '#c9b6dc', '#ffffff'),
    'gold': ('#f7edd6', '#927033', '#70562a', '#938265', '#e4d4ae', '#e0c181', '#ffffff'),
    'midnight': ('#303e48', '#e9c68a', '#f4e7ce', '#c0c9cc', '#596772', '#7d8d9b', '#283640'),
}

def block(selector, properties, indent=''):
    return '\n'.join([indent + selector + ' {', *[indent + '  ' + key + ': ' + value + ';' for key, value in properties.items()], indent + '}'])

recipes = {
    '.wl-celebration-card': {'background': 'var(--theme-paper)', 'color': 'var(--theme-ink)', 'border-color': 'var(--theme-frame)', 'box-shadow': '0 22px 50px var(--theme-shadow), 0 3px 10px var(--theme-shadow-soft)', 'transition-property': 'background, color, border-color, transform', 'transition-duration': '350ms'},
    '.wl-card-toolbar': {'color': 'var(--theme-muted)', 'background': 'var(--theme-surface-1)', 'border-bottom-color': 'var(--theme-border-soft)', 'font-weight': '400'},
    '.wl-card-toolbar i': {'background': 'var(--theme-soft)', 'opacity': '.8', 'border-radius': '50%'},
    '.wl-card-toolbar svg': {'color': 'var(--theme-accent)', 'opacity': '.7', 'stroke-width': '1.5'},
    '.wl-card-content': {'background': 'var(--theme-paper)', 'color': 'var(--theme-ink)', 'isolation': 'isolate'},
    '.wl-card-kicker': {'color': 'var(--theme-muted)', 'font-weight': '700', 'text-transform': 'uppercase'},
    '.wl-card-content h2': {'color': 'var(--theme-ink)', 'text-shadow': '0 1px 0 var(--theme-highlight)', 'font-weight': '400'},
    '.wl-card-content h2 em': {'color': 'var(--theme-accent)', 'text-shadow': 'none', 'font-weight': '400'},
    '.wl-card-content p': {'color': 'var(--theme-muted)', 'text-wrap': 'pretty', 'overflow-wrap': 'anywhere'},
    '.wl-card-button': {'background': 'var(--theme-accent)', 'color': 'var(--theme-on-accent)', 'box-shadow': '0 4px 10px var(--theme-shadow-soft)', 'border': '1px solid var(--theme-accent)', 'font-weight': '600'},
    '.wl-card-button:hover': {'background': 'var(--theme-accent-strong)', 'border-color': 'var(--theme-accent-strong)', 'box-shadow': '0 6px 14px var(--theme-shadow)', 'color': 'var(--theme-on-accent)'},
    '.wl-card-button:focus-visible': {'outline-color': 'var(--theme-accent)', 'outline-width': '3px', 'outline-offset': '4px', 'outline-style': 'solid'},
    '.wl-card-button:active': {'transform': 'translateY(0)', 'box-shadow': '0 1px 4px var(--theme-shadow-soft)', 'transition-duration': '80ms'},
    '.wl-card-signature': {'color': 'var(--theme-muted)', 'font-style': 'italic', 'letter-spacing': '.3px'},
    '.wl-cake-top': {'background': 'var(--theme-soft)', 'border-color': 'var(--theme-accent-light)', 'box-shadow': 'inset 0 3px 5px var(--theme-highlight)'},
    '.wl-cake-body': {'background': 'var(--theme-accent-light)', 'border-bottom-color': 'var(--theme-accent)', 'box-shadow': 'inset -8px 0 12px var(--theme-shadow-soft)'},
    '.wl-cake-body i': {'background': 'var(--theme-soft)', 'box-shadow': '0 2px 2px var(--theme-shadow-soft)', 'opacity': '1'},
    '.wl-cake-base': {'background': 'var(--theme-muted)', 'opacity': '.45', 'box-shadow': '0 3px 5px var(--theme-shadow-soft)'},
    '.wl-candle': {'background': 'repeating-linear-gradient(45deg, var(--theme-accent) 0 4px, var(--theme-soft) 4px 8px)', 'border-radius': '1px', 'box-shadow': '1px 0 2px var(--theme-shadow-soft)'},
    '.wl-candle span': {'background': '#eab859', 'box-shadow': '0 0 14px #eab85955', 'transform-origin': 'bottom center'},
    '.wl-particle': {'background': 'var(--theme-accent)', 'box-shadow': '0 1px 1px var(--theme-shadow-soft)', 'opacity': '.45'},
    '.wl-particle:nth-child(3n)': {'background': 'var(--theme-soft)', 'opacity': '.9', 'border-radius': '50%'},
    '.wl-particle:nth-child(3n + 1)': {'background': 'var(--theme-accent)', 'opacity': '.45', 'border-radius': '1px'},
    '.wl-particle:nth-child(3n + 2)': {'background': 'var(--theme-muted)', 'opacity': '.3', 'border-radius': '0'},
    '.wl-floating-star': {'color': 'var(--theme-soft)', 'text-shadow': '0 2px 4px var(--theme-shadow-soft)', 'opacity': '.9'},
    '.wl-floating-flower': {'color': 'var(--theme-accent-light)', 'text-shadow': '0 2px 4px var(--theme-shadow-soft)', 'opacity': '.9'},
    '.wl-orbit': {'border-color': 'var(--theme-border)', 'border-style': 'dashed', 'background': 'transparent'},
    '.wl-memory-note': {'background': 'var(--theme-frame)', 'color': 'var(--theme-muted)', 'border-color': 'var(--theme-border)', 'box-shadow': '0 8px 18px var(--theme-shadow-soft)'},
    '.wl-memory-note svg': {'color': 'var(--theme-accent)', 'fill': 'var(--theme-accent)', 'opacity': '.8'},
    '.wl-polaroid': {'background': 'var(--theme-frame)', 'box-shadow': '0 9px 20px var(--theme-shadow)', 'color': 'var(--theme-ink)'},
    '.wl-polaroid p': {'color': 'var(--theme-muted)', 'text-wrap': 'balance', 'font-weight': '400'},
    '.wl-music': {'background': 'var(--theme-frame)', 'border-color': 'var(--theme-border)', 'box-shadow': '0 8px 22px var(--theme-shadow-soft)', 'color': 'var(--theme-ink)'},
    '.wl-music-icon': {'background': 'var(--theme-surface-2)', 'color': 'var(--theme-accent)', 'border': '1px solid var(--theme-border-soft)'},
    '.wl-music strong': {'color': 'var(--theme-ink)', 'font-weight': '600', 'text-wrap': 'balance'},
    '.wl-music div > span': {'color': 'var(--theme-muted)', 'font-weight': '400', 'letter-spacing': '0'},
    '.wl-music-bars i': {'background': 'var(--theme-accent-light)', 'transform-origin': 'center', 'opacity': '.9'},
    '.wl-theme-art': {'background': 'var(--theme-paper)', 'color': 'var(--theme-ink)', 'border-color': 'var(--theme-border)', 'box-shadow': 'inset 0 0 40px var(--theme-surface-1)'},
    '.wl-theme-art::before': {'border-color': 'var(--theme-border)', 'opacity': '.7', 'background': 'transparent'},
    '.wl-theme-art::after': {'color': 'var(--theme-accent)', 'opacity': '.35', 'font-family': 'Georgia, serif'},
    '.wl-theme-symbol': {'color': 'var(--theme-accent)', 'text-shadow': '0 3px 0 var(--theme-highlight)', 'transform-origin': 'center'},
    '.wl-theme-art-title': {'color': 'var(--theme-ink)', 'font-weight': '400', 'text-wrap': 'balance'},
    '.wl-theme-art-caption': {'color': 'var(--theme-muted)', 'font-weight': '400', 'text-wrap': 'balance'},
    '.wl-theme-occasion': {'color': 'var(--theme-muted)', 'font-weight': '600', 'text-transform': 'uppercase'},
    '.wl-theme-arrow': {'color': 'var(--theme-ink)', 'border-color': 'var(--theme-border)', 'background': 'var(--theme-surface-1)', 'transition': 'background 200ms, color 200ms, transform 200ms'},
    '.wl-theme-card:hover .wl-theme-arrow': {'background': 'var(--theme-accent)', 'border-color': 'var(--theme-accent)', 'color': 'var(--theme-on-accent)', 'transform': 'rotate(5deg)'},
}
lines = ['/* Generated by scripts/generate-landing-styles.py. Six complete preview palettes. */']
for theme, (paper, accent, ink, muted, border, soft, on_accent) in PALETTES.items():
    scope = f'.wl-landing [data-theme="{theme}"]'
    tokens = {
      '--theme-paper': paper, '--theme-accent': accent, '--theme-ink': ink,
      '--theme-muted': muted, '--theme-border': border, '--theme-soft': soft,
      '--theme-on-accent': on_accent, '--theme-frame': paper if theme == 'midnight' else '#fffdfa',
      '--theme-shadow': 'color-mix(in srgb, ' + ink + ' 16%, transparent)',
      '--theme-shadow-soft': 'color-mix(in srgb, ' + ink + ' 7%, transparent)',
      '--theme-highlight': 'color-mix(in srgb, ' + paper + ' 60%, white)',
      '--theme-accent-light': 'color-mix(in srgb, ' + accent + ' 55%, ' + soft + ')',
      '--theme-accent-strong': 'color-mix(in srgb, ' + accent + ' 88%, black)',
      '--theme-border-soft': 'color-mix(in srgb, ' + border + ' 55%, transparent)',
      '--theme-surface-1': 'color-mix(in srgb, ' + paper + ' 93%, ' + accent + ')',
      '--theme-surface-2': 'color-mix(in srgb, ' + paper + ' 85%, ' + soft + ')',
    }
    lines += ['', f'/* {theme.title()}: tokens, illustrated greeting, and gallery recipes. */', block(scope, tokens)]
    for selector, properties in recipes.items():
        # Include the root match for gallery cards, which carry data-theme themselves.
        target = scope + selector if selector.startswith('.wl-theme-card:') else scope + ' ' + selector
        lines += ['', block(target, properties)]
    for condition in ['(prefers-contrast: more)', '(forced-colors: active)']:
        lines += ['', '@media ' + condition + ' {']
        if condition.startswith('(prefers'):
            props = {'--theme-muted': ink, '--theme-border': muted, '--theme-border-soft': muted, '--theme-shadow': 'transparent', '--theme-shadow-soft': 'transparent'}
            lines += [block(scope, props, '  ')]
        else:
            for selector in ['.wl-card-button', '.wl-theme-arrow', '.wl-theme-art', '.wl-celebration-card']:
                lines += [block(scope + ' ' + selector, {'border': '1px solid ButtonText', 'box-shadow': 'none', 'forced-color-adjust': 'auto'}, '  ')]
        lines += ['}']
(ROOT / 'styles/landing-themes.css').write_text('\n'.join(lines) + '\n')

ornaments = ['/* Deterministic decorative particles; no runtime randomization or layout shift. */']
for i in range(1, 25):
    x = (i * 37) % 94 + 3
    y = (i * 23) % 90 + 2
    angle = (i * 47) % 360
    ornaments += ['', block(f'.wl-landing .wl-particle-{i}', {
      'left': f'{x}%', 'top': f'{y}%', 'width': f'{3 + i % 3}px',
      'height': f'{6 + i % 4}px', 'transform': f'rotate({angle}deg)',
      'transform-origin': 'center', 'animation-name': f'wl-confetti-drift-{i}',
      'animation-duration': f'{5 + i % 5}s', 'animation-delay': f'-{i % 7}s',
      'animation-timing-function': 'ease-in-out', 'animation-iteration-count': 'infinite',
      'animation-direction': 'alternate', 'pointer-events': 'none',
      'contain': 'layout style',
    })]
    ornaments += ['', f'@keyframes wl-confetti-drift-{i} {{', block('0%', {'transform': f'translateY(0) rotate({angle}deg)', 'opacity': '.25'}, '  '), block('50%', {'transform': f'translateY({3 + i % 5}px) rotate({angle + 12}deg)', 'opacity': '.5'}, '  '), block('100%', {'transform': f'translateY({7 + i % 8}px) rotate({angle - 8}deg)', 'opacity': '.3'}, '  '), '}']
    ornaments += ['', '@media (prefers-reduced-motion: reduce) {', block(f'.wl-landing .wl-particle-{i}', {'animation': 'none', 'transform': f'rotate({angle}deg)', 'opacity': '.35'}, '  '), '}']
(ROOT / 'styles/landing-ornaments.css').write_text('\n'.join(ornaments) + '\n')
