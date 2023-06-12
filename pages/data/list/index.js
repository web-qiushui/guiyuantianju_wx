import storage from '../../../common/storage'
Component({
    properties: {
        list: {
            type: Array,
            value: []
        },
        type: {
            type: String,
            value: ''
        },
        userType: {
            type: Number,
            value: null
        }
    },

    data: {
        isShow: false,
        idx: 0,
        list: [],
        total: 0,
        pageNumber: 1,
        pageSize: 10,
        keywords: ''
    },
    methods:{
         // 订单详情
        linkToOrder(e) {
            let id = e.currentTarget.dataset.id
            this.triggerEvent("linkToOrder", id)
        },

        // 认领详情
        linkToRecord(e) {
            let id = e.currentTarget.dataset.id
            let ploughId = e.currentTarget.dataset.ploughid
            this.triggerEvent("linkToRecord", {
                id,
                ploughId
            })
        },
    },
    onLoad: function (options) {
        console.log('this.list',this.list)
    },

    onReachBottom() {
        console.log(this.data.pageNumber, this.data.total, this.data.pageSize,'onReachBottom1')
        if(this.data.pageNumber >= Math.ceil(parseInt(this.data.total) / parseInt(this.data.pageSize))){
            wx.showToast({
              title: '没有更多数据了',
              icon: 'none',
              duration: 1000
            })
            return
        }
        this.setData({
            pageNumber: this.data.pageNumber += 1
        }, () => {
            console.log(this.data.pageNumber, this.data.total, this.data.pageSize,'onReachBottom2')
            wx.showLoading({
              title: '正在加载...',
            })
            this.getProductList()
        })
    },

    // 跳转详情
    linkTo(e) {
        // const pid = e.currentTarget.dataset.pid
        const pid="1111"
        wx.navigateTo({
          url: '/pages/data/orderDetail/index?pid=' + pid,
        })
    }
})