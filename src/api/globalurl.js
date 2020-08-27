class api{
    constructor() {

        //var url = 'https://www.pengjiayuan.top/';
        var url = 'http://localhost:7841/';

        /** 登陆接口 **/
        this.login  = url+'admin/upmAdmin/login';

        /** 上次登陆时间、地点、角色名称、用户名 **/
        this.getUmsInfo = url+'admin/upmAdmin/getUmsLogInfo';

        /**  搜索管理员列表   **/
        this.serachList = url+'admin/upmAdmin/serachList';

        /**  更新管理员状态   **/
        this.updateUpmAdminStatus = url+'admin/upmAdmin/updateUpmAdminStatus';

        /**  重置密码   **/
        this.resetPassword = url+'admin/upmAdmin/resetPassword';

        /**  角色列表   **/
        this.serachRoleList = url+'admin/upmRole/serachRoleList';

        /**  更新更新角色状态   **/
        this.updateUpmRoleStatus = url+'admin/upmRole/updateUpmRoleStatus';

        /**  添加角色   **/
        this.addUpmRole = url+'admin/upmRole/addUpmRole';

        /**  添加角色资源   **/
        this.addUmsRoleResource = url+'admin/upmResource/addUmsRoleResource';

        /**  删除角色   **/
        this.batchDelRole = url+'admin/upmRole/batchDelRole';

        /**  资源列表   **/
        this.serachResourceList = url+'admin/upmResource/serachResourceList';

        /**  更新资源   **/
        this.updateUmsResource = url+'admin/upmResource/updateUmsResource';

        /**  添加资源   **/
        this.addUmsResource = url+'admin/upmResource/addUmsResource';

        /**  删除资源   **/
        this.batchDelResource = url+'admin/upmResource/batchDelResource';

        /**  获取所有的资源类别   **/
        this.getAllResourceCategoory = url+'admin/upmResource/getAllResourceCategoory';

        /**  根据角色获取资源   **/
        this.getRoleResource =  url+'admin/upmResource/getRoleResource';
    }
}

export default new api;