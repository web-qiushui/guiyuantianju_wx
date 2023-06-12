import storage from '../../../common/storage'
import {checkProduction} from '../../../service/product'
Page({
    data: {
        userName: '',
        productionId: '',
        date: '',
        status: [{value: 0, checked: true}, {value: 1, checked: false}],
        state: 0,
        finishedLen: '',
        remark: '',
        isShow: false
    },

    onLoad: function (options) {
        console.log('options',options)
        const productionId = options.productionId
        const userName = storage.getItem('USER_NICK_NAME')
        console.log(userName)
        this.setData({
            userName,
            productionId
        })
    },

    // 设置验收日期
    bindDateChange(e){
        const date = e.detail.value
        this.setData({
            date
        })
    },

    // 设置验收状态
    changeStatus(e) {
        const state = e.detail.value * 1
        this.setData({
            state
        })
    },

    // 设置成品米数
    setFinishedLen(e) {
        const len = e.detail.value * 1
        this.setData({
            finishedLen: len
        })
    },

    // 设置remark
    setRemark(e) {
        const remark = e.detail.value
        this.setData({
            remark
        })
    },

    verifyFormData() {
        const date = this.data.date
        const finishedLen = this.data.finishedLen
        if(date === ''){
            wx.showToast({
              title: '请选择验收日期',
              icon: 'none',
              duration: 2000
            })
            return false
        }

        if(finishedLen === ''){
            wx.showToast({
              title: '请填写成品米数',
              icon: 'none',
              duration: 2000
            })
            return false
        }

        return {
            date,
            finishedLen
        }
    },

    // 提交
    submit() {
        if(!this.verifyFormData()) return
        console.log(this.data)
        const userID = storage.getItem('USER_ID')
        const params = {
            productionId: this.data.productionId,
            checkId: userID,
            checkName: this.data.userName,
            productionNumber: this.data.finishedLen,
            checkStatus: this.data.state,
            remark: this.data.remark
        }
        let that=this
        wx.showModal({
            title: '提示',
            content: '确认提交？提交后信息将不可更改',
            success (resData) {
                if (resData.confirm) {
                    wx.showLoading({
                        title: '正在提交...'
                    })
                    console.log('正在提交...',resData)
                    checkProduction(params).then(res => {
                        console.log('res',res)
                        that.setData({
                            isShow: true
                        }, () => {
                            that.createAnimation()
                        })
                    }).finally(() => {
                        console.log('hideLoading')
                        wx.hideLoading()
                    })
                } else if (resData.cancel) {
                    console.log('用户点击取消')
                }
            }
          }) 
    },

    // 验收成功，点击确定
    confirm() {
        wx.reLaunch({
            url: '/pages/home/home',
        })
    },

    // 创建动画
    createAnimation() {
        var animation = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease',
        })

        animation.opacity(1).step()

        this.setData({
            animationData: animation.export()
        })
    },

    // 返回
    cancel(){
        wx.navigateBack({
          delta: 1
        })
    }
})