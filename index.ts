import * as http from 'http';
import {Grid} from "./components/Grid";
const fs = require('fs');
// const url = require('url');

const VER = 'v0.1.0';
const PORT = process.env.PORT && Number(process.env.PORT) || 8080;

console.log(VER);

// ToDo TYPESCRIPT!!!!!!

// mapGenerator.print(mapGenerator.generate(16));

http.createServer(function (req, res) {
	const start = new Date().getTime();
	// console.log(req);
	console.log(`${new Date} --- index --->>>>>  got request: ${req.headers.host}${req.url}`);

	switch (true) {
		case /\/generate/.test(req.url): {
			generate(req, res);
			break
		}
		case /\/visualizer?.*/.test(req.url): {
			visualize(req, res);
			break
		}
		default: {
			res.writeHead(404);
			res.end('Dunno what are you talkin \'bout');
		}
	}
	console.log(`Sending code ${res.statusCode}. Took ${new Date().getTime() - start}ms to process`);
}).listen(PORT);

console.log(`Listening @ ${PORT}`);

function generate(req, res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	console.log('index --->>>>>  generating');
    const grid = new Grid(32, 32);
    grid.generate();
    grid.print(true);
	console.log('index --->>>>>  writing');
	res.write(JSON.stringify(grid.pack()));
	res.end();

}

function visualize(req, res) {
    let filename = '';
    if (req.url === '/visualizer') {
        filename = __dirname + '/visualizer/index.html'
    } else {
        filename = __dirname + req.url;
    }
    console.log(`visualizer --->>>>>  reading ${filename}`);
    fs.readFile(filename, function (err,data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });

}