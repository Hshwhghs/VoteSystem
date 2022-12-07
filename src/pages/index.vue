<template>
  <div class="main">
    <wd-navbar title="首页" ></wd-navbar>
    <div>
      <wd-search v-model="search" placeholder="请输入标题进行搜索" @search="handleSearch" hide-cancel @clear="handleClear" light style="background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)"></wd-search>
      <wd-notice-bar
        prefix="dong"
        type="info"
        v-bind:text="notice"
      ></wd-notice-bar>
    </div>
    <div>
      <wd-swipe style="max-height: 250px">
        <wd-swipe-item v-for="src in noticeImg" :key="src">
          <wd-img v-bind:src="src"></wd-img>
        </wd-swipe-item>
      </wd-swipe>
    </div>
    <div>
      <wd-tabs v-model="select" animated style="background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);">
        <wd-tab v-for="item in classify" :key="item" :title="`${item}`">
          <div v-for="vote in voteList[item]">
            <wd-card style="margin-top: 10px;">
              <div slot="default">
                <wd-row gutter="20">
                  <wd-col span="10">
                    <div class="left-img">
                      <wd-img v-bind:src="vote.img" ></wd-img>
                    </div>
                  </wd-col>
                  <wd-col span="14">
                    <div class="right-word" >
                      <div class="vote-name">
                        <span >{{vote.name}}</span>
                      </div>
                      <span class="vote-des">{{vote.description}}</span>
                    </div>
                  </wd-col>
                </wd-row>
              </div>
              <wd-button @click="onClick(vote)" slot="footer" size="small" plain>查看详情</wd-button>
            </wd-card>
          </div>
        </wd-tab>
      </wd-tabs>
    </div>
    <wd-tabbar v-model="tabbar" fixed border>
      <wd-tabbar-item to="/organ">
        <div slot="icon">
          <i style="font-size: 30px;" class="icon-zuzhi"></i><br>
          组织
        </div>
      </wd-tabbar-item>
      <wd-tabbar-item>
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
  data(){
    return {
      tabbar: 1,
      classify: ["进行中", "已结束","未开始"],
      select: 0,
      noticeIndex: 0,
      search: "",
      notice: this.$common.IndexMsg,
      noticeImg: ["https://bpic.588ku.com/Templet_origin_pic/05/01/02/48164dba16bb503a1918f9370476aae7.jpg","http://pic.ntimg.cn/file/20200429/25213760_164157612539_2.jpg","https://gss0.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/cefc1e178a82b9011e0450507a8da9773912ef2c.jpg"],
      voteList: {"未开始": [],
      "已结束": [],
        "进行中": []},
      voteData: {"未开始": [],
        "已结束": [],
        "进行中": []}
    }
  },
  mounted() {
    let _this = this
    axios({
      url: "/get/vote/all",
      method: 'post',
      headers: {'content-type': 'multipart/form-data'},
      data: {"token": _this.$common.token}
    }).then(res=>{
      if (res.data.Code === 200){
        const allVotes = JSON.parse(res.data.Data)
        console.log(allVotes)
        let now = (new Date()).valueOf()/1000
        for (const voteKey in allVotes) {
          let vote = allVotes[voteKey]
          if (vote.endTime <= now){
            _this.voteList["已结束"].push(vote)
          }else if (vote.beginTime>now){
            _this.voteList["未开始"].push(vote)
          }else {
            _this.voteList["进行中"].push(vote)
          }
        }
      }else {
        _this.$toast.error(res.data.Data)
      }
    })
  },
  methods:{
    onClick(val){
      console.log(val)
      this.$router.push("/list?id="+val.id)
    },
    handleSearch(val){
      let on = []
      for (let i=0;i<this.voteData["进行中"].length;i++){
        if(this.voteData["进行中"][i].name.includes(val)){
          on.push(this.voteData["进行中"][i])
        }
      }
      this.voteList["进行中"]=on
      let begin = []
      for (let i=0;i<this.voteData["未开始"].length;i++){
        if(this.voteData["未开始"][i].name.includes(val)){
          begin.push(this.voteData["未开始"][i])
        }
      }
      this.voteList["未开始"]=begin
      let end = []
      for (let i=0;i<this.voteData["已结束"].length;i++){
        if(this.voteData["已结束"][i].name.includes(val)){
          end.push(this.voteData["已结束"][i])
        }
      }
      this.voteList["已结束"]=end
    },
    handleClear(){
      this.voteList = this.voteData
    }
  },
  name: "index"
}
</script>

<style scoped>
.main{
  background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  min-height: 1200px
}
.left-img{
  width: 130px;height: auto
}
.vote-name{
  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
  color: black;
  font-size: 16px;
  text-align: left;
}
.vote-des{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 15px;
  text-align: left;
}
.tabbar{
  position: absolute;
  width: auto;
}
</style>
