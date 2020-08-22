import * as axios from 'axios';

/** 时间格式化  **/
 export function format_date(time) {
    var date=new Date(time);
    var year=date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
    var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
    var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
    var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
    var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
    // 拼接
    return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
}


 /** 封装 post 请求,参数为 json **/
export function post(url,data){
    axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization':localStorage.getItem('Authorization')
        },
        method:'post',
        url:url,
        data:data
    }).then(function(res){
        if(200===res.data.code){
           return res.data;
        }
    });
}
/** 封装 get 请求 **/
export function get(url){
    return new Promise((resolve, reject) => {
        axios({
            headers: {
                'Authorization': localStorage.getItem('Authorization')
            },
            method: 'get',
            url: url,
        }).then(function (res) {
            if (200 === res.data.code) {
                resolve(res.data)
            } else {
                resolve(res.data)
            }
        }).catch(err => {
            reject(err.data)
        })
    })
}


/** 封装 get 请求 **/
export function sendPost(url,data){
    return new Promise((resolve, reject) => {
        axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization':localStorage.getItem('Authorization')
            },
            method:'post',
            url:url,
            data:data
        }).then(function (res) {
            if (200 === res.data.code) {
                resolve(res.data)
            } else {
                resolve(res.data)
            }
        }).catch(err => {
            reject(err.data)
        })
    })
}

// export const fetchData = query => {
//     return request({
//         url: './table.json',
//         method: 'get',
//         params: query
//     });
// };



