<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" @change="handleSearch">
                    <el-option key="0" label="全部" value=""></el-option>
                    <el-option key="1" label="禁用" value="0"></el-option>
                    <el-option key="2" label="启用" value="1"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="addRole">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >

                <el-table-column type="selection" width="55" align="center"> </el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"><template slot-scope="scope">{{scope.row.id}}</template></el-table-column>
                <el-table-column prop="name" label="角色名称" align="center"><template slot-scope="scope">{{scope.row.name}}</template></el-table-column>
                <el-table-column label="备注说明" align="center">
                    <template slot-scope="scope">{{scope.row.description}}</template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                       {{scope.row.status===0?'禁用':'启用'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240" >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                      <el-button
                          type="text"
                          icon="el-icon-group"
                          class="red"
                          @click="handleEditResource(scope.$index, scope.row)"
                      >分配资源</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.startPage"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑角色" :visible.sync="editVisible" width="15%">
          <el-form ref="form" :model="form" label-width="70px">
            <el-form-item label="角色账户">
              <el-select v-model="updateform.status" placeholder="角色状态" class="handle-select mr10">
                <el-option key="1" label="禁用" value="0"></el-option>
                <el-option key="2" label="启用" value="1"></el-option>
              </el-select>
            </el-form-item>

          </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateEdit">确 定</el-button>
            </span>
        </el-dialog>

      <el-dialog title="新增" :visible.sync="addVisible" width="20%">
        <el-form ref="form" :model="form" label-width="70px">
          <el-form-item label="角色名称">
            <el-input v-model="addform.name"></el-input>
          </el-form-item>
          <el-form-item label="备注说明">
            <el-input v-model="addform.description"></el-input>
          </el-form-item>
          <el-form-item label="状态">
         <el-select v-model="addform.status" placeholder="状态" class="handle-select mr10">
           <el-option key="1" label="禁用" value="0"></el-option>
           <el-option key="2" label="启用" value="1"></el-option>
         </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
      </el-dialog>



      <el-dialog title="分配资源" :visible.sync="editResource" width="30%" >
        <el-form ref="form" :model="form" label-width="70px">
          <el-form-item label="" required>
              <el-checkbox-group v-model="resourceList" >
                <el-checkbox v-for="(item) in categoryData"    :label="item.id" :key="item.id" >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>

        <span slot="footer" class="dialog-footer">
                <el-button @click="editResource = false">取 消</el-button>
                <el-button type="primary" @click="saveResource">确 定</el-button>
            </span>
      </el-dialog>
    </div>
</template>

<script>
import api from '@/api/globalurl'
import {format_date,sendPost} from '@/api/globalFunction';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                id:'',
                name: '',
                status: '',
                startTime: '',
                endTime: '',
                startPage: 1,
                pageSize: 10
            },
            resourceList:[],
            roleResourceform: {
              resourceId:'',
              roleId:'',
            },
            roleform:{},
            updateform:{
                id:'',
                status: '',
                name: '',
                description: '',
            },
            addform:{
              status: '',
              name: '',
              description: '',
            },
            delform:{
              ids: '',
            },
            categoryData:[],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            editResource: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
        this.getResourceList();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
          sendPost(api.serachRoleList,this.query).then(res => {
                     this.tableData = res.data.rows;
                     this.pageTotal = res.data.total || 50;
                 });
        },
      // 资源类别
      getResourceList(){
        sendPost(api.serachResourceList,this.query).then(res => {
          this.categoryData = res.data.rows;
        });
      },
      delumsRole:function(){
        sendPost(api.batchDelRole,this.delform).then(res => {
          if(res.code===200){
            this.$message.success(res.msg);
            this.editVisible = false;
            this.getData();
            this.delform.ids = '';
          }else{
            this.$message.error(res.msg);
          }
        });
      },

      Format:function(time) {
        return format_date(time);
      },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'startPage', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
          this.$confirm('确定要删除吗？', '提示', {
            type: 'warning'
          }).then(() => {
            this.idx = index;
            this.form = row;
            this.delform.ids = this.form.id;
            this.delumsRole();
          })
              .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
          this.$confirm('确定要删除吗？', '提示', {
            type: 'warning'
          }).then(() => {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
              str += this.multipleSelection[i].id + '-';
            }
            this.delform.ids = str;
            this.multipleSelection = [];
            this.delumsRole();
              })
              .catch(() => {});
        },

        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.updateform.status = this.form.status===0?'禁用':'启用';
            this.editVisible = true;
        },
        // 修改
        updateEdit() {
          this.updateform.id = this.form.id;
          sendPost(api.updateUpmRoleStatus,this.updateform).then(res => {
           if(res.code===200){
             this.$message.success(res.msg);
             this.editVisible = false;
             this.getData();
           }else{
             this.$message.error(res.msg);
           }
          });
        },

        // 新增角色
        saveEdit() {
          var _this = this;
          if(this.addform.name===''|| this.addform.status===''){
            this.$message.error("请输入合法参数!");
            return;
          }
          sendPost(api.addUpmRole,this.addform).then(res => {
            if(res.code===200){
              this.$message.success(res.msg);
              this.addVisible = false;
              this.getData();
              _this.addform.status='';
              _this.addform.description='';
              _this.addform.name='';
            }else{
              this.$message.error(res.msg);
            }
          });
       },
      //保存角色资源信息
      saveResource() {
        //var _this = this;
        let str = '';
        console.log( this.resourceList);
        this.resourceList.forEach(function(value){
          str += value +","
        });
        this.roleResourceform.resourceId = str;
        sendPost(api.addUmsRoleResource,this.roleResourceform).then(res => {
          if(res.code===200){
            this.$message.success(res.msg);
            this.editResource = false;
            this.resourceList =[];
          }else{
            this.$message.error(res.msg);
          }
        });

      },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'startPage', val);
            this.getData();
        },
        addRole(){
          this.addVisible = true;
        },
        // 分配资源
        handleEditResource(index,row){
          this.resourceList = [];
           var _this = this;
           this.roleform = row;
           this.roleResourceform.roleId = this.roleform.id;
           sendPost(api.getRoleResource,this.roleResourceform).then(res => {
            if(res.code===200){
              if(res.data.length > 0 ){
                res.data.forEach(function(li){
                  _this.resourceList.push(li.id)
                });
              }
            }else{
              this.$message.error(res.msg);
            }
          });
          this.editResource = true;
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
