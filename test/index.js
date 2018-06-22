const net = require('net');

const a =net.isIP('127.0.0.2');
const b = net.isIPv4('127.0.0.2');
const c = net.isIPv6('127.0.0.2');

console.log(a,b,c);
