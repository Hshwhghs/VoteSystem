<template>
  <div class="myHeader">
      <img src="https://sczyz.org.cn/fzysc/static/img/user-bg.181d0445.jpg" alt="" class="bg">
      <div class="groupInfo">
          <div class="groupName">
            <wd-img
              round
              width="100px"
              height="100px"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            /><br>
            {{name}}</div>
      </div>
      <div class="groupCount">
          <div class="timeCount">{{countVote}}
              <br><i>已发起投票数</i>
          </div>
          <div class="personCount">{{countUser}}
              <br><i>组织人数</i>
          </div>
      </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
    name:'myHeader',
  mounted() {
      let _this = this
      axios({
        method: "post",
        url: "/get/user/count",
        headers: {'content-type': 'multipart/form-data'},
        data: {"id": _this.$common.orgID}
      }).then(res =>{
        _this.countUser = res.data
      })
    axios({
      method: "post",
      url: "/get/vote/count",
      headers: {'content-type': 'multipart/form-data'},
      data: {"id": _this.$common.orgID}
    }).then(res =>{
      _this.countVote = res.data
    })
  },
  data() {
        return {
          name: this.$common.organName,
          countVote:3000,
          countUser:1000
        }
    },
}
</script>

<style>
    .myHeader {
        position: relative;
        width: 100%;
        height: 30%;
    }
    .bg {
        width: 100%;
        height: 100%;
    }
    .headPhoto {
        position: absolute;
        top: 25%;
        left: 50%;
        transform: translateX(-50%);
    }
    .groupName {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        color: white;
        font-size: large;
    }
    .timeCount {
        position: absolute;
        color:white;
        top: 67%;
        left: 17%;
        text-align: center;
    }
    .personCount {
        position: absolute;
        color:white;
        top: 67%;
        left: 70%;
        text-align: center;
    }
    i {
        font-size: x-small;
        font-style: normal;
    }
</style>
