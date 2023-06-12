import storage from '../../../common/storage'
import { getClaimDetail, updatePloughState } from '../../../service/manage'

Page({
    data: {
        userType: '',
        claimId:'',
        claimDetail: {},
        list:[{code:'XX耕地',name:'冬500g',value:'¥2.3', num:'22'},
        {code:'XX耕地',name:'冬500g',value:'¥2.3', num:'22'}]
    },

    onLoad: function (options) {
        const claimId = options.id
        const userType = storage.getItem('userType')
        // // const roleName = 'SENDGOODS'
        // this.userID = storage.getItem('USER_ID')
        this.setData({
            claimId: claimId,
            userType: userType
        })
        this.getDetailByClaimId(claimId)
    },

    // 设置备注
    setRemark(e) {
        console.log(e)
        let remark = e.detail.value
        this.setData({
            remark
        })
    },

    // 获取认领详情
    getDetailByClaimId(id) {
        getClaimDetail(id).then(res => {
            console.log('res', res.data)
            // this.$forceUpdate()
            this.setData({
                claimDetail: res.data
            })
        })
    },

    // 通过认领信息 // 通过2 未通过1
    pass(e) {
        const claimId = this.data.claimId    
        updatePloughState({
            id:claimId,
            ploughId: this.data.claimDetail.ploughId,
            userId: this.data.claimDetail.userId,
            status: e.currentTarget.dataset.index
        }).then(res => {
            console.log('res', res.data)
            var pages = getCurrentPages(); //当前页面
            var before = pages[pages.length - 2];
            before.setData({//直接给上移页面赋值
                change: true
            });
            wx.navigateBack({
                delta: 1
            })
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