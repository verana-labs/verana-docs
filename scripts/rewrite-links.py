#!/usr/bin/env python3
"""Rewrite relative markdown links after a tree move, using the staged git renames."""
import os, re, subprocess
root = os.getcwd()
out = subprocess.check_output(['git', 'diff', '--cached', '--name-status', '-M'], text=True)
renames = {}
for line in out.splitlines():
    parts = line.split('\t')
    if parts[0].startswith('R') and len(parts) == 3:
        renames[parts[1]] = parts[2]
def slug(path):
    segs = (path[:-3] if path.endswith('.md') else path).split('/')
    return '/'.join(re.sub(r'^\d+-', '', s) for s in segs)
old_by_slug = {slug(o): o for o in renames}
link_re = re.compile(r'(\]\()([^)\s]+)(\))')
unresolved, changed = [], 0
for old, new in renames.items():
    if not new.endswith('.md'):
        continue
    text = open(new, encoding='utf-8').read()
    def fix(m):
        target = m.group(2)
        if re.match(r'^(https?:|mailto:|#|/)', target):
            return m.group(0)
        base, _, anchor = target.partition('#')
        if not base or '.' in os.path.basename(base) and not base.endswith('.md'):
            return m.group(0)  # images and other assets
        old_abs = os.path.normpath(os.path.join(os.path.dirname(old), base))
        cand = renames.get(old_abs)
        if cand is None:
            s = slug(old_abs)
            if s in old_by_slug:
                cand = renames[old_by_slug[s]]
        if cand is None:
            if os.path.exists(os.path.join(root, os.path.dirname(new), base)):
                return m.group(0)
            unresolved.append((new, target))
            return m.group(0)
        rel = os.path.relpath(cand, os.path.dirname(new))
        if not rel.startswith('.'):
            rel = './' + rel
        return f'{m.group(1)}{rel}{"#" + anchor if anchor else ""}{m.group(3)}'
    new_text = link_re.sub(fix, text)
    if new_text != text:
        changed += 1
        open(new, 'w', encoding='utf-8').write(new_text)
for f, t in unresolved:
    print(f'UNRESOLVED {f}: {t}')
print(f'{len(renames)} renames, {changed} files rewritten, {len(unresolved)} unresolved links')
