import * as named from 'node-named';
import * as base32 from 'hi-base32';

const ttl = 1;
const addr = '::ffff:127.0.0.1';
const port = 9999; // 53

const server = named.createServer();

let message: string[] = [];

server.on('error', e => {
    console.log(e);
});

server.on('query', query => {

    const name = query.name();

    const line = name.replace(/[.]/g, '');
    message.push(line);

    // console.log(message);

    query.addAnswer(name, new named.SOARecord(name, { serial: 12345 }), ttl);

    if (line[line.length-1] === '=') {

        try {

            const decoded = base32.decode(message.join(''));
            console.log(decoded);
            query.addAnswer(name, new named.TXTRecord('OK'), ttl);
            message = [];

        } catch (e) {

            console.log(e);
            query.addAnswer(name, new named.TXTRecord('Error'), ttl);
            message = [];

        }

    } else {

        query.addAnswer(name, new named.TXTRecord('OK'), ttl);

    }

    // query.addAnswer(name, new named.TXTRecord('OK'), ttl);
    server.send(query);

});

server.on('clientError', e => {
    console.log(e);
});

server.on('uncaughtException', e => {
    console.log(e);
});

server.listen(port, addr, () => {
    console.log(`Server started on port ${port}`);
});
