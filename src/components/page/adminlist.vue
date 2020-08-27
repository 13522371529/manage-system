<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 管理列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
<!--                <el-button-->
<!--                    type="primary"-->
<!--                    icon="el-icon-delete"-->
<!--                    class="handle-del mr10"-->
<!--                    @click="delAllSelection"-->
<!--                >批量删除</el-button>-->
                <el-select v-model="query.status" placeholder="状态" class="handle-select mr10" @change="handleSearch">
                    <el-option key="0" label="全部" value=""></el-option>
                    <el-option key="1" label="禁用" value="0"></el-option>
                    <el-option key="2" label="启用" value="1"></el-option>
                </el-select>
                <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input>
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
                <el-table-column prop="useername" label="用户名" align="center"><template slot-scope="scope">{{scope.row.username}}</template></el-table-column>
                <el-table-column label="昵称" align="center">
                    <template slot-scope="scope">{{scope.row.nickName}}</template>
                </el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.icon"
                            :preview-src-list="[scope.row.icon]"
                        ></el-image>
                    </template>
                </el-table-column>
<!--                <el-table-column prop="status" label="状态"></el-table-column>-->
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                       {{scope.row.status===0?'禁用':'启用'}}
                    </template>
                </el-table-column>

                <el-table-column prop="date" label="注册时间" align="center"> <template slot-scope="scope">{{Format(scope.row.createTime)}}</template></el-table-column>
                <el-table-column prop="date" label="登陆时间" align="center"> <template slot-scope="scope">{{Format(scope.row.loginTime)}}</template></el-table-column>
                <el-table-column prop="date" label="登陆地点" align="center"> <template slot-scope="scope">{{scope.row.loginAddress}}</template></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
<!--                        <el-button-->
<!--                            type="text"-->
<!--                            icon="el-icon-delete"-->
<!--                            class="red"-->
<!--                            @click="handleDelete(scope.$index, scope.row)"-->
<!--                        >删除</el-button>-->
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="10%">
          <el-select v-model="updateform.status" placeholder="账户状态" class="handle-select mr10">
            <el-option key="1" label="禁用" value="0"></el-option>
            <el-option key="2" label="启用" value="1"></el-option>
          </el-select>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api/globalurl'
import { format_date, sendPost } from '@/api/globalFunction';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                id:'',
                username: '',
                email: '',
                nickName: '',
                status: '',
                startTime: '',
                endTime: '',
                startPage: 1,
                pageSize: 10
            },
            updateform:{
                id:'',
                status: '',
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
          sendPost(api.serachList,this.query).then(res => {
                     this.tableData = res.data.rows;
                     this.pageTotal = res.data.total || 50;
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
            // 二次确认删除
          console.log(row)
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.updateform.status = this.form.status===0?'禁用':'启用';
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
          this.updateform.id = this.form.id;
          sendPost(api.updateUpmAdminStatus,this.updateform).then(res => {
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
