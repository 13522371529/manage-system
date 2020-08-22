
//let url = 'https://www.pengjiayuan.top/';

//let url = 'http://192.168.31.101:7841/';

let url = 'http://localhost:7841/';

/** 登陆接口 **/
export let login    = url+'admin/upmAdmin/login';

/** 上次登陆时间、地点、角色名称、用户名 **/
export let getUmsInfo = url+'admin/upmAdmin/getUmsLogInfo';

/**  搜索管理员列表   **/
export let serachList = url+'admin/upmAdmin/serachList';

/**  更新管理员状态   **/
export let updateUpmAdminStatus = url+'admin/upmAdmin/updateUpmAdminStatus';

/**  角色列表   **/
export let serachRoleList = url+'admin/upmRole/serachRoleList';

/**  更新更新角色状态   **/
export let updateUpmRoleStatus = url+'admin/upmRole/updateUpmRoleStatus';