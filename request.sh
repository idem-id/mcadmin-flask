#!/bin/bash

printf "POST /api HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: ${#1}\r\n\r\n$1" | nc localhost 5000
