<template>
  <div class="background">
    <div style="text-align: center;margin-top: 30px;">
      <img class="new_avatar" :src="ImgSrc"/>
    </div>
    <div class="userName">{{userName}}</div>
    <wd-collapse v-model="actions" accordion style="margin-top: 30px">
      <wd-collapse-item title="组织管理" name="item1">
        <wd-cell-group border>
          <wd-cell title="创建投票" icon="wd-icon-add" size="large" is-link to="/create"></wd-cell>
          <wd-cell title="设置首页公告"  icon="wd-icon-setting" size="large" clickable @click="setIndexMsg">
            <i class="cell-icon" slot="icon"></i>
          </wd-cell>
        </wd-cell-group>
      </wd-collapse-item>
      <wd-collapse-item title="个人信息管理" name="item2">
        <wd-cell-group border>
          <wd-cell title="修改密码" clickable icon="wd-icon-setting" size="large" @click="showPopup"></wd-cell>
        </wd-cell-group>
      </wd-collapse-item>
      <div class="button_container" >
        <button class="new_button" style="text-align: center" @click="logout">退出登录</button>
      </div>
    </wd-collapse>
    <wd-message-box :show="show" show-cancel-button @action="changePsw" title="修改密码">
      用户名<wd-input v-model="changeData.username" placeholder="请输入用户名"></wd-input>
      旧密码<wd-input v-model="changeData.password" placeholder="请输入旧密码" show-password v-bind:error="errorOldPsw"></wd-input>
      新密码<wd-input v-model="newPsw" placeholder="请输入新密码" show-password v-bind:error="errorNewPsw"></wd-input>
      确认密码<wd-input v-model="checkPsw" placeholder="请再次输入密码" show-password v-bind:error="errorNewPsw"></wd-input>
    </wd-message-box>
    <wd-tabbar v-model="tabbar" fixed border>
      <wd-tabbar-item to="/organ">
        <div slot="icon">
          <i style="font-size: 30px;" class="icon-zuzhi"></i><br>
          组织
        </div>
      </wd-tabbar-item>
      <wd-tabbar-item to="/">
        <div slot="icon">
          <i style="font-size: 30px;" class="icon-shouye"></i><br>
          首页
        </div>
      </wd-tabbar-item>
      <wd-tabbar-item style="margin-top: 5px" to="/user">
        <div slot="icon">
          <i style="font-size: 31px;" class="icon-wode"></i><br>
          我
        </div>
      </wd-tabbar-item>
    </wd-tabbar>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "user",
  data(){
    return{
      show: false,
      tabbar: "",
      actions: "个人信息管理",
      ImgSrc:"https://i.loli.net/2017/08/21/599a521472424.jpg",
      userName: this.$common.username,
      changeData: {"username": this.$common.username,"password": "","isAdmin": false,orgId: this.$common.orgID},
      newPsw : "",
      checkPsw: "",
      errorOldPsw: false,
      errorNewPsw: false,
    }
  },
  methods:{
    setIndexMsg(){
      this.$messageBox.prompt('请输入公告', ).then(({ value }) => {
        this.$common.IndexMsg = value
        this.$toast.success("设置成功！")
      })
    },
    changePsw(action){
      let _this = this
      if (action==='confirm'){
        if (this.newPsw === ""){
          this.$toast.error('新密码不能为空！')
          this.errorNewPsw = true
        }else if(this.newPsw!==this.checkPsw){
          this.$toast.error('两次密码不匹配！')
          this.errorNewPsw = true
        }else {
          this.errorNewPsw = false
          axios({
            method: 'post',
            url: "/change",
            headers: {'content-type': 'application/json'},
            data: {"user": _this.changeData, "newPsw": _this.newPsw}
          }).then(res =>{
            if (res.data.Code === 200){
              _this.$toast.success("修改成功！正在跳转重新登录")
              // 退出登录
              axios({
                method: "post",
                url: "/logout",
                headers: {'content-type': 'multipart/form-data'},
                data: {"token": _this.$common.token}
              }).then(function (response) {
                console.log(response.data);
                _this.$common.setToken("")
                _this.$router.push("/login")
              }).catch(err => {
                console.log(err)
              })
              _this.errorOldPsw = false
            }else {
              _this.errorOldPsw = true
              _this.$toast.error(res.data.Data)
            }
          })
        }
      }else {
        this.show = false
      }
    },
    showPopup(){
      this.show = true
    },
    logout(){
      let _this = this
      this.$messageBox.confirm('是否退出登录？', '提示').then(() => {
        axios({
          method: "post",
          url: "/logout",
          headers: {'content-type': 'multipart/form-data'},
          data: {"token": _this.$common.token}
        }).then(function (response) {
          console.log(response.data);
          _this.$common.setToken("")
          _this.$toast.success('操作成功')
          console.log(_this.$common.token)
          _this.$router.push("/login")
        }).catch(err => {
          console.log(err)
        })
      })
    }
  }
}
</script>

<style>
.userName{
  text-align: center;
  margin: 0 auto;
  margin-top: 10px;
  font-size: 20px;
}
.background{
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  height: calc(100vh);
  overflow:hidden;

}
.button_container{
  text-align: center;
}

.new_button{
  width: 100%;
  height: 50px;
  font-weight: 500;
  font-size: large;
  font-family: "Noto Sans SC";
  border: 1px solid #eaeaea;
  border-width:0.5px thin 0 0 ;
  background-color: transparent;
}
.cell-icon {
  display: block;
  width: 16px;
  height: 16px;
  argin-top: 2px;
  margin-right: 15px;
  background: url('https://img10.360buyimg.com/jmadvertisement/jfs/t1/71075/7/3762/1820/5d1f26d1E0d600b9e/a264c901943080ac.png')
  no-repeat;
  background-size: cover;
}
.new_avatar{
  margin-top: 20px;
  margin: 0 auto;
  display:block;
  border-radius: 50%;
  width: 80px;
}
</style>
