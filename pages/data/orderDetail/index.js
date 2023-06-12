import storage from '../../../common/storage'
import {verifyForm, verifyMobile} from '../../../utils/util'
import { getOrderDetail,updateOrderStatus } from '../../../service/manage'
Page({
    data: {
        title: '',
        content: '',
        userID: '',
        orderId:'',
        orderDetail: {},
        userType: '',
        list:[
            {
                code:'XX耕地',
                name:'冬500g',
                value:'¥2.3', num:'22',
            },
            {
                code:'XX耕地',
                name:'冬500g',
                value:'¥2.3', 
                num:'22',
            }
        ]
    },
    onLoad: function (options) {
         // this.getDetailByOrderID(productionId)
         if(options.id){
            this.getDetailByOrderID(options.id)
            this.setData({
                orderId: options.id,
                userType:storage.getItem('userType')
            })
         }
    },
    // 获取订单详情
    getDetailByOrderID(id){
        getOrderDetail(id).then( res => {
            this.setData({
              orderDetail: res.data
            })
          }).finally({
              
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

    // 确认收货
    confirmReceipt(){
        let orderId=this.data.orderId
        let userType=this.data.userType
        updateOrderStatus({
            id: orderId,
            status: userType == 1? 2:3
        }).then( res => {
            if(userType == 1){
                wx.showToast({
                    title: '订单已发货',
                    icon: 'success',
                    duration: 2000
                })
            }else{
                wx.showToast({
                    title: '确认收货提交成功',
                    icon: 'success',
                    duration: 2000
                })
            }
            //  刷新订单信息
            this.getDetailByOrderID(orderId)
          }).finally({
              
          }) 
    },

    back(){
        wx.navigateBack({
          delta: 1
        })
    }
})