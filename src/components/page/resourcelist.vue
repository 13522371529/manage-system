<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 资源管理列表
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
                <el-select v-model="query.categoryId" placeholder="资源类别" class="handle-select mr10" >
                  <el-option key="0" label="全部类别" value=""></el-option>
                  <el-option v-for="item in categoryData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="资源名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="addResource">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"> </el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"><template slot-scope="scope">{{scope.row.id}}</template></el-table-column>
                <el-table-column prop="date" label="资源类别"> <template slot-scope="scope">{{scope.row.categoryId}}</template></el-table-column>
                <el-table-column prop="date" label="资源名称"> <template slot-scope="scope">{{scope.row.name}}</template></el-table-column>
                <el-table-column prop="date" label="资源路径"> <template slot-scope="scope">{{scope.row.url}}</template></el-table-column>
                <el-table-column prop="date" label="资源说明"> <template slot-scope="scope">{{scope.row.description}}</template></el-table-column>
                <el-table-column prop="date" label="创建时间"> <template slot-scope="scope">{{Format(scope.row.createTime)}}</template></el-table-column>
                <el-table-column label="操作" width="180" align="center">
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
        <el-dialog title="编辑资源" :visible.sync="editVisible" width="30%" >
          <el-form ref="form" :model="form" label-width="70px">
            <el-form-item label="资源类别">
              <el-select v-model="updateform.categoryId" placeholder="请选择" class="handle-select mr10" >
                <el-option v-for="item in categoryData" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资源名称">
              <el-input v-model="updateform.name"></el-input>
            </el-form-item>
            <el-form-item label="资源说明">
              <el-input v-model="updateform.description"></el-input>
            </el-form-item>
            <el-form-item label="资源路径">
              <el-input v-model="updateform.url"></el-input>
            </el-form-item>

          </el-form>
          <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateEdit">确 定</el-button>
            </span>
        </el-dialog>

      <el-dialog title="新增资源" :visible.sync="addVisible" width="30%">
        <el-form ref="form" :model="form" label-width="70px">

          <el-form-item label="资源类别">
            <el-select v-model="addform.categoryId" placeholder="请选择" class="handle-select mr10" >
              <el-option v-for="item in categoryData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源名称">
            <el-input v-model="addform.name"></el-input>
          </el-form-item>
          <el-form-item label="资源说明">
            <el-input v-model="addform.description"></el-input>
          </el-form-item>
          <el-form-item label="资源路径">
            <el-input v-model="addform.url"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
      </el-dialog>
    </div>
</template>

<script>
import api from '@/api/globalurl'
import {format_date, get, sendPost} from '@/api/globalFunction';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                id:'',
                name: '',
                startTime: '',
                endTime: '',
                categoryId:'',
                startPage: 1,
                pageSize: 10
            },
            updateform:{
                id:'',
                url: '',
                name: '',
                description: '',
                categoryId:'',
            },
            delform:{
              ids: '',
            },
            addform:{
              url: '',
              name: '',
              description: '',
              categoryId:'',
            },
            categoryData:[],
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
        this.getAllCategory();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
          sendPost(api.serachResourceList,this.query).then(res => {
                     this.tableData = res.data.rows;
                     this.pageTotal = res.data.total || 50;
                 });
        },

        // 资源类别
        getAllCategory(){
          get(api.getAllResourceCategoory).then(res => {
            this.categoryData = res.data;
          });
        },
        // 批量删除
        delumsResource:function(){
          sendPost(api.batchDelResource,this.delform).then(res => {
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
          this.delumsResource();

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
          this.delumsResource();
        })
            .catch(() => {});
      },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.updateform.url = row.url;
            this.updateform.categoryId = row.categoryId;
            this.updateform.description = row.description;
            this.updateform.name = row.name;
            this.editVisible = true;
        },
        // 保存编辑
        updateEdit() {
          this.updateform.id = this.form.id;
          sendPost(api.updateUmsResource,this.updateform).then(res => {
           if(res.code===200){
             this.$message.success(res.msg);
             this.editVisible = false;
             this.getData();
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
      addResource(){
        this.addVisible = true;
        this.addform.description ='';
        this.addform.name = '';
        this.addform.url = '';
      },// 新增资源
      saveEdit() {
        var _this = this;
        if(this.addform.name===''){
          this.$message.error("请输入资源名称!");
          return;
        }
        if(this.addform.url===''){
          this.$message.error("请输入资源地址!");
          return;
        }
        if(this.addform.categoryId===''){
          this.$message.error("请选择资源类别!");
          return;
        }
        sendPost(api.addUmsResource,this.addform).then(res => {
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
