import urllib.request
import json
import urllib.error
import sys

boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
body = (
    '--' + boundary + '\r\n'
    'Content-Disposition: form-data; name="file"; filename="dummy.mp4"\r\n'
    'Content-Type: video/mp4\r\n\r\n'
    'dummy_data\r\n'
    '--' + boundary + '--\r\n'
).encode('utf-8')

req = urllib.request.Request('http://127.0.0.1:8000/process/', data=body, method='POST')
req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode('utf-8'))
    sys.exit(1)
except Exception as e:
    print('Error:', e)
    sys.exit(1)
