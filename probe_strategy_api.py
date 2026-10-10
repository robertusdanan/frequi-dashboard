import os, base64, json, urllib.request, re
user = os.environ.get('FREQTRADE__API_SERVER__USERNAME', 'freqtrade')
pw = os.environ.get('FREQTRADE__API_SERVER__PASSWORD', '')
auth = base64.b64encode(f'{user}:{pw}'.encode()).decode()
req = urllib.request.Request('http://127.0.0.1:8081/api/v1/strategy/NostalgiaForInfinityX8', headers={'Authorization': f'Basic {auth}'})
data = json.loads(urllib.request.urlopen(req, timeout=15).read())
print('KEYS:', list(data.keys()))
print('STRATEGY:', data.get('strategy'))
print('CODE_LEN:', len(data.get('code') or ''))
src = data.get('code') or ''
for pat, label in [
    (r'profit_threshold_\w+\s*=\s*[^\n]+', 'profit_threshold'),
    (r'grinding_mode_stakes_\w+\s*=\s*[^\n]+', 'grinding_stakes'),
    (r'derisk_mode_stakes_\w+\s*=\s*[^\n]+', 'derisk_stakes'),
    (r'stop_threshold_\w+\s*=\s*[^\n]+', 'stop_thr'),
]:
    print('---', label)
    matches = list(re.finditer(pat, src))[:5]
    for m in matches:
        print(m.group(0)[:120])
print('---buy_params keys---')
m = re.search(r'_buy_params\s*=\s*\{(.+?)\n\s*\}', src, re.DOTALL)
if m:
    keys = re.findall(r'"([\w_]+)"', m.group(1))[:30]
    print(keys)
print('---sell_params keys---')
m = re.search(r'_sell_params\s*=\s*\{(.+?)\n\s*\}', src, re.DOTALL)
if m:
    keys = re.findall(r'"([\w_]+)"', m.group(1))[:30]
    print(keys)