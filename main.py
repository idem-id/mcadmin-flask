import config
import socket
import os, os.path
import json
from flask import Flask, request, g

app = Flask(__name__)

def response(code, message):
    return message, code, {'Content-Type': 'application/json'}

def response_error(code, message):
    return response(code, json.dumps({'status':'error', 'error':message}))

@app.route('/api', methods=['POST'])
def api_method():
    req = request.get_json()
    if not req: return response_error(400, "bad json")
    cli = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    try:
        cli.connect(config.daemon_socket)
    except FileNotFoundError:
        return response_error(500, "wrong socket path or backend offline")
    cli.send(json.dumps(req).encode())
    buff = b''
    while True:
        data = cli.recv(4096)
        buff += data
        if not data or len(data) == 0: break
    if len(buff) == 0:
        return response_error(500, "empty response from daemon socket")
    res = json.loads(buff.decode())
    if res['status'] != 'ok':
        return response_error(400, res['error'])
    else:
        return response(200, json.dumps(res))
