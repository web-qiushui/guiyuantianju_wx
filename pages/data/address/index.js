// pages/crop/index.js
import {verifyForm, verifyMobile} from '../../../utils/util'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userAddress: ['陕西省', '西安市', '未央区'],
        userName:'',
        userPhone:'',
        userAddressDetail: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.userName){
            this.setData({
                userName: options.userName,
                userPhone: options.userPhone,
                userAddress: JSON.parse(options.userAddress),
                userAddressDetail: options.userAddressDetail
            })
        }

    },
    
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    // 名称
    setUserName(e) {
        const userName = e.detail.value
        this.setData({
            userName
        })
    },

    // 手机
    setUserPhone(e) {
        const userPhone = e.detail.value
        this.setData({
            userPhone
        })
    },

    //  地址
    bindRegionChange(e) {
        const userAddress = e.detail.value
        this.setData({
            userAddress
        })
    },

    // 详情
    setUserAddrDetail(e) {
        const userAddressDetail = e.detail.value
        this.setData({
            userAddressDetail
        })
    },
   // 验证表单信息 
    verifyFormData() {
        const userName = this.data.userName
        const userPhone = this.data.userPhone
        const userAddressDetail = this.data.userAddressDetail
        if(userName === ''){
            wx.showToast({
              title: '请填写收货人姓名',
              icon: 'none',
              duration: 2000
            })
            return false
        }

        if(userPhone === ''){
            wx.showToast({
              title: '请填写联系手机号',
              icon: 'none',
              duration: 2000
            })
            return false
        }

        if (!verifyMobile(userPhone)) {
            wx.showToast({
                title: '请输入有效的手机号',
                icon: 'none',
                duration: 2000
              })
              return false
        }

        if(userAddressDetail === ''){
            wx.showToast({
              title: '请填写详细地址',
              icon: 'none',
              duration: 2000
            })
            return false
        }

        return {
            userName,
            userPhone,
            userAddressDetail
        }
    },

    // 确认
    confirm: function() {
        if(!this.verifyFormData()) return
        const userName = this.data.userName
        const userPhone = this.data.userPhone
        const userAddress = this.data.userAddress
        const userAddressDetail = this.data.userAddressDetail

        var pages = getCurrentPages(); //当前页面
        var before = pages[pages.length - 2];
        before.setData({//直接给上移页面赋值
            userName: userName,
            userPhone: userPhone,
            userAddress: userAddress,
            userAddressDetail: userAddressDetail
        });
        wx.navigateBack({
            delta:1
        })
    }
  
})