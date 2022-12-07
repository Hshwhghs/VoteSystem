<template>
  <div class="myList">
    <wd-card title="组织详情" class="list">
      <i class="el-icon-user"> 联 系 人: admin</i><br />
      <i class="el-icon-phone-outline"> 联系电话: 1780293XXXX</i><br />
      <i class="el-icon-position"> 组织类型：高校</i><br />
      <i class="el-icon-location-outline"> 所在地址：四川省成都市四川大学江安校区</i>
    </wd-card>
    <wd-card title="组织介绍" class="list">
      <span style="font-size: 20px;">{{des}}</span>
    </wd-card>
  </div>
</template>

<script>
export default {
  name: "myList",
  data(){
    return{
      des: this.$common.organDes
    }
  }
};
</script>

<style scoped>
.myList {
  margin-top: 10px;
}
.list {
  border: 1px solid rgba(255, 0, 0, 0.281);
  box-shadow: 1px 1px rgba(255, 0, 0, 0.205);
  border-radius: 20px;
  text-align: left;
}
i {
  width: 100%;
  padding: 5px;
  font-style: normal;
  text-align: left;
  font-size: 20px;
}
</style>
