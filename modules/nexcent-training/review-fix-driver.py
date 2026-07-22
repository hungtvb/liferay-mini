from pathlib import Path

workflow_path = Path('.github/workflows/apply-pr28-review-fixes.yml')
source = workflow_path.read_text()
start_marker = "          python3 <<'PY'\n"
end_marker = "\n          PY\n\n      - name: Generate admin package lock"

start = source.index(start_marker) + len(start_marker)
end = source.index(end_marker, start)
lines = []

for line in source[start:end].splitlines():
    if line and not line.startswith('          '):
        raise SystemExit(f'Unexpected YAML indentation: {line[:80]}')

    lines.append(line[10:] if line else '')

script = '\n'.join(lines) + '\n'
exec(compile(script, str(workflow_path), 'exec'))
