import storage from '../../../common/storage'
import {getProcessOrders,getProductList} from '../../../service/product'
Page({
    data: {
        isShow: false,
        idx: 0,
        status: ['全部', '生产中', '合格', '不合格'],
        list: [],
        total: 0,
        pageSize: 10,
        keywords: ''
    },

    onLoad: function (options) {
       // 获取生产单号
    //    this.getProcessOrders()
    },

    onReachBottom() {
        // if(this.data.pageNumber <= Math.ceil(parseInt(this.data.total) / parseInt(this.data.pageSize))){
            wx.showToast({
              title: '没有更多数据了',
              icon: 'none',
              duration: 1000
            })
            return
        // }
        // this.setData({
        //     pageNumber: pageNumber += 1
        // }, () => {
        //     wx.showLoading({
        //       title: '正在加载...',
        //     })
        //     this.getProcessOrders()
        // })
    },

    // 按生产单号搜索
    search(e) {
        const keywords = e.detail.value
        this.setData({
            keywords
        }, () => {
            wx.showLoading({
              title: '查询中...',
            })
            this.getProcessOrders()
        })
    },

    // 显示筛选
    activeScreen() {
        this.setData({
            isShow: !this.data.isShow
        })
    },

    // 点击状态
    activeScreenItem(e) {
        const index = e.currentTarget.dataset.index
        this.setData({
            idx: index,
            isShow: !this.data.isShow
        }, () => {
            wx.showLoading({
              title: '查询中...'
            })
            this.getProcessOrders()
        })
    },

    // 跳转详情
    linkTo(e) {
        const orderId = e.currentTarget.dataset.item.key
        const index= e.currentTarget.dataset.index+1
        const orderValue = e.currentTarget.dataset.item.value
        console.log('index',index)
        wx.navigateTo({
          url: '/pages/data/write/index?orderId=' + orderId+'&orderIndex='+ index+'&orderValue='+ orderValue,
        })
    },

    // 获取工单列表
    getProcessOrders() {
        const userID = storage.getItem('USER_ID')
        let params = {
            operatorId:'',
            productionNo: this.data.keywords,
        }
        getProcessOrders(params).then(res => {
            this.setData({
                list: [ ...res.content]
            }, () => {
                if(this.data.edit){
                    const arr = this.data.orders.map(v => v.value)
                    const idx = arr.indexOf(this.data.productionNo)
                    console.log(arr)
                    console.log('idx',idx)
                    if(idx !== -1){
                        this.setData({
                            idx
                        }, () => {
                            this.getDetailByOrderID()
                        })
                    }
                }
            })
        }).finally(() => {
            wx.hideLoading()
        })
    }
})