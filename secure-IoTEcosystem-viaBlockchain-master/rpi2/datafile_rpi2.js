var IOTA = require('iota.lib.js');
console.log("welcome to datafile_rpi2 at time "+new Date());

var IOTA_HOST = 'https://iotanode.us';
var IOTA_PORT = 443;
/*var IOTA_HOST = 'http://p103.iotaledger.net';
var IOTA_PORT = 14700;*/
//account 2
var IOTA_SEED2 = "QWERTYUIOP999999999999999999999999999999ASDFGHJKL99999999999999999999999999999999";
var prev_address_index = 0;
var curr_address_index = 0;
var mqtt_msg = " ";
var accountInfo;
var prevReading = " ";

// Instantiate IOTA
var iotajs = new IOTA({
    'host': IOTA_HOST,
    'port': IOTA_PORT
});

getMessages(IOTA_SEED2, 0, 10);

//get the messages 
function getMessages(seed, offset, step) {
    const addresses = [];
    for (let i = 0; i < step; i++) {
        addresses.push(iotajs.api._newAddress(seed, i + offset, 2, false));
        //`seed`, `index`, `security` of level 2, and `checksum` which helps verify that the address is correct. 
    }

    iotajs.api.findTransactionObjects({ addresses }, (err, txs) => {
        if (err || !txs.length) {
            console.log("err: " + err);
            return;
        }
        txs = txs.filter(tx => tx.value === 0).sort((a, b) => b.timestamp - a.timestamp);
        if (new Date().getDate() == new Date(txs[0].attachmentTimestamp).getDate()) {
            if (prevReading < txs[0].attachmentTimestamp) {
                printMessages(txs[0]);
                //console.log((txs[0].attachmentTimestamp) + " : " + prevReading);
                prevReading = txs[0].attachmentTimestamp;
            }
            else {
                console.log("No new transactions !!");

            }
            //keep more than 15 seconds
            setTimeout(() =>  getMessages(seed, offset, step), 30000);
        }
    });
};

function printMessages(tx) {
    var msg = tx.signatureMessageFragment;
    msg = msg.replace("9", "   ");
    msg = msg.split(" ")[0];
    tx.signatureMessageFragment = msg;
    //to correct timestamp
    var part = (tx.attachmentTimestamp).toString();
    part = part.substr(10, 13);
    var entryTimestamp = ((tx.timestamp).toString()).concat(part);  //string
    entryTimestamp = parseInt(entryTimestamp);
    tx.timeGap = (tx.attachmentTimestamp - entryTimestamp) / 1000 + " Seconds";
    console.log(JSON.stringify(tx, null, 2));
};
