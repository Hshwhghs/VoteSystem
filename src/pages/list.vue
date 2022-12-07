<template>
  <div class="main">
    <wd-navbar v-bind:title="vote.title">
      <div slot="left">
        <wd-icon class="middle" name="arrow-left"/>
        <button style="background-color:transparent;border-style:none; color: ivory;font-size: 16px;height: 16px;" @click="goBack" >返回</button>
      </div>
      <div slot="right">
        <wd-picker v-model="index" :columns="option" style="font-size: 16px">
          <span>{{indexTitle}}</span>
        </wd-picker>
      </div>
    </wd-navbar>
    <wd-search v-model="search" placeholder="请输入候选人姓名或编号" @search="handleSearch" hide-cancel @clear="handleClear" light style="background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)"></wd-search>
    <div style="font-size: large">
      <span >{{vote.title}}</span>
    </div>
    <wd-card style="margin-top: 10px">
      <div slot="title" style="text-align: left">
        <wd-icon name="view">
        </wd-icon>
        投票详情
      </div>
      <div style="text-align: left;color: #275aae">
        <div style="font-size: 15px">
          开始时间：{{begin}}<br>
          结束时间：{{end}}
        </div>
        <div style="font-size: 16px;color: #000000">
          {{vote.des}}
        </div>
      </div>
      <div style="font-size: 20px;color: #e03136;margin-bottom: -20px;margin-top: 10px">
        {{status}}
      </div>
    </wd-card>
    <wd-message-box :show="isShow" show-cancel-button @action="handleAction"  v-bind:confirmButtonText="confirmTime">
      <div style="font-size: 18px;">
        <div style="color: #e03136;text-align: center">是否投票给【{{select.name}}】</div>
      </div>
    </wd-message-box>
    <div  v-for="voter in voters" >
      <wd-card style="margin-top: 20px;">
        <wd-img v-bind:src="voter.img" style="width: 200px;height: auto">{{voter.name}}</wd-img>
        <div class="word">
          <h2>{{voter.name}}</h2>
          {{voter.description}}
        </div>
        <div style="text-align: left;color: #e03136">
          <h2>{{voter.numbers}}票</h2>
        </div>
        <div style="text-align: right;margin-top: -44px">
          <wd-button size="small" @click="getDesc(voter.name)">查看详情</wd-button><br>
        </div>
        <wd-button size="large"  @click="doVote(voter)" style="width: 70%">投票</wd-button>
      </wd-card>
    </div>
    <wd-divider style="margin-top: 20px;" color="#275aae">
      <div slot="default" style="font-size: 18px;color: #275aae"><span>已经到底啦~</span></div>
    </wd-divider>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "list",
  mounted() {
    let voteId = this.$route.query.id
    let _this = this
    axios({
      method: "post",
      url: "/get/vote",
      headers: {'content-type': 'multipart/form-data'},
      data: {id: voteId}
    }).then(res =>{
      if (res.data.Code === 200){
        let value = JSON.parse(res.data.Data)
        _this.vote= {title: value.name, begin: value.beginTime, end: value.endTime,des: value.description}
        _this.voters = []
        for (const voterKey in value.voters) {
          _this.voters.push(value.voters[voterKey])
        }
        _this.votersData = _this.voters
        let now = new Date().getTime()/1000
        console.log(now)
        if (now >= this.vote.end){
          this.status="活动已结束"
        }else{
          if (now <= this.vote.begin){
            this.status="活动未开始"
          }else {
            this.status="活动进行中"
          }
        }
        let time = new Date();
        time.setTime(this.vote.begin*1000)
        this.begin = time.toLocaleString()
        time.setTime(this.vote.end*1000)
        this.end = time.toLocaleString()
      }
    })
  },
  data() {
    return {
      indexTitle: "全部",
      votersData: [],
      confirmTime: "3s",
      index: "全部",
      option: ["全部", 1,2,3,4,5,6,7,8,9,10],
      vote: {},
      voters: [],
      search: "",
      status: "",
      begin: "",
      end: "",
      isShow: false,
      select: "",
      clock: "",
      seedTime: 3
    }
  },
  watch: {
    seedTime(newTime, oldTime){
      if (newTime <= 0){
        clearInterval(this.clock)
        this.confirmTime = "确认"
      }
    },
    index(newIndex, oldIndex){
      if (newIndex === "全部"){
        this.indexTitle = "全部"
        this.voters = this.votersData
      }else {
        this.indexTitle = "第"+this.index+"页"
        let s = 0
        let t = []
        for (let i = (newIndex-1)*10; i < this.votersData.length; i++) {
          t.push(this.votersData[i])
          s++
          if (s===10){
            break
          }
        }
        this.voters = t
      }
    }
  },
  methods: {
    goBack(){
      this.$router.push("/")
    },
    handleAction (action) {
      if (action === 'confirm') {
        if (this.seedTime<=0){
          //投票接口
          let that = this
          axios({
            method: "post",
            url: "/vote",
            headers: {'content-type': 'application/json'},
            data: {id: that.$route.query.id, voterId: that.select.id,token: that.$common.token}
          }).then(res=>{
            if (res.data.Code === 200){
              this.$messageBox.alert(`投票成功`)
            }else {
              this.$toast.error(res.data.Data)
            }
            this.isShow = false
            this.confirmTime = "3s"
            this.seedTime = 3
          })
        }
      }else {
        this.isShow = false
        clearInterval(this.clock)
        this.confirmTime = "3s"
        this.seedTime = 3
      }
    },
    getDesc(url){
      window.open("https://cn.bing.com/search?q="+url, url)
    },
    doVote(val){
      this.select = val
      this.isShow = true
      this.clock = window.setInterval(() => {
        this.seedTime--
        this.confirmTime = this.seedTime + 's'
      },1000)
    },
    handleSearch (val) {
      let n = parseInt(val);
      if (!isNaN(n))
      {
        if (n<=this.votersData.length){
          this.voters = [this.votersData[n-1]]
        }else {
          this.$toast(`没有第${val}号候选人哦`)
        }
      }else {
        let t = []
        for (let i=0;i<this.votersData.length;i++) {
          if (this.votersData[i].name.includes(val)){
            t.push(this.votersData[i])
          }
        }
        this.voters = t
      }
    },
    handleClear () {
      this.voters = this.votersData
      //this.$toast('点击了清除按钮')
    }
  }
}
</script>

<style scoped>
.main{
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  min-height: 1200px
}
.word{
  text-align: left;
  width: auto;
  max-height: 170px;
  overflow: hidden;
}
</style>
