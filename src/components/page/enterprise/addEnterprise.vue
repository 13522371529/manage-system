<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商家列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.state" placeholder="状态" class="handle-select mr10" @change="handleSearch">
                    <el-option key="0" label="全部" value=""></el-option>
                    <el-option key="1" label="营业中" value="IN_THE_BUSINESS"></el-option>
                    <el-option key="2" label="休息中" value="IN_THE_REST"></el-option>
                    <el-option key="2" label="已冻结" value="BEEN_FROZEN"></el-option>
                    <el-option key="2" label="已注销" value="BEEN_CANCELLED"></el-option>
                </el-select>
                 <el-input v-model="query.id" placeholder="商家编号" class="handle-input mr10"></el-input>
                <el-input v-model="query.nickname" placeholder="商家名称" class="handle-input mr10"></el-input>
                <el-input v-model="query.loginName" placeholder="账户名" class="handle-input mr10"></el-input>
                <el-input v-model="query.phone" placeholder="商家电话" class="handle-input mr10"></el-input>

            </div>
            <div class="handle-box">
              <el-select v-model="query.provinces" placeholder="省份" class="handle-select mr10" @change="enterpriseCity">
                <el-option v-for="item in provincesData" :key="item.id" :label="item.name" :value="{value:item.code,label:item.name}"></el-option>
              </el-select>
              <el-select v-model="query.city" placeholder="市区" class="handle-select mr10" @change="enterpriseArea">
                <el-option v-for="item in cityData" :key="item.id" :label="item.name" :value="{value:item.code,label:item.name}"></el-option>
              </el-select>
              <el-select v-model="query.area" placeholder="地区" class="handle-select mr10">
                <el-option v-for="item in areaData" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
              <el-input v-model="query.street" placeholder="街道" class="handle-input mr10"></el-input>
              <el-input v-model="query.address" placeholder="地址" class="handle-input mr10"></el-input>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="addEnterprise">新增</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"> </el-table-column>
                <el-table-column prop="enterpriseId" label="商家ID" width="200" align="center"><template slot-scope="scope">{{scope.row.enterpriseId}}</template></el-table-column>
                <el-table-column label="图片" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.enterpriseImg"
                            :preview-src-list="[scope.row.enterpriseImg]"
                        ></el-image>
                    </template>
                </el-table-column>
              <el-table-column prop="enterpriseLoginName" label="账号名" align="center"><template slot-scope="scope">{{scope.row.enterpriseLoginName}}</template></el-table-column>
              <el-table-column prop="enterpriseNickname" label="商家名称" align="center"><template slot-scope="scope">{{scope.row.enterpriseNickname}}</template></el-table-column>
              <el-table-column prop="enterpriseRealname" label="法人名字" align="center"><template slot-scope="scope">{{scope.row.enterpriseRealname}}</template></el-table-column>
              <el-table-column prop="enterprisePhone" label="联系电话" align="center"><template slot-scope="scope">{{scope.row.enterprisePhone}}</template></el-table-column>
              <el-table-column prop="date" label="商家地址" align="center"> <template slot-scope="scope">{{scope.row.enterpriseProvinces}} {{scope.row.enterpriseCity}} {{scope.row.enterpriseArea}} {{scope.row.enterpriseStreet}} {{scope.row.enterpriseAddress}}</template></el-table-column>-->
              <el-table-column prop="enterpriseBalance" label="账户余额" align="center"><template slot-scope="scope">{{scope.row.enterpriseBalance}}</template></el-table-column>
              <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                       {{getState(scope.row.enterpriseState)}}
                    </template>
                </el-table-column>

                <el-table-column prop="date" label="注册时间" align="center"> <template slot-scope="scope">{{Format(scope.row.enterpriseCreateTime)}}</template></el-table-column>
                <el-table-column prop="date" label="最后登陆时间" align="center"> <template slot-scope="scope">{{Format(scope.row.enterpriseLoginTime)}}</template></el-table-column>
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
                      <el-button
                          type="text"
                          icon="el-icon-delete"
                          class="red"
                          @click="resetPassword(scope.$index, scope.row)"
                      >重置密码</el-button>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="20%">
          <el-form ref="form" :model="form" label-width="70px">
            <el-form-item label="账号状态">
            <el-select v-model="updateform.status" placeholder="账户状态" class="handle-select mr10">
              <el-option key="1" label="禁用" value="0"></el-option>
              <el-option key="2" label="启用" value="1"></el-option>
            </el-select>
            </el-form-item>
          </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

      <el-dialog title="新增" :visible.sync="addEnterpriseVisible" width="40%">
        <el-form ref="form" :model="form" label-width="70px">

          <el-form-item label="商家名称">
            <el-input v-model="addEnterpriseForm.nickname" placeholder="商家名称" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="法人名字">
            <el-input v-model="addEnterpriseForm.realname" placeholder="法人名字" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="addEnterpriseForm.phone" placeholder="联系电话" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="登陆账号">
            <el-input v-model="addEnterpriseForm.loginName" placeholder="登陆账号" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="登陆密码">
            <el-input v-model="addEnterpriseForm.password" placeholder="登陆密码" class="handle-input mr10"></el-input>
          </el-form-item>
          <el-form-item label="详细地址">
          <el-select v-model="addEnterpriseForm.provinces" placeholder="省份" class="handle-select mr10" @change="addEnterpriseCity">
            <el-option v-for="item in provincesData" :key="item.id" :label="item.name" :value="{value:item.code,label:item.name}"></el-option>
          </el-select>
          <el-select v-model="addEnterpriseForm.city" placeholder="市区" class="handle-select mr10" @change="addEnterpriseArea">
            <el-option v-for="item in addCityData" :key="item.id" :label="item.name" :value="{value:item.code,label:item.name}"></el-option>
          </el-select>
          <el-select v-model="addEnterpriseForm.area" placeholder="地区" class="handle-select mr10">
            <el-option v-for="item in addAreaData" :key="item.id" :label="item.name" :value="item.name"></el-option>
         </el-select>

          </el-form-item>
          <el-form-item label="街道">
            <el-input v-model="addEnterpriseForm.street" placeholder="街道" class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="地址">
            <el-input v-model="addEnterpriseForm.address" placeholder="地址" class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="注册人身份证id">
            <el-input v-model="addEnterpriseForm.cardId" placeholder="注册人身份证id" class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="身份证正面">
            <el-input v-model="addEnterpriseForm.cardImg1" placeholder="身份证正面" class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="身份证反面">
            <el-input v-model="addEnterpriseForm.cardImg2" placeholder="身份证反面" class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="真实姓名">
            <el-input v-model="addEnterpriseForm.realname" placeholder="真实姓名" class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="商家照片">
            <el-input v-model="addEnterpriseForm.img" placeholder="商家照片" class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="营业执照">
            <el-input v-model="addEnterpriseForm.businessLicense" placeholder="营业执照" class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="商家描述">
            <el-input v-model="addEnterpriseForm.describe" placeholder="商家描述" class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="经度">
            <el-input v-model="addEnterpriseForm.lng" placeholder="经度" class="handle-input mr10"></el-input>
          </el-form-item>

          <el-form-item label="纬度">
            <el-input v-model="addEnterpriseForm.lat" placeholder="纬度" class="handle-input mr10"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="addEnterpriseVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
      </el-dialog>

      <el-dialog title="重置密码" :visible.sync="editPassword" width="20%">
        <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="重置密码">
                  <el-input v-model="updateform.password"></el-input>
                </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="editPassword = false">取 消</el-button>
                <el-button type="primary" @click="savePassword">确 定</el-button>
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
                nickname: '',
                phone: '',
                loginName:'',
                state: '',
                provinces:'',
                city:'',
                area:'',
                street:'',
                address:'',
                startTime: '',
                endTime: '',
                startPage: 1,
                pageSize: 10
            },
          provincesData:[],
          cityData:[],
          areaData:[],
          addProvincesData:[],
          addCityData:[],
          addAreaData:[],
          city:{
              level:'1',
              parentCode:'0'
          },
          addCity:{
            level:'1',
            parentCode:'0'
          },
            updateform:{
                id:'',
                status: '',
                password:'',
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            editPassword:false,
            addEnterpriseVisible:false,
            pageTotal: 0,
            form: {},
            addEnterpriseForm:{
              loginName: '',
              nickname: '',
              cardId:'',
              cardImg1:'',
              cardImg2:'',
              realname:'',
              phone:'',
              img:'',
              provinces:'',
              city:'',
              area:'',
              street:'',
              address:'',
              businessLicense:'',
              describe:'',
              lng:'',
              lat:''
            },
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
        this.enterpriseProvinces();
        this.getProvinces();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
          sendPost(api.searchEnterpriseInfo,this.query).then(res => {
                     this.tableData = res.rows;
                     this.pageTotal = res.total || 50;
          });
        },
      /** 初始化省级数据 **/
      enterpriseProvinces(){
        sendPost(api.searchUmsSysCity,this.city).then(res => {
          this.provincesData = res.data;
        });
      },
      getProvinces(){
        this.addProvincesData = this.provincesData;
      },
      /** 搜索获取地级市数据 **/
      enterpriseCity(val) {
        const {value,label} = val
        this.city.level = 2;
        this.city.parentCode = value;
        this.query.provinces=label
        sendPost(api.searchUmsSysCity,this.city).then(res => {
            this.cityData =  res.data;
        });

      },
      /** 获取地区数据 **/
      enterpriseArea(val) {
        const {value,label} = val
        this.city.level = 3;
        this.city.parentCode =value;
        this.query.city=label
        sendPost(api.searchUmsSysCity,this.city).then(res => {
          this.areaData =  res.data;
        });
      },


      /** 添加获取地级市数据 **/
      addEnterpriseCity(val) {
        const {value,label} = val
        this.addCity.level = 2;
        this.addCity.parentCode = value;
        this.addEnterpriseForm.provinces=label
        sendPost(api.searchUmsSysCity,this.addCity).then(res => {
          this.addCityData =  res.data;
          console.log(res.data)
        });

      },

      /** 获取地区数据 **/
      addEnterpriseArea(val) {
        const {value,label} = val
        this.addCity.level = 3;
        this.addCity.parentCode =value;
        this.addEnterpriseForm.city=label
        sendPost(api.searchUmsSysCity,this.addCity).then(res => {
          this.addAreaData =  res.data;
        });
      },

      Format:function(time) {
        if(null === time){
          return ;
        }
        return format_date(time);
      },
      getState:function(state) {
       if(state=='IN_THE_BUSINESS'){
         return '营业中'
       }
        if(state=='IN_THE_REST'){
          return '休息中'
        }
        if(state=='BEEN_FROZEN'){
          return '已冻结'
        }
        if(state=='BEEN_CANCELLED'){
          return '已注销'
        }
      },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'startPage', 1);
            this.getData();
        },
      addEnterprise(){
         this.addEnterpriseVisible = true;
      },
      resetPassword(row){
          this.editPassword = true;
          this.form = row;
          this.updateform.id = this.form.id
      },

      // savePassword(){
      //   this.$confirm('确定要重置密码吗？', '提示', {
      //     type: 'warning'
      //       }).then(() => {
      //         sendPost(api.resetPassword,this.updateform).then(res => {
      //           if(res.code===200){
      //             this.$message.success(res.msg);
      //             this.editPassword = false;
      //             this.getData();
      //           }else{
      //             this.$message.error(res.msg);
      //           }
      //         });
      //       })
      // },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // delAllSelection() {
        //     const length = this.multipleSelection.length;
        //     let str = '';
        //     this.delList = this.delList.concat(this.multipleSelection);
        //     for (let i = 0; i < length; i++) {
        //         str += this.multipleSelection[i].name + ' ';
        //     }
        //     this.$message.error(`删除了${str}`);
        //     this.multipleSelection = [];
        // },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.updateform.status = this.form.status===0?'禁用':'启用';
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
          sendPost(api.saveEnterpriseInfo,this.addEnterpriseForm).then(res => {
           if(res.code===200){
             this.$message.success(res.msg);
             this.addEnterpriseVisible = false;
             this.addEnterpriseForm={};
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
