main:
	babel-node build.js clean
	babel-node build.js build
server:
	python -m SimpleHTTPServer 8000
