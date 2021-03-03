/**
 * 将整型坐标数据转为小数值，保留6位小数
 * @param num
 */
function formatCoordinate(num) {
    if (num != null) {
        let numStr = num.toString()
        return parseFloat(numStr.substr(0, numStr.length - 6) + '.' + numStr.substr(numStr.length - 6))
    }
    return null
}

/**
 * 转换坐标，处理坐标负值，
 * @param latlngs
 * @param option 配置lat,lng别名
 */
function transferLatlngs(latlngs, option) {
    let lngAlias = option == null || option['lng'] == null ? 1 : option['lng']
    if (latlngs != null && latlngs.length > 0) {
        if (latlngs[0][lngAlias] < 0) {
            latlngs[0][lngAlias] = latlngs[0][lngAlias] < 0 ? 360 + latlngs[0][lngAlias] : latlngs[0][lngAlias] - 360
        }
        for (let i = 1; i < latlngs.length; i++) {
            let curr = latlngs[i]
            let prev = latlngs[i - 1]
            let lng = prev[lngAlias] - curr[lngAlias]
            if (lng > 180 || lng < -180) {
                latlngs[i][lngAlias] = latlngs[i][lngAlias] < 0 ? 360 + curr[lngAlias] : curr[lngAlias] - 360
            }
        }
    }
    return latlngs
}
/**
 * 校验字符串是否为空
 * @param val
 * @returns {boolean|boolean}
 */
function isEmpty(val) {
    return val == null || val.length === 0
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
            // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        return value.toString().padStart(2, '0')
    })
    return timeStr
}
/**
 * 计算两个坐标点的角度
 * @param {Array} latlng1
 * @param {Array} latlng2
 */
function calcCoordinateAngle(latlng1, latlng2) {
    let x = latlng2[0] - latlng1[0]
    let y = latlng2[1] - latlng1[1]
    let hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        // 斜边长度
    let cos = x / hypotenuse
    let radian = Math.acos(cos)
        // 求出弧度
    let angle = 180 / (Math.PI / radian)
        // 用弧度算出角度
    if (y < 0) {
        angle = -angle
    } else if ((y === 0) && (x < 0)) {
        angle = 180
    }
    return angle + 90
}
/**
 * 深度克隆对象
 * @param obj
 * @returns {any}
 */
function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}