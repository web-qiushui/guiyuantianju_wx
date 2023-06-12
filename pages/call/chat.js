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
    InputBottom: 0,
    msgVal:'',
    userType: null,
    userId: null,
    send: null,
    receive: null,
    current: 1,
    moreType: false,
    msgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    if (options) {
      this.setData({
        userId: options.userId
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 如果是管理员
    this.setData({
      userType: storage.getItem('userType')
    })
    if (this.data.userType === 1) {
      this.setData({
        send: app.globalData.userInfo.adminId,
        receive: this.data.userId
      })
    } else {
      this.setData({
        send: this.data.userId,
        receive: app.globalData.userInfo.adminId
      })
    }

    this.getChatList()
  },

  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },

  msgInput(e){
    this.setData({
      msgVal: e.detail.value
    })
  },
  sendTxt(){
      if(this.data.msgVal == ''){
        wx.showToast({
            title: '请输入发送内容',
            icon: 'none',
            duration: 2000
        })
        return
      }
    this.sendMsg(0)
  },
  sendImg(){
    this.sendMsg(1)
  },
  

  sendMsg(type){
    var that = this;
    const token = storage.getItem('TOKEN')
    wx.request({
      url: baseURL + '/notice/add',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'token': token
      },
      data:{
        send:that.data.send,
        receiver:that.data.receive,
        message:that.data.msgVal,
        messageType:type,
      },
      success(res) {
        console.log(res.data.msg)
        that.setData({
            msgVal:''
        })
        that.getChatList()
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  //获取聊天详情
  getChatList() {
    var that = this;
    const token = storage.getItem('TOKEN')
    wx.request({
      url: baseURL + '/notice/getChatDetails?sendId=' + this.data.send + '&receiverId=' + this.data.receive + '&current=' + this.data.current + '&size=5',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'token': token
      },
      success(res) {
        console.log(res.data.msg)
        if (that.data.current == 1) {
          that.setData({
            msgList: []
          })
        }
        let arr = that.data.msgList
        for (let i = 0; i < res.data.data.records.length; i++) {
          res.data.data.records[i].isAdmin = true
          res.data.data.records[i].name = '管'

          if (res.data.data.records[i].send != app.globalData.userInfo.adminId) {
            res.data.data.records[i].isAdmin = false
            res.data.data.records[i].name = res.data.data.records[i].sendUserName.substr(-1)
          }
          arr.unshift(res.data.data.records[i])
        }
        that.setData({
          msgList: arr,
          moreType: res.data.data.hasNext
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 刷新
  refreshList(){
    this.setData({
      current: 1
    })
    this.getChatList()
  },
  // 查看更多
  moreList(){
    let num = this.data.current +1
    this.setData({
      current: num
    })
    this.getChatList()
  },

    // 头图
    chooseImage: function (e) {
        var _this = this;
        wx.chooseImage({
        count: 1, // 默认1
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            console.log(res);
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

             // 上传文件
                wx.showLoading({
                    title: '上传中,请稍等...',
                })
                
                let tempFilePaths = res.tempFilePaths
    
                wx.uploadFile({
                    url: 'https://www.sxhjzynykf.cn:8103/backend/common/upload', //上传文件的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                    'user': 'admin'
                    },
                    success (res){
                        wx.hideLoading();
                        let data =JSON.parse(res.data)
                        _this.setData({
                            msgVal: data.url
                        })
                        _this.sendImg()
                        //do something

                
                    },
                    fail: function(res) {
                        wx.hideLoading()
                        wx.showToast({
                            title: '上传失败，请重新上传',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })
        }
        })
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