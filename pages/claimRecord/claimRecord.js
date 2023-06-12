const app = getApp()
const util = require('../../utils/util.js')
import {
  baseURL
} from '../../common/config'
import storage from '../../common/storage'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'',
        list:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            id:options.id
        })
        this.getList()
    },
      //获取详情
      getList() {
    var that = this;
    const token = storage.getItem('TOKEN')
    wx.request({
      url: baseURL + '/record/getList/' + this.data.id,
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'token': token
      },
      success(res) {
        console.log(res.data.msg)
        that.setData({
          list: res.data.data
        })
      },
      fail(err) {
        console.log(err)
      }
    })
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