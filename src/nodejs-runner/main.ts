import {PssimisticalNodeJSRunner} from './PssimisticalNodeJSRunner'

console.log("Starting up...");
let argparse = require('argparse');
let fs = require('fs');
let readline = require('readline');

new PssimisticalNodeJSRunner(argparse, fs, readline).run();

// (function wait () {
//    setTimeout(wait, 1000);
// })();