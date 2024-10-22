const os = require('os');
const localAddress = {
    publicIp: "",
    runningIp: "",
    setAddress: function () {
        if (this.runningIp == "") {
            // console.log("Thsi is Network interface :", os.networkInterfaces()["Ethernet 2"]);
            let netList = os.networkInterfaces()["Ethernet 2"];
            for (let i = 0; i < netList?.length; i++) {
                if (netList[i].family == 'IPv4') {
                    this.runningIp = netList[i].address;
                    break;
                }
            }
            return this.runningIp;
        } else {
            return this.runningIp;
        }
    }
}
console.log(localAddress.setAddress());
module.exports = localAddress;