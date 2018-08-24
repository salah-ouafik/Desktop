var IOTA_HOST = 'https://iotanode.us';
var IOTA_PORT = 443;
var IOTA_ADDRESS1;
//account 2
var IOTA_SEED2 = "QWERTYUIOP999999999999999999999999999999ASDFGHJKL99999999999999999999999999999999";
var IOTA_ADDRESS2;
var prevReading = " ";
var i = 0;

// Instantiate IOTA
var iotajs = new IOTA({
    'host': IOTA_HOST,
    'port': IOTA_PORT
});

console.log("version of iota : " + iotajs.version);

var accountInfo;
console.log("date is " + new Date());

$(document).ready(function () {

    console.log("welcome to datafile.js");
    var $mytable = $('#mytable');
    console.log('$' + $mytable);
    console.log('$' + JSON.stringify($mytable));

    getMessages(IOTA_SEED2, 0, 10);

    if (localStorage.getItem("mytable")) {
        $mytable.html(localStorage.getItem("mytable"));
    }

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
        console.log(new Date());
        var msg = tx.signatureMessageFragment;
        msg = msg.replace("9", "   ");
        msg = msg.split(" ")[0];
        tx.signatureMessageFragment = msg;
        //to correct timestamp
        var part = (tx.attachmentTimestamp).toString();
        part = part.substr(10, 13);
        var entryTimestamp = ((tx.timestamp).toString()).concat(part);  //string
        entryTimestamp = parseInt(entryTimestamp);
        console.log(entryTimestamp);
        tx.timeGap = (tx.attachmentTimestamp - entryTimestamp) / 1000 + " Seconds";
       
        $mytable.append('<tr><td>' + "RPI_1 to RPI_2" + '</td><td>' + tx.hash + '</td><td>' + tx.signatureMessageFragment + '</td><td>' + "SUCCESS" + '</td><td>' + tx.timestamp + '</td><td>' + tx.attachmentTimestamp + '</td><td>' + tx.timeGap + '</td></tr>');

        localStorage.setItem("mytable", $mytable.html());

    };

});
