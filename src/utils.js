const debug = require('debug')('sqo:utils');

export default function checkArgs(entity, func, argsKeysList) {
	return function(req, res, next) {
		debug('function %s called', func.name);

		if(!argsExists(req.params, argsKeysList)) {
			res.send(400); // 400: Bad Request
			next();
		} else {
			let argsLists = argsKeysList.map(key => req.params[key]);

			let send = function(head, body) {
				if(arguments.length == 1) {
					res.send(head);
				} else {
					res.writeHead(head);
					res.write(body);
					res.end();
				}
				next();
			}

			func.call(entity, send, ...argsLists, req.files);
		}
	}
}

function argsExists(array, argsKeysList) {
	let i = 0;
	let length = argsKeysList.length;
	let key;

	let exist = true;

	while (exist && i < length) {
		key = argsKeysList[i];
		exist = array[key] !== undefined && array[key] !== null;
		i++;
	}

	return exist;
}

function safeCB() {}

export function safe(func) {
	return typeof func == 'function' ? func : safeCB;
}

function random(min, max) {
	return Math.floor(Math.random() * (1 + max - min)) + min;  
}

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export function genHash() {
	let hash = '';
	let length = random(3, 7);
	let charsLength = chars.length - 1;

	for(let i = 0; i < length; i++)
		hash += chars.charAt(random(0, charsLength));

	return hash;
}