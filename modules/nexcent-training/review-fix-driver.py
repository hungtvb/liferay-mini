from pathlib import Path
import textwrap

workflow_path = Path('.github/workflows/apply-pr28-review-fixes.yml')
source = workflow_path.read_text()
start_marker = "          python3 <<'PY'\n"
end_marker = "\n          PY\n\n      - name: Generate admin package lock"

start = source.index(start_marker) + len(start_marker)
end = source.index(end_marker, start)
script = textwrap.dedent(source[start:end])

exec(compile(script, str(workflow_path), 'exec'))
