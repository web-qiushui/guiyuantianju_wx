import storage from '../../common/storage'
import {
  getPloughList,
  getPloughDetail,
  getLiveStreamByIp,
  submitPlough,
  claimStatus
} from '../../service/manage'
// 获取应用实例
const app = getApp()
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
    ctx: null,
    videoLoad: true,
    videoShow: false,
    videoTimer: null,
    crops: [{
      name: "鲜花",
      state: '生长中',
      value: '¥23.5/500g'
    }, {
      name: "鲜花",
      state: '生长中',
      value: '¥23.5/500g'
    }, {
      name: "鲜花",
      state: '生长中',
      value: '¥23.5/500g'
    }, {
      name: "鲜花",
      state: '生长中',
      value: '¥23.5/500g'
    }],
    userType: null,
    ploughList: [],
    ploughId: "",
    submitLoading: false,
    submitStatus: "",
    submitContext: "",
    ploughDetail: {},
    ploughDetailUrl: "",
    submitContext: '',
    disabled: false
    // pageSize: 10,
    // pageNum: 1
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

    // 1管理 2用户
    this.getPloughList()

    // 如果是管理员
    this.setData({
      userType: storage.getItem('userType')
    })
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this.getPloughList()

      // 如果是管理员
      this.setData({
        userType: storage.getItem('userType')
      })
    },
    hide: function () {},
    resize: function () {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取gengdi
    getPloughList() {
      let that = this
      let params = {
        userType: storage.getItem('userType')
      }
      console.log(params)

      getPloughList(params).then(res => {

        // const data = res.data.records
        // const newlist = this.data.list 
        // console.log(data)
        // data.forEach(v => {
        //     v.date = v.createDate.split(' ')[0]
        // })
        // newlist.push(...data)
        this.setData({
          ploughList: res.data
        })

        app.globalData.ploughList = res.data.records

      }).finally(() => {
        wx.hideLoading()
      })
    },

    //提交
    submit() {
      let ploughId = this.data.ploughId
      let userId = storage.getItem("userId")
      let formData = {
        ploughId,
        userId,
        status: 0
      }
      //this.data.submitLoading = true
      this.setData({
        submitLoading: true
      })
      submitPlough(formData).then(res => {
        this.setData({
          submitStatus: "正在审核",
          submitContext: "工作人员加紧审核中",
          disabled: true
        })
      })
    },

    //  刷新
    refresh(val) {
      val && this.getPloughList()
    },

    //点击显示底部弹出框
    clickLand: function (item) {
      this.setData({
        ploughId: item.currentTarget.dataset.id
      })
      let ploughId = this.data.ploughId
      let userId = storage.getItem("userId")
      claimStatus({
        ploughId: ploughId,
        userId: userId,
        status: 0
      }).then(res => {
        console.log(res)
        if (!res.data) {
          this.setData({
            "submitStatus": "提交认领申请",
            "submitContext": "提交申请通过后即可获得作物购买资格",
            disabled: false
          })
        } else {
          this.setStatusDesc(res.data.status)
          //"submitStatus" =  getStatusDesc(res.data.status);
        }
      })
      // 获取耕地详情
      this.getPloughDetail()

      this.showModal();
    //   wx.hideTabBar({
    //     animation: true,
    //   })
    },

    // 关闭详情
    clickClose: function () {
      this.hideModal();
    //   wx.showTabBar({
    //     animation: true,
    //   })
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
      // 显示tab
    //   wx.showTabBar({
    //     animation: true,
    //   })
    },

    // 种植物
    getPloughDetail: function () {
      //   this.hideModal();
      //   wx.showTabBar({
      //     animation: true,
      //   })
      const ploughId = this.data.ploughId
      getPloughDetail(ploughId).then(res => {
        this.setData({
          ploughDetail: res.data,
          videoLoad: true,
          ploughDetailUrl: res.data.port,
          videoShow: true
        })
        this.data.ctx = wx.createVideoContext('myVideo')
        this.data.ctx.play()

      }).finally({

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
      console.log('playSuccess')
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
      }, 3000);
    },

    statechange(e) {
      console.log('live-player code:', e.detail.code)
    },
    error(e) {
      console.error('live-player error:', e.detail.errMsg)
    },


    setStatusDesc: function (val) {
      if (val === 0) {
        this.setData({
          submitStatus: "正在审核",
          submitContext: "工作人员加紧审核中",
          disabled: true
        })

      }
      if (val === 1) {
        this.setData({
          submitStatus: "审核未通过",
          submitContext: "您的申请未通过，请重新点击申请",
          disabled: true
        })
      }
      if (val === 2) {
        this.setData({
          submitStatus: "审核已通过",
          submitContext: "耕地已经进入播种流程",
          disabled: true
        })
      }
    },
    goChat(e) {
      console.log(e)
      wx.navigateTo({
        url: '../call/chat?userId='+app.globalData.userInfo.id,
      })
    }

  }
})