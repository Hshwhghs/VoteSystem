<template>
  <div>
    <wd-navbar title="创建投票">
      <div slot="left" @click="goBack">
        <wd-icon class="middle" name="arrow-left" />
        <span class="middle">返回</span>
      </div>
    </wd-navbar>
    <div class="page-form">
      <wd-cell-group class="group" title="基础信息" border>
        <wd-input label="投票名称" label-width="100px" maxlength="20" show-word-limit required clearable v-model="name" placeholder="请输入投票名称"  />
        <wd-input label="投票封面地址" label-width="100px" required  clearable v-model="img" placeholder="请输入投票封面地址"  />
        <wd-cell-group class="group" title="时间" border>
          <wd-datetime-picker required label="开始时间" label-width="100px" v-model="beginDate" />
          <wd-datetime-picker required label="结束时间" label-width="100px" v-model="endDate" />
        </wd-cell-group>
        <wd-cell-group class="group" title="其他信息" border>
          <wd-input
            label="活动描述"
            label-width="100px"
            type="textarea"
            v-model="content"
            maxlength="300"
            show-word-limit
            rows="5"
            placeholder="请输入活动细则信息"
            clearable
          />
        </wd-cell-group>
        <wd-cell-group class="group" title="候选人信息" border>
          <div v-for="i in index" style="margin-bottom: 20px">
            <span style="font-size: 15px;color: #275aae"> 候选人{{i}} </span>
            <wd-input label="候选人名称" label-width="100px" maxlength="20" show-word-limit required clearable v-model="voters[i].name" placeholder="请输入候选人名称" />
            <wd-input
              label="候选人描述"
              label-width="50px"
              type="textarea"
              v-model="voters[i].description"
              maxlength="300"
              show-word-limit
              rows="5"
              placeholder="请输入候选人描述信息"
              clearable
            />
            <wd-input label="候选人图片地址" label-width="100px" clearable v-model="voters[i].img" placeholder="请输入候选人图片地址" />
            <wd-divider></wd-divider>
          </div>
        </wd-cell-group>
        <wd-button @click="addVoters"> 增加一位候选人 </wd-button> <wd-button @click="delVoters" type="error"> 删除末位候选人 </wd-button>
        <div class="tip">
          <wd-checkbox v-model="read">
        <span class="text">
          已阅读并同意
          <span style="color: #4D80F0;">《投票服务协议及相关授权》</span>
        </span>
          </wd-checkbox>
        </div>
        <div class="footer">
          <wd-button block size="large" @click="handleSubmit">提交</wd-button>
        </div>
      </wd-cell-group>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "createVote",
  mounted() {
    if (!this.$common.isAdmin){
      this.$toast.error("您不是管理员，没有权限创建投票哦！")
      this.$router.push("/user")
    }
  },
  data () {
    return {
      voters: {1: {id : "1", name: "", description: "", img: "", numbers: 0},},
      index : 1,
      id : "",
      name: '', //1
      beginDate: new Date(),
      endDate: new Date(),
      content: '',
      count: 1,
      read: false,
      img: "",
    }
  },
  methods: {
    goBack(){
      this.$router.push("/user")
    },
    addVoters() {
      this.index += 1
      this.voters[this.index] = {id : ""+this.index, name: "", description: "", img: "", numbers: 0}
    },
    delVoters(){
      if(this.index === 1){
        this.$toast.error('请至少设置一位候选人 ！')
      }else {
        delete this.voters[this.index]
        this.index -= 1
      }
    },
    handleSubmit () {
      if (this.name === ''){
        this.$toast.error('投票名称不能为空!')
        return
      }
      if (this.endDate<=this.beginDate){
        this.$toast.error('投票结束时间必须大于开始时间！')
        return
      }
      for (let votersKey in this.voters) {
        if (this.voters[votersKey].name === ""){
          this.$toast.error("候选人" + votersKey+"名称不能为空!")
          return
        }
      }
      if (!this.read){
        this.$toast.error("请阅读并同意《投票服务协议及相关授权》")
        return
      }
      const value = {
        "id": "",
        "name":this.name,
        "img": this.img,
        "orgId": this.$common.orgID,
        "description": this.content,
        "beginTime": Math.round(this.beginDate.valueOf()/1000),
        "endTime": Math.round(this.endDate.valueOf()/1000),
        "voters": this.voters
      }
      const data = {
        "token": this.$common.token,
        vote : value
      }
      axios({
        method: 'POST',
        url: '/create/vote',
        headers: {'content-type': 'application/json'},
        data: data
      }).then(res => {
        if(res.data.Code===200){
          this.$toast.success("创建成功！")
        }else {
          this.$toast.error(res.data.Data)
        }
      }).catch(function (error) {
        console.error(error);
      });
      //this.$messageBox.alert(`请确认相关信息！\n`+JSON.stringify(value))

    }
  }
}
</script>

<style scoped>
.page-form {
  padding-bottom: 16px;
}
.inline-txt {
  display: inline-block;
  font-size: 14px;
  margin: 0 8px;
  color: rgba(0, 0, 0, 0.45);
  vertical-align: middle;
  line-height: 20px;
}
.group {
  margin-top: 12px;
}
.tip {
  margin: 10px 15px 21px;
}
.text{
  color: #999;
  font-size: 12px;
}
.tip /deep/ .wd-checkbox__label {
  margin-left: 4px;
}
.footer {
  padding: 0 25px 21px;
}
</style>
