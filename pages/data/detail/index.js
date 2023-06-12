import storage from '../../../common/storage'
import {getDetailByOrderID} from '../../../service/product'
import {sendGoods, deleteOrder} from '../../../service/product'
Page({
    data: {
        roleName: '',
        detail: {},
        remark: '',
        nums: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
        title: '',
        content: '',
        isShow: false,
        isArea: false,
        isFocus: false,
        checkIdInfoFlag: false,
        operatorIdInfoFlag: false,
        sendIdInfoFlag: false,
        userID: '',
    },

    onLoad: function (options) {
        const productionId = options.pid
        const roleName = storage.getItem('USER_ROLE_NAME')
        // const roleName = 'SENDGOODS'
        this.userID = storage.getItem('USER_ID')
        this.setData({
            roleName
        })
        this.getDetailByOrderID(productionId)
    },

    // 设置备注
    setRemark(e) {
        console.log(e)
        let remark = e.detail.value
        this.setData({
            remark
        })
    },

    // 获取生产计划详情
    getDetailByOrderID(productionId) {
        getDetailByOrderID(productionId).then(res => {
            console.log('res', res)
            const data = res.content
            const roleName = this.data.roleName
            const checkIdInfo =  data.production.checkIdInfo
            const operatorIdInfo = data.production.operatorIdInfo
            const sendIdInfo = data.production.sendIdInfo 
            // this.$forceUpdate()
            if(checkIdInfo.indexOf(this.userID) > -1){
                this.setData({
                    checkIdInfoFlag: true
                })
            }else{
                this.setData({
                    checkIdInfoFlag: false
                })
            }
            
            if(operatorIdInfo.indexOf(this.userID) > -1){
                this.setData({
                    operatorIdInfoFlag: true
                })
            }else{
                this.setData({
                    operatorIdInfoFlag: false
                })
            }
            if(sendIdInfo.indexOf(this.userID) > -1){
                this.setData({
                    sendIdInfoFlag: true
                })
            }else{
                this.setData({
                    sendIdInfoFlag: false
                })
            }

            if(roleName === 'MANAGER' || roleName === 'USER'){
                this.setData({
                    detail: data
                })
            } else if(roleName === 'EXAMINER') {
                if(data.production.checkInfo != undefined &&  JSON.stringify(data.production.checkInfo) != '{}'){
                    this.setData({
                        detail: data,
                        checkIdInfoFlag: false
                    })
                }else{
                    this.setData({
                        checkIdInfoFlag: true,
                        detail: {
                            production: {
                                id: data.production.id,
                                specification:data.production.specification,
                                modelNumber: data.production.modelNumber,
                                planNumber: data.production.planNumber,
                                planSendDateMsg: data.production.planSendDateMsg,
                                productionNo: data.production.productionNo
                            },
                            recordList: data.recordList
                        }
                    })
                }
            } else if(roleName === 'SENDGOODS') {
                if(data.production.sendInfo != undefined && JSON.stringify(data.production.sendInfo) != '{}'){
                    this.setData({
                        detail: data,
                        sendIdInfoFlag: false
                    })
                }else{
                    this.setData({
                        sendIdInfoFlag: true,
                        detail: {
                            production: {
                                id: data.production.id,
                                specification:data.production.specification,
                                modelNumber: data.production.modelNumber,
                                planNumber: data.production.planNumber,
                                planSendDateMsg: data.production.planSendDateMsg,
                                productionNo: data.production.productionNo,
                                checkStatusMsg: data.production.checkStatusMsg,
                                checkInfo: data.production.checkInfo
                            }
                        }
                    })
                }  
            }
        })
    },

    // 设置textarea，解决层级过高的低级问题
    setTextarea() {
        this.setData({
            isArea: true,
            isFocus: true
        })
    },

    // textarea失去焦点
    blur() {
        this.setData({
            isArea: false,
            isFocus: false
        })
    },

    // 修改详情
    updateDetail(){
        const productionNo = this.data.detail.production.productionNo
       wx.navigateTo({
         url: '/pages/data/write/index?type=edit&productionNo=' 
         + productionNo
       })
    },

    // 删除详情
    deleteDetail() {
        const paramId = this.data.detail.production.id
        let that=this
          wx.showModal({
            title: '确认删除',
            content: '删除后将不可恢复',
            success (resData) {
              if (resData.confirm) {
                wx.showLoading({
                    title: '正在删除...',
                  })
                  console.log(paramId)
                  deleteOrder(paramId).then(res => {
                    console.log(res)
                    that.setData({
                          title: '删除工单',
                          content: '删除成功',
                          isShow: true
                      }, () => {
                        that.createAnimation()
                      })
                  }).finally(() => {
                      wx.hideLoading()
                  })
              } else if (resData.cancel) {
                console.log('用户点击取消')
              }
            }
          }) 
    },

    // 返回上一页
    back() {
        wx.navigateBack({
          delta: 1
        })
    },

    // 验收
    examineDetail(e) {
        const id = e.currentTarget.dataset.prono
        console.log("e.currentTarget.dataset",e.currentTarget.dataset)
        wx.navigateTo({
          url: '/pages/data/check/index?productionId=' + id,
        })
    },

    // 发货
    sendGoods() {
        const userID = storage.getItem('USER_ID')
        const userName = storage.getItem('USER_NICK_NAME')
        const id = this.data.detail.production.id
        const remark = this.data.ramark
        const params = {
            productionId: id,
            sendId: userID,
            sendName: userName,
            remark
        }
        let that=this
        wx.showModal({
          title: '提示',
          content: '确认发货？提交后信息将不可更改',
          success (resData) {
            if (resData.confirm) {
                wx.showLoading({
                title: '正在发货...',
                })
                console.log(params)
                sendGoods(params).then(res => {
                    console.log(res)
                    if(res.content === 1){
                        that.setData({
                            title: '发货',
                            content: '发货成功',
                            isShow: true
                        }, () => {
                            that.createAnimation()
                        })
                    } else {
                        wx.showToast({
                        title: '该工单已发货',
                        icon: 'none',
                        duration: 2000
                        })
                    }
                }).finally(() => {
                    wx.hideLoading()
                })
            } else if (resData.cancel) {
                console.log('用户点击取消')
            }
            }
        }) 
    },

    // 发货成功，点击确定
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

    back(){
        wx.navigateBack({
          delta: 1
        })
    }
})