// app.js
import storage from './common/storage'
App({
  // 全局通用数据
  globalData: {
    orderBack: false,
    userInfo:null
  },

  onLaunch() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    console.log('系统本地存储 =================>>> \n', storage.getAll())
    console.log(storage.getItem('TOKEN'))
    // // 判断是否登录
    // const token = storage.getItem('TOKEN')
    // // 后期删掉
    // // wx.switchTab({
    // //   url: '/pages/index/index',
    // // })
    // if (token &&  token!='') {
    //   wx.reLaunch({
    //     url: '/pages/home/home',
    //   })
    // }else{
    //   wx.redirectTo({
    //     url: '/pages/login/index',
    //   })
    //   return
    // }
  },
})