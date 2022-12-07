// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/icon/iconfont.css'
import { Avatar } from 'element-ui';
import axios from "axios";
import { Card,Navbar,Search,DropMenu, DropMenuItem,NoticeBar,Swipe, SwipeItem,CellGroup, Cell } from 'wot-design'
import { Tab, Tabs,Divider,Row, Col,Tabbar, TabbarItem,Img,Button,Icon,MessageBox,Picker } from 'wot-design'
import { Collapse, CollapseItem,Input } from 'wot-design'
import { CheckboxGroup, Checkbox } from 'wot-design'
import { DatetimePicker } from 'wot-design'
import { Toast } from 'wot-design'
import { Popup } from 'wot-design'
import { PickerView } from 'wot-design'
import { RadioGroup, Radio } from 'wot-design'

Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(PickerView)
Vue.use(Popup)
import content from './common/content.js';
Vue.prototype.$common = content;
Vue.prototype.$axios = axios;
axios.defaults.baseURL='/api'
Vue.use(Toast)
Vue.use(DatetimePicker)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Input)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Avatar)
Vue.use(CellGroup)
Vue.use(Cell)
Vue.use(Picker)
Vue.use(MessageBox)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Img)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Divider)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(NoticeBar)
Vue.use(DropMenu)
Vue.use(DropMenuItem)
Vue.use(Search)
Vue.use(Navbar)
Vue.config.productionTip = false
Vue.use(Card)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径  from 从哪个路径跳转过来  next 一个函数，表示放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = content.token
  if (!tokenStr) return next('/login')
  next()
})
