import storage from '../../../common/storage'
import { getOrderDetail, addOrder } from '../../../service/manage'
const app = getApp()
Page({
    data: {
        title: '',
        content: '',
        userID: '',
        ploughId:'',
        orderDetail: {
            orderEntities:[]
        },
        num:1,
        minusStatus:'disable',
        orderEntities:[],
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
        ],
        // 地址
        userAddress: ['陕西省', '西安市', '未央区'],
        userName:'',
        userPhone:'',
        userAddressDetail: '',
        loadingBtn: false, //按钮loading
    },
    onLoad: function (options) {
         // this.getDetailByOrderID(productionId)
        //  if(options.id){
        //     this.getDetailByOrderID(options.id)
        //     this.setData({
        //         ploughId: options.id
        //     })
        //  }
         if(options.crop){
             let crop = JSON.parse(options.crop)
             crop.forEach((item, index)=>{
                item.cropId= item.id,
                item.num= 1,
                item.minusStatus='disable',
                item.cropUnitPrice = item.unitPrice
             })
             this.setData({
                orderEntities : crop,
                ploughId:crop[0].ploughId
             })
             console.log('orderDetail.orderEntities', this.data.orderEntities)
         }
    },
    onShow: function () {
       
    },

    getDetailByOrderID(id){
        getOrderDetail(id).then( res => {
            this.setData({
              orderDetail: res.data
            })
          }).finally({
              
          }) 
    },
    // 下，点击确定
    confirm() {
        const userName = this.data.userName
        const userPhone = this.data.userPhone
        const userAddress = this.data.userAddress.join('')
        const userAddressDetail = this.data.userAddressDetail
        const ploughId = this.data.ploughId
        const crops = this.data.orderEntities
        console.log('crops', crops)
        let params={
            userName:userName,
            userPhone:userPhone,
            userAddress:userAddress,
            userAddressDetail:userAddressDetail,
            status:1,
            ploughId:ploughId,
            orderEntities:crops
        }
        this.setData({
            loadingBtn: true
        })
        addOrder(params).then(res => {
            if(res.code===200){
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000
                })
            }    

            // 下单成功后，跳转到订单页面          
            // app.globalData.orderBack= true

            setTimeout(()=> {
                // wx.switchTab({
                //     url: '/pages/record/index',
                // })
                wx.reLaunch({
                  url: '/pages/home/home',
              })
             },1500)
            //  loading设为false
             this.setData({
                loadingBtn: false
            })
        }).catch((err)=>{
            // 业务逻辑出错
            wx.showToast({
                title: err.message,
                icon: 'none',
                duration: 2000
            })
        }).finally(()=>{
            this.setData({
                loadingBtn: false
            })
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

    // 添加地址
    addAddress() {
        const userName = this.data.userName
        if(userName){
            // userName: userName,
            // userPhone: userPhone,
            // userAddress: userAddress,
            // userAddressDetail: userAddressDetail
            const userPhone = this.data.userPhone
            const userAddress = this.data.userAddress
            const userAddressDetail = this.data.userAddressDetail
            wx.navigateTo({
                url: '/pages/data/address/index?userName='+ userName+'&userPhone='+ userPhone+'&userAddress='+ JSON.stringify(userAddress)+'&userAddressDetail='+ userAddressDetail
            })
        }else{
            wx.navigateTo({
                url: '/pages/data/address/index'
            })
        }
    },

    /*点击减号*/
    bindMinus: function(e) {
        let index = e.currentTarget.dataset.index;

        var num = this.data.orderEntities[index].num;
        if (num>1) {
            num--;
        }
        var minusStatus = num>1 ? 'normal':'disable';
        let currentNum = "orderEntities[" + index+ "].num";
        let currentMinusStatus= "orderEntities[" + index+ "].minusStatus";
        this.setData({
            [currentNum]: num,
            [currentMinusStatus]: minusStatus
        })
        console.log('1',this.data.orderEntities)
    },
    /*点击加号*/
    bindPlus: function(e) {
        console.log(e)
        let index = e.currentTarget.dataset.index;
        var num = this.data.orderEntities[index].num;
        console.log('num', num)
        num++;

        var minusStatus = num > 1 ? 'normal' : 'disable';
        let currentNum = "orderEntities[" + index+ "].num";
        let currentMinusStatus= "orderEntities[" + index+ "].minusStatus";
        this.setData({
            [currentNum]: num,
            [currentMinusStatus]: minusStatus
        })
        console.log('2',this.data.orderEntities)
    },
    /*输入框事件*/
    bindManual: function(e) {
        let index = e.currentTarget.dataset.index;
        var num = this.data.orderEntities[index].num;
        var minusStatus = num > 1 ? 'normal' : 'disable';

        let currentNum = "orderEntities[" + index+ "].num";
        let currentMinusStatus= "orderEntities[" + index+ "].minusStatus";
        this.setData({
            [currentNum]: num,
            [currentMinusStatus]: minusStatus
        })
    },

    back(){
        wx.navigateBack({
          delta: 1
        })
    }
})