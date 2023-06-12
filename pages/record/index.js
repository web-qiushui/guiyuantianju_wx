const app = getApp()
var startPoint
import storage from '../../common/storage'
import {
  getOrderList,
  getRecordList,
  getPloughDetail,
  getClaimState,
  resolveOrder
} from '../../service/manage'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },


  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    ctx: null,
    videoLoad: true,
    videoShow: false,
    videoTimer: null,
    // 传入 tabs 组件的数据
    tabList: [{
        name: '订单',
        type: 1
      },
      {
        name: '认领',
        type: 2
      }
    ],
    currentTab: 1,
    orderList: [],
    recordList: [],
    change: null,
    userType: null,
    ploughDetail: {},
    ploughDetailUrl: '',
    submitStatus: '',
    submitContext: '',
    showCrop: false,
    chooseItem: false,
    disabledBtn: false,
    selectClaimPloughId: '',
    selectClaimId: '',
    //按钮位置参数
    buttonTop: 0,
    buttonLeft: 0,
    windowHeight: '',
    windowWidth: ''
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在 methods 段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
  },

  // 生命周期函数，可以为函数，或一个在 methods 段中定义的方法名
  attached: function () {}, // 此处 attached 的声明会被 lifetimes 字段中的声明覆盖
  ready: function () {
    this.setData({
      userType: storage.getItem('userType')
    })
    this.getOrderList()
    this.getRecordList()
    this.getSystemInfo()
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.getOrderList()
      this.getRecordList()
      // if(app.globalData.orderBack){
      //   this.hideModal();
      //   wx.showTabBar({
      //     animation: false,
      //   })
      //   app.globalData.orderBack= false
      // }
      if (this.data.showModalStatus) {
        // wx.hideTabBar({
        //   animation: true,
        // })
      } else {
        // wx.showTabBar({
        //   animation: true,
        // })
      }
    },
    hide: function () {},
    resize: function () {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 选择类型
    handleSwitch(e) {
      console.log(e) // { name: '即将上映', type: 0}
      this.currentTab = e.detail.type
      console.log(this.currentTab)
      this.setData({
        currentTab: e.detail.type
      })
      // 刷新记录
      this.getOrderList()
      this.getRecordList()
    },
    // 跳转认领记录
    linkToRecord(e) {
      let userType = this.data.userType
      // 管理员跳转认领记录
      if (userType === 1) {
        wx.navigateTo({
          url: '/pages/data/claimDetail/index?id=' + e.detail.id,
        })
      } else if (userType === 2) {
        // 用户
        this.clickLand(e.detail.ploughId, e.detail.id)
        this.setData({
          selectClaimPloughId: e.detail.ploughId,
          selectClaimId: e.detail.id,
        })

      }
    },
    // 跳转订单记录
    linkToOrder(e) {
      console.log(e.detail)
      wx.navigateTo({
        url: '/pages/data/orderDetail/index?id=' + e.detail,
      })
    },

    // 点击显示底部弹出框
    clickLand: function (ploughId, id) {
      let userId = storage.getItem("userId")
      // 获取耕地详情

      getClaimState(id).then(res => {
        console.log(res)
        if (res.data) {
          this.setStatusDesc(res.data.status)
        }
      })
      this.getPloughDetail(ploughId)
      this.showModal();
    //   wx.hideTabBar({
    //     animation: true,
    //   })
    },

    // 关闭详情
    clickClose: function () {
      this.hideModal();
    },

    // 设置按钮状态
    setStatusDesc: function (val) {
      if (val === 0) {
        this.setData({
          submitStatus: "正在审核",
          submitContext: "工作人员加紧审核中",
          disabledBtn: true
        })
      } else if (val === 1) {
        this.setData({
          submitStatus: "审核未通过",
          submitContext: "您的申请未通过，请重新点击申请",
          disabledBtn: false
        })
      } else if (val === 2) {
        this.setData({
          submitStatus: "审核已通过",
          submitContext: "耕地已经进入播种流程",
          disabledBtn: true
        })
      } else if (val === 3 || val === 4) {
        this.setData({
          submitStatus: "去下单",
          submitContext: "",
          showCrop: true,
          disabledBtn: false
        })
      }
      console.log(this.data)
    },

    // 种植物
    getPloughDetail: function (ploughId) {
      //   this.hideModal();
      //   wx.showTabBar({
      //     animation: true,
      //   })
      getPloughDetail(ploughId).then(res => {
        this.setData({
          ploughDetail: res.data,
          videoLoad: true,
          videoShow: true
        })
        this.data.ctx = wx.createVideoContext('myVideo')
        this.data.ctx.play()

      })
    },

    // 种植物
    getLiveStreamByIp: function () {
      this.setData({
        videoShow: true
      })
      let that = this
      let data = {
        channelName: this.data.ploughDetail.name,
        channelStream: '101',
        ip: this.data.ploughDetail.port
      }
      const token = storage.getItem('TOKEN')
      wx.request({
        url: 'https://www.sxhjzynykf.cn:8103/api/camera/linux/convert', //仅为示例，并非真实的接口地址
        data: data,
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'token': token
        },
        success(res) {
          that.setData({
            ploughDetailUrl: res.data.data
          })
          that.data.ctx = wx.createVideoContext('myVideo')
          that.data.ctx.play()
        },
        fail(err) {
          console.log(err)
        }
      })

    },

    playSuccess() {
      clearTimeout(this.data.videoTimer)
      this.setData({
        videoLoad: false
      })
    },
    playError() {
      console.log('playerror')
      let that = this
      this.data.videoTimer = setTimeout(function () {
        console.log('videoTimer')
        that.setData({
          videoShow: false
        })
        that.getLiveStreamByIp()
      }, 3000);
    },

    // 选中
    addCrop(e) {
      let item = e.currentTarget.dataset.item
      let index = e.currentTarget.dataset.index
      if (item.status === 1) {
        // 点击过 有的元素删除 没有的元素增加
        // 选中
        let change = "ploughDetail.cropEntities[" + index + "].active";
        this.setData({
          [change]: !item.active
        })
        // this.setData({
        //   chooseItem: true,
        //   selectCrops: [],
        // })
      } else {
        wx.showToast({
          title: '该作物在成长中',
          icon: 'none'
        })
      }
    },

    //提交
    submit() {
      // let ploughId = this.data.ploughId
      // let userId = storage.getItem("userId")
      // let formData = {ploughId,userId,status:0}
      // //this.data.submitLoading = true
      // this.setData({
      //   submitLoading:true
      // })
      // submitPlough(formData).then( res => {
      //     this.setData({"submitStatus":"正在审核"})
      // }) 
      // 两种情况 未通过再次审核 去下单
      let crops = this.data.ploughDetail.cropEntities
      let selectCrops = []
      crops.forEach(item => {
        if (item.active) {
          selectCrops.push(item)
        }
      })
      console.log('selectCrops', selectCrops)
      wx.navigateTo({
        url: '/pages/data/userOrderDetail/index?crop=' + JSON.stringify(selectCrops)
      })
    },
    // 取消订单
    closeOrder() {
      let that = this
      let obj = {
        ploughId: this.data.ploughDetail.id,
        userId: app.globalData.userInfo.id
      }
      resolveOrder(obj).then(res => {
        console.log(res)
        if (res.code === 200) {
          that.hideModal()
          that.getOrderList()
          that.getRecordList()
        }
      })
    },

    // 订单列表
    getOrderList() {
      getOrderList(app.globalData.userInfo.id).then(res => {
        this.setData({
          orderList: res.data
        })
      })
    },

    // 认领列表
    getRecordList() {
      let userType = this.data.userType
      getRecordList(userType).then(res => {
        this.setData({
          recordList: res.data
        })
      }).finally({

      })
    },

    //显示对话框
    showModal: function () {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },

    //隐藏对话框
    hideModal: function () {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false,
          videoShow: false
        })
        clearTimeout(this.data.videoTimer)
      }.bind(this), 200)
      // tab隐藏
    //   wx.showTabBar({
    //     animation: true,
    //   })
    },

    // 退出登录
    logout() {
      storage.removeItem('TOKEN')
      storage.removeItem('userId')
      storage.removeItem('userType')
      wx.redirectTo({
        url: '/pages/login/index',
      })
    },
    //以下是按钮拖动事件
    buttonStart: function (e) {
      startPoint = e.touches[0] //获取拖动开始点
    },
    buttonMove: function (e) {
      var endPoint = e.touches[e.touches.length - 1] //获取拖动结束点
      //计算在X轴上拖动的距离和在Y轴上拖动的距离
      var translateX = endPoint.clientX - startPoint.clientX
      var translateY = endPoint.clientY - startPoint.clientY
      startPoint = endPoint //重置开始位置
      var buttonTop = this.data.buttonTop + translateY
      var buttonLeft = this.data.buttonLeft + translateX
      //判断是移动否超出屏幕
      if (buttonLeft + 50 >= this.data.windowWidth) {
        buttonLeft = this.data.windowWidth - 50;
      }
      if (buttonLeft <= 0) {
        buttonLeft = 0;
      }
      if (buttonTop <= 0) {
        buttonTop = 0
      }
      if (buttonTop + 50 >= this.data.windowHeight) {
        buttonTop = this.data.windowHeight - 50;
      }
      this.setData({
        buttonTop: buttonTop,
        buttonLeft: buttonLeft
      })
    },
    buttonEnd: function (e) {},
    getSystemInfo() {
      var that = this;
      wx.getSystemInfo({
        success: function (res) {
          // 屏幕宽度、高度
          console.log('height=' + res.windowHeight);
          console.log('width=' + res.windowWidth);
          // 高度,宽度 单位为px
          that.setData({
            windowHeight: res.windowHeight,
            windowWidth: res.windowWidth,
            buttonTop: res.windowHeight * 0.70, //这里定义按钮的初始位置
            buttonLeft: res.windowWidth * 0.70, //这里定义按钮的初始位置
          })
        }
      })
    }
  }
})