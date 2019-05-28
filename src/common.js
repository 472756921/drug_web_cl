export const status = {
    0: '禁用',
    1: '正常'
}
export const role = {
    0: 'root',
    1: 'admin'
}
export const classType = {
    1:'肺癌',
    2:'多发性骨髓瘤',
    3:'骨肿瘤',
    4:'急性淋巴细胞白血病',
    5:'慢性粒细胞白血病',
    6:'T细胞淋巴瘤',
    7:'霍奇金淋巴瘤',
    8:'B细胞淋巴瘤',
    9:'肾癌',
    10:'软组织肉瘤',
    11:'前列腺癌',
    12:"卵巢癌",
    13:'前列腺癌',
    14:'卵巢癌',
    15:'头颈部肿瘤'
}
export const randomString = (len) => {
    len = len || 32;
    const $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
export const filterRule = (value) => {
    const filterRule= /[^0-9a-zA-Z_\u4e00-\u9fa5\u3001]/g;
    if(typeof value === 'string') {
        return value.replace(filterRule, '');
    } else {
        return '';
    }
}