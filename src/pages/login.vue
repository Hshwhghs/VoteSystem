<template>
  <div style="background-image: linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);width: 100%;height: 100%;position: absolute;">
    <wd-card style="height: auto;width: 80%;position: relative;margin-top: 200px;margin-left: 25px">
      <span style="font-size: 20px;color: #275aae">欢迎登录区块链投票系统</span>
      <div style=" margin-top: 20px">
        <wd-drop-menu v-show="!(regType&&userType==='2')">
          <wd-drop-menu-item v-bind:title="this.organName">
            <wd-picker-view :columns="columns" v-model="organIndex" @change="onChange"></wd-picker-view>
            <wd-search v-model="search" @search="searchOrgan" @cancel="cancelSearch"></wd-search>
          </wd-drop-menu-item>
        </wd-drop-menu>
        <wd-input v-show="userType==='2'&&regType" label="组织名" placeholder="请输入组织名" size="large" v-model:value="organ.Name"></wd-input>
        <wd-input v-show="userType==='2'&&regType" label="组织描述" placeholder="请输入组织描述" size="large" v-model:value="organ.Description"></wd-input>
        <wd-input label="用户名" placeholder="请输入用户名" size="large" v-model:value="userInfo.username"></wd-input>
        <wd-input label="密码" placeholder="请输入密码" size="large" v-model:value="userInfo.password" clearable show-password></wd-input>
        <wd-input label="确认密码" v-show="regType" placeholder="请确认密码" size="large" v-model:value="checkPassword" clearable show-password></wd-input>
        <span style="font-size: 15px;color: #275aae">{{buttonText}}类型</span>
        <wd-radio-group v-model="userType" shape="dot" size="large" @change="changeUserType">
          <wd-radio value="1">用户</wd-radio>
          <wd-radio value="2">管理员</wd-radio>
        </wd-radio-group>
        <wd-button type="text" style="margin-top: 5px;text-align: right" @click="register">{{regText}}</wd-button>
        <wd-button block size="large" style="margin-top: 20px" @click="login">{{buttonText}}</wd-button>
      </div>
    </wd-card>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "login",
  mounted() {
    let that = this
    axios({
      method: 'post',
      url: "/get/organ/all",
    }).then(res =>{
      that.organs = JSON.parse(res.data.Data)
      console.log(this.organs)
      that.searchedOrgan=that.organs
      for (const key in that.organs) {
        that.columns.push({label: that.organs[key].Name, value: key})
      }
      this.allColumns = this.columns
    })
  },
  data(){
    return{
      userType: "1",
      buttonText: this.regType?"注册":"登录",
      regText: "还没有账号？立即注册",
      checkPassword: "",
      regType: false,
      organIndex: -1,
      columns: [{label: "请选择组织",value: "-1"}],
      organName: "请选择组织",
      userInfo: {username: "", password: "", 'isAdmin': false, orgId: ""},
      organ: {Id: "", Name: "", Description: "",AdminUsername: "",AdminPassword: ""},
      organs: [],
      allColumns: [],
      orgId: "",
      search: "",
    }
  },
  methods:{
    cancelSearch(){
      this.columns = this.allColumns
    },
    changeUserType(val){
      if(val === '1'){
        this.$set(this.userInfo,'isAdmin',false)
      }else {
        this.$set(this.userInfo,'isAdmin',true)
      }
    },
    register(){
      if (this.regType){
        this.buttonText = "登录"
        this.regText = "还没有账号？立即注册"
        this.regType = false
      }else {
        this.buttonText = "注册"
        this.regText = "返回登录"
        this.regType = true
      }
    },
    onChange(picker, value, index){
      console.log(value)
      if (value === -1){
        this.organName = "请选择组织"
      }else {
        this.organ = this.organs[value]
        this.organName = this.organ.Name
        this.userInfo.orgId = this.organ.Id
        console.log(this.organ)
      }
    },
    searchOrgan(){
      let t = []
      for (const index in this.organs) {
        let organ = this.organs[index]
        if (organ.Name.includes(this.search)){
          t.push({label: organ.Name, value: organ.Id})
        }
      }
      this.columns = t
    },
    login(){
      if(this.regType){
        if (this.userInfo.password!==this.checkPassword){
          this.$toast.error("两次密码不一致！")
          return
        }
        if (this.userType === "1"){
          this.userInfo.orgId = this.organ.Id
          if (this.userInfo.orgId===""){
            this.$toast.error("您还未选择组织")
            return
          }
          delete this.userInfo["isAdmin"]
          let value = this.userInfo
          console.log(value)
          axios({
            method: "post",
            url: "/user/register",
            headers: {'content-type': 'application/json'},
            data: value
          }).then(res=>{
            if (res.data.Code===200){
              this.$toast.success({msg: "注册成功！", duration: 1000,onClose: () => {
                  this.$router.go(0)
                }})
            }else {
              this.$toast.error ("该用户名已被注册")
            }
          })
        }else {
          this.organ.AdminUsername = this.userInfo.username
          this.organ.AdminPassword = this.userInfo.password
          let value = this.organ
          console.log(value)
          axios({
            method: "post",
            url: "/organ/register",
            headers: {'content-type': 'application/json'},
            data: value
          }).then(res=>{
            if (res.data.Code===200){
              this.$toast.success({msg: "注册成功！", duration: 1000,onClose: () => {
                  this.$router.go(0)
                }})
            }else {
              this.$toast.error(res.data.Data)
            }
          })
        }
      }else {
        let _this = this
        console.log(this.userInfo)
        axios({
          method: "post",
          url: "/login",
          headers: {'content-type': 'application/json'},
          data: _this.userInfo
        }).then(res =>{
          if (res.data.Code === 200){
            _this.$common.orgID = _this.userInfo.orgId
            _this.$common.setToken(res.data.Data)
            _this.$common.setIsAdmin(_this.userInfo.isAdmin)
            console.log(_this.userInfo)
            _this.$common.organName = _this.organName
            _this.$common.organDes = _this.organ["Description"]
            _this.$common.username = _this.userInfo.username
            _this.$router.push("/")
          }else {
            this.$toast.error(res.data.Data)
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
