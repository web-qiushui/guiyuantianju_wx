const app = getApp()
const util = require('../../utils/util.js')
import {
  baseURL
} from '../../common/config'
import storage from '../../common/storage'
Component({

  options: {
    addGlobalClass: true,
  },
  data: {
    userType:null,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    list: []
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在 methods 段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在 methods 段中定义的方法名
  attached: function () {}, // 此处 attached 的声明会被 lifetimes 字段中的声明覆盖
  ready: function () {
    this.getUserList()
     // 如果是管理员
     this.setData({
      userType: storage.getItem('userType')
    })
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {

        this.getUserList()
    },
    hide: function () {},
    resize: function () {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取列表
    getUserList() {
      let that = this
      const token = storage.getItem('TOKEN')
      wx.request({
        url: baseURL + '/notice/getMessage',
        method: 'GET',
        header: {
          'content-type': 'application/json', // 默认值
          'token': token
        },
        success(res) {

          // for (let i = 0; i < res.data.data.length; i++) {
          //   res.data.data[i].create_time = util.formatTime(res.data.data[i].create_time)
          // }
          console.log(res.data.msg)
          that.setData({
            list: res.data.data
          })
          console.log(that.data.list)
        },
        fail(err) {
          console.log(err)
        }
      })

    },
    goChat(e) {
      var id = ''

      if(app.globalData.userInfo.adminId == e.currentTarget.dataset.receive){
        id = e.currentTarget.dataset.send
      }else {
        id = e.currentTarget.dataset.receive
      }

      console.log(e)
      wx.navigateTo({
        url: '../call/chat?userId='+id,
      })
    }
  }
})