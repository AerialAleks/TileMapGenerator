import * as http from 'http';
import {Grid} from "./components/Grid";
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

	switch (req.url) {
		case "/generate": {
			generate(req, res);
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
    const grid = Grid.generate(16, 16);
    grid.print(true);
	console.log('index --->>>>>  writing');
	res.write(JSON.stringify(grid.pack()));
	res.end();

}