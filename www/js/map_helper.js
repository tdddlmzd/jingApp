/**
* 丰富靠港计划中历史靠港时间
* @param {Array} portsPlan
* @param {Array} portRecord
*/
function getHistoryPortRecord(portsPlan, portRecord) {
    for (let i = 0; i < portsPlan.length - 1; i++) {
        let port = portsPlan[i]
        let nextPort = portsPlan[i + 1]
        // 如果两个港口之间时间不能闭合，则从历史记录中获取两个港口靠港记录时间
        if (isEmpty(port.lastEtd) || isEmpty(nextPort.lastEta)) {
            let historyPorts = []
            for (let j = portRecord.length - 2; j > 0; j--) {
                let record = portRecord[j + 1]
                let prevRecord = portRecord[j]
                if (historyPorts.length === 0) {
                    // 比较港口编码，但目前获得的记录中编码为空
                    if (this.comparePort(record, nextPort)) {
                        historyPorts[0] = prevRecord
                    }
                }
                if (historyPorts.length === 1) {
                    if (this.comparePort(record, nextPort)) {
                        historyPorts[1] = record
                    }
                }
                if (historyPorts.length === 2) {
                    port.lastEtd = historyPorts[0].atd !== '' ? historyPorts[0].atd : historyPorts[0].ata
                    nextPort.lastEta = historyPorts[1].ata !== '' ? historyPorts[1].ata : historyPorts[1].atd
                    break
                }
            }
        }
    }
    return portsPlan;
}

/**
* 根据港口记录查询历史轨迹
*/
function getShipPathByPortRecord(shipId, portRecord) {
    console.log(shipId, portRecord, "shipId, portRecord")
    const vm = this
    const promise = []
    for (let i = 0; i < portRecord.length - 1; i++) {
        const port = portRecord[i]
        const nextPort = portRecord[i + 1]
        const begin = !Utils.isEmpty(port.lastEtd)
            ? port.lastEtd
            : !Utils.isEmpty(port.lastEta)
                ? port.lastEta
                : null
        const end = !Utils.isEmpty(nextPort.lastEta)
            ? nextPort.lastEta
            : !Utils.isEmpty(nextPort.lastEtd)
                ? nextPort.lastEtd
                : null
        if (begin != null && end != null) {
            promise.push(api.getShipVesselTrack(shipId, begin, end))
        } else {
            // 如果时间不全，则取港口的坐标
            if ((!Utils.isEmpty(port.lat) && !Utils.isEmpty(port.lon)) ||
                (i === portRecord.length - 2 &&
                    !Utils.isEmpty(nextPort.lat) && !Utils.isEmpty(nextPort.lon))) {
                promise.push(new Promise(resolve => {
                    let result = [
                        {
                            lat: port.lat,
                            lon: port.lon,
                            date: null,
                            utc: null
                        }
                    ]
                    if (i === portRecord.length - 2 &&
                        !Utils.isEmpty(nextPort.lat) && !Utils.isEmpty(nextPort.lon)) {
                        result.push({
                            lat: nextPort.lat,
                            lon: nextPort.lon,
                            date: null,
                            utc: null
                        })
                    }
                    resolve(result)
                }))
            }
        }
    }
    console.log(promise, "promise")
    if (promise.length > 0) {
        Utils.promiseAllSettled(promise).then(res => {
            console.log(res, "路径信息")
            if (res.length > 0) {
                const shipPath = []
                res.forEach(item => {
                    if (item.status === 'fulfilled') {
                        shipPath.push(...item.value)
                        // item.value.forEach(point => {
                        //   shipPath.push({
                        //     ...point,
                        //     lat: vm.formatCoordinate(point.lat),
                        //     lon: vm.formatCoordinate(point.lon)
                        //   })
                        // })
                    } else {
                        console.error(item.reason)
                    }
                })
                if (shipPath.length > 0) {
                    console.log(shipPath, "shipPath")
                    console.log(vm, "vm")
                    for (var shipId in vm.shipsInfo) {
                        vm.$set(vm.shipsInfo[shipId], 'historyPoints', shipPath)
                    }
                    // vm.$set(vm.shipsInfo[shipId], 'historyPoints', shipPath)
                }
            }
        })
    }
};