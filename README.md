### overview

simple alternative to McMyAdmin. uses mcadmin-daemon as backend to communicate with java process.

### example installation

* start mcadmin-daemon
* copy `config.py.example` to `config.py` and point `daemon_socket` to mcadmin-daemon's socket file
* copy `nginx.conf.example` to `nginx.conf` and point `root` to your repository
* add `include /path/to/your/repo/nginx.conf;` to `http` section of `/etc/nginx/nginx.conf`
* reload nginx's configuration via `sudo nginx -s reload`
* run `export FLASK_APP=main.py` and then `flask run` from your repository's location
* open http://localhost
* enjoy
