// pages/login/index.js
const app = getApp()
import storage from '../../common/storage'
import {
  verifyForm,
  verifyMobile
} from '../../utils/util'
import {
  userLogin
} from '../../service/user'
import {
  hexMD5
} from '../../common/md5'
// import { ESTALE } from 'constants'
Page({
  data: {
    isShow: false,
    animationData: null,
    error: {},
    formData: {
      userName: '',
      password: ''
    }
  },

  onLoad: function (options) {

  },

  // 验证规则
  verifyRules() {
    return {
      userName: [{
        required: true,
        errorMsg: '必填'
      }],
      password: [{
        required: true,
        errorMsg: '必填'
      }, {
        max: 16,
        errorMsg: '有误'
      }]
    }
  },

  // 设置yonghuming
  setUserName(e) {
    const userName = e.detail.value
    this.setData({
      ['formData.userName']: userName
    }, () => {
      if (verifyMobile(this.data.formData.userName)) {
        this.setData({
          error: {}
        })
      }
    })
  },

  // 设置密码
  setPassword(e) {
    const pwd = e.detail.value
    this.setData({
      ['formData.password']: pwd
    }, () => {
      if (this.data.formData.password !== '') {
        this.setData({
          error: {}
        })
      }
    })
  },

  // 登录
  login() {
    verifyForm(this.data.formData, this.verifyRules()).then(res => {
      // 验证成功
      this.setData({
        error: {}
      })
      wx.showLoading({
        title: '正在登录...',
      })
      userLogin({
        username: res.userName,
        password: hexMD5(res.password)
      }).then(res => {
        console.log('登录成功返回：', res)
        app.globalData.userInfo = res.data
        console.log(app.globalData.userInfo)
        wx.hideLoading()
        const {
          userType,
          token,
          id
        } = res.data
        storage.setItem('TOKEN', token)

        //判断是管理员还是普通用户

        storage.setItem('userType', userType)
        storage.setItem('userId', id)
        // storage.setItem('USER_NICK_NAME', nickName)
        // storage.setItem('USER_ROLE_NAME', roleName)
        // storage.setItem('USER_MOBILE', mobileNumber)
        this.createAnimation()
        let that = this
        wx.showToast({
          title: '登录成功',
          icon: 'none',
          duration: 1000,
          complete: () => {
            setTimeout(function () {
              wx.hideLoading()
              that.confirm()

            }, 1000)
          }
        })

      })
    }).catch(err => {
      // 验证失败
      this.setData({
        error: err
      })
    })
  },

  // 登陆成功，点击确定
  confirm() {
    wx.reLaunch({
      url: '/pages/home/home',
    })
    // if(false){
    //     wx.switchTab({
    //         url: '/pages/index/index',
    //     })
    // }else{
    //     wx.switchTab({
    //         url: '/pages/record/index',
    //     })
    // }

  },

  // 跳转界面
  linkTo(e) {
    const type = e.currentTarget.dataset.type
    let url = ''
    if (type === 'register') {
      url = '/pages/register/index'
    }
    if (type === 'forgot') {
      url = '/pages/forgot/index'
    }
    wx.navigateTo({
      url
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
  }
})