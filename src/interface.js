function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}


export const interfaces = {
    home: '/',
    list: '/drug/list',
    listAdmin: '/drug/listAdmin',
    updateDrug: '/drug/put',
    addDrug: '/drug/add',
    del: '/drug/del',
    fdaList: '/drug/fda',
    spider: '/spider/getInfo',
    diseaseList: '/disease/list',
    diseaseUpdate: '/disease/put',
    diseaseAdd: '/disease/add',
    diseaseDel: '/disease/del',
    adminList: '/admin/list',
    adminadd: '/admin/add',
    admindel: '/admin/del',
    adminupdate: '/admin/update',
    adminLogin: '/admin/login',
    adminCheck: '/admin/checkUserStatus',
    adminloginOut: '/admin/loginOut',

    drugContent: '/drug/drugCount',
    getHotDrug: '/drug/getHotDrug',
}

const getParmas = (url, data) => {
    let sendUrl = url;
    let i = 0;
    for (let it in data){
        if(i === 0){
            sendUrl+='?'+it+'='+data[it];
        }else {
            sendUrl+='&'+it+'='+data[it];
        }
        i++;
    }
    return sendUrl;
}

export function request(url, options) {
    if(options.params !== undefined) {
        url = getParmas(url, options.params)
    }
    options.credentials = 'include'; //携带cookie
    const arrStr = getCookie('csrfToken');
    options.headers = {'Content-type': 'application/json;charset=UTF-8', 'x-csrf-token': arrStr};
    options.body = JSON.stringify(options.body);
    url = '/drugSystem' + url;
    return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => ({ data }))
        .catch(err =>{
            return {data:{success: false, code: 500}};
        });
}
function getCookie(objName){//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] === objName){
            return decodeURI(temp[1]);
        }
    }
}
