
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

/**  添加角色   **/
export let addUpmRole = url+'admin/upmRole/addUpmRole';

/**  删除角色   **/
export let batchDelRole = url+'admin/upmRole/batchDelRole';

/**  资源列表   **/
export let serachResourceList = url+'admin/upmResource/serachResourceList';

/**  更新资源   **/
export let updateUmsResource = url+'admin/upmResource/updateUmsResource';

/**  添加资源   **/
export let addUmsResource = url+'admin/upmResource/addUmsResource';
