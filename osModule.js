const os = require('os');
const localAddress = {
    publicIp: "",
    runningIp: "",
    setAddress: function () {
        // console.log("os.networkInterfaces() : ", os.networkInterfaces())
        // if (this.runningIp == "") {
        //     let netList = os.networkInterfaces().Ethernet;
        //     for (let i = 0; i < netList?.length; i++) {
        //         if (netList[i].family == 'IPv4') {
        //             this.runningIp = netList[i].address;
        //             break;
        //         }
        //     }
        //     return this.runningIp;
        // } else {
        //     return this.runningIp;
        // }
        if (this.runningIp == "") {
            const data = os.networkInterfaces();
            for (const interfaceKey in data) {
                if (data.hasOwnProperty(interfaceKey)) {
                    const interfaceData = data[interfaceKey];
                    interfaceData.forEach(entry => {
                        if (entry.family === 'IPv4' && entry.mac !== '00:00:00:00:00:00') {
                            this.runningIp = entry.address;
                        }
                    });
                }
            }
            return this.runningIp;
        } else {
            return this.runningIp;
        }
    }
}
// console.log("Running first : ", localAddress.setAddress());
module.exports = localAddress;