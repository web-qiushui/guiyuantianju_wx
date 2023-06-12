const app = getApp()
import storage from '../../common/storage'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      PageCur: '',
      userType: null,
    },
    NavChange(e) {
      this.setData({
        PageCur: e.currentTarget.dataset.cur
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 如果是管理员
      this.setData({
        userType: storage.getItem('userType')
      })
      if(storage.getItem('userType') === 1){
        this.setData({
          userType: storage.getItem('userType'),
          PageCur:'land'
        })
      }else{
        this.setData({
          userType: storage.getItem('userType'),
          PageCur:'park'
        })
      }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})