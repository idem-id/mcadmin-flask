var log_time = 0;
var log_waiting = false;

function log(text, level) {
    var log_elems = document.getElementById("log");
    var lines = text.match(/[^\r\n]+/g);
    for (var i = 0; i != lines.length; ++i) {
        var line = lines[i];
        var elem = document.createElement('span');
        if (!level) {
            var m = line.match(/\[\d\d:\d\d:\d\d (.*?)\].*/);
            if (m.length > 1) level = m[1];
        }
        elem.className = level;
        elem.innerHTML = line;
        log_elems.appendChild(elem);
        log_elems.appendChild(document.createElement('br'));
    }
    var cont = document.getElementById("content");
    cont.scrollTop = cont.scrollHeight;
}

function get_log() {
    if (log_waiting) return;
    log_waiting = true;
    makeRequest({method: "get_log", time: log_time}, function(data) {
        log_waiting = false;
        for (var i = 0; i != data.log.length; ++i) {
            var ent = data.log[i];
            if (ent.time > log_time) {
                log_time = ent.time;
                log(ent.message);
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("start").onclick = function(e) {
        e.preventDefault();
        makeRequest({method: "daemon_command", command: "start"}, function(){});
    }

    document.getElementById("stop").onclick = function(e) {
        e.preventDefault();
        makeRequest({method: "process_command", command: "stop"}, function(){});
    }

    document.getElementById("restart").onclick = function(e) {
        e.preventDefault();
        makeRequest({method: "daemon_command", command: "restart"}, function(){});
    }

    document.getElementById("console").onkeypress = function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            var con = document.getElementById("console");
            makeRequest({method: "process_command", command: con.value}, function(){});
            con.value = '';
        }
    }

    window.setInterval(get_log, 500);
});

function makeRequest(data, success_cb, async) {
    async = async || true;
    var xmlhttp = getXMLHttp();
    xmlhttp.open('POST', '/api', async);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            var res = JSON.parse(xmlhttp.responseText);
            if (xmlhttp.status != 200) {
                console.log(res.error);
                log(res.error, 'ERROR')
            } else {
                success_cb(res);
            }
        }
    }
    xmlhttp.setRequestHeader('Content-Type', 'application/json')
    xmlhttp.send(JSON.stringify(data));
}

function getXMLHttp(){
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}
