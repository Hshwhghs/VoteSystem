<template>
  <div id="app">
    <myHeader></myHeader>
    <myList></myList>
    <myFooter></myFooter>
    <wd-tabbar v-model="tabbar" fixed border>
      <wd-tabbar-item>
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
import myHeader from '../components/myHeader.vue'
import myList from '../components/myList.vue'
import myFooter from '../components/myFooter.vue'
export default {
  name: 'App',
  components:{myHeader,myList,myFooter},
  mounted() {

  },
  data(){
    return{
      tabbar: 0
    }
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
</style>
