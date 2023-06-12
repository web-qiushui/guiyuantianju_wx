// pages/crop/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        remark:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options && options.textarea) {
            this.setData({
                remark: options.textarea
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

    // 设置remark
    setRemark(e) {
        const remark = e.detail.value
        this.setData({
            remark
        })
    },

    // 确认
    confirm: function() {
        const remark = this.data.remark
        var pages = getCurrentPages(); //当前页面
        var before = pages[pages.length - 2];
        before.setData({//直接给上移页面赋值
            description: remark
        });
        wx.navigateBack({
            delta:1
        })
    }
  
})