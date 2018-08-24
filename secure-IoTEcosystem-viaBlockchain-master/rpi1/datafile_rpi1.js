console.log("welcome to rpi_1");
var IOTA = require('iota.lib.js');

var IOTA_HOST = 'https://iotanode.us';

var IOTA_PORT = 443;
var IOTA_SEED1 = "QWERTYUIOP999999999999999999999999999999ASDFGHJKL9999999999999999999999ZXCVBNM999";
//account 2
var IOTA_SEED2 = "QWERTYUIOP999999999999999999999999999999ASDFGHJKL99999999999999999999999999999999";
var IOTA_TAG = 'iota-mqtt-poc';
var options1 = {
    index: 0,
    total: 1,
    security: 2,
    checksum: false
};
var mymessage = " ";
var generatedAddress;
var mqtt_msg = "ID : RPI_1 , TMP : 27.33";

// Instantiate IOTA
var iotajs = new IOTA({
    'host': IOTA_HOST,
    'port': IOTA_PORT
});

//  Generate address function
mymessage = iotajs.utils.toTrytes(mqtt_msg);

setInterval(function () {
    iotajs.api.getNewAddress(IOTA_SEED2, options1, function (error, address) { //since we want to generate an address for seed 2
        mqtt_msg += options1.index
        mymessage = iotajs.utils.toTrytes(mqtt_msg);
        generatedAddress = address;

        var transfers = [{
            'address': generatedAddress[0],    //address of the recipient-total generates an array
            'value': 0,     //used to transfer iota tokens
            'message': mymessage, //mqtt msg converted to trytes
            'tag': iotajs.utils.toTrytes(IOTA_TAG)
        }];

        var seed = IOTA_SEED1;
        var depth = 9;
        var minWeightMagnitude = 14; //mainnet=14; testnet=9

        iotajs.api.sendTransfer(seed, depth, minWeightMagnitude, transfers, function (error, success) {
            if (!error) {
                // Only one transfer so we can get the new TX hash by accessing .hash on first element of success.
                var msg = success[0].signatureMessageFragment;
                msg = msg.replace("9", "   ");
                msg = msg.split(" ")[0];
                success[0].signatureMessageFragment = msg;
                console.log("Transaction with index : " + options1.index);
                console.log(JSON.stringify(success, null, 2)+"\n");
            }
            else {
                console.log("Failed to make transfer with error: " + error);
            }
        });
        options1.index++;	//creating a new address by incrementing the 

    });
}, 60000);