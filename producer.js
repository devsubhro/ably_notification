/*****
 * The producer. This push update messages to channel
 */
const [ , , ...args ] = process.argv;
const fedback_channel_name = args[0];
const producer_name = args[1];

const config = require('./config.js');
const Ably = require("ably");
const realtime = new Ably.Realtime({ key: config.api_key });

const channel = realtime.channels.get(fedback_channel_name);

const send_max = 20;
let num_sent = 0;

function test() {
    ++num_sent;
    if(num_sent > send_max) {
        process.exit();
    }

    channel.publish("update", {
        sender: producer_name,
        msg: `This is ${producer_name} sending ${num_sent}`
    });
}

setInterval(test, 3000);