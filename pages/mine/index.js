import storage from '../../common/storage'
const app = getApp()
Page({
    data: {
        face: '',
        userName: '',
        roleName: '',
        mobile: '',
        isShow: false,
        animationData: ''
    },

    onLoad: function (options) {
        const userName = storage.getItem('USER_NICK_NAME')
        const roleName = storage.getItem('USER_ROLE_NAME')
        const mobile = storage.getItem('USER_MOBILE')
        this.setData({
            userName,
            roleName,
            mobile
        })
    },

    // 退出登录
    logout(){
        storage.removeItem('TOKEN')
        this.createAnimation()
        this.setData({
            isShow: true
        })
    },

    // 确定退出
    confirm() {
        wx.reLaunch({
            url: '/pages/login/index',
        })
    },

    // 取消
    cancel() {
        this.setData({
            isShow: false
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

    // 跳转修改密码页面
    toPage() {
        wx.navigateTo({
          url: '/pages/upwd/index',
        })
    }
})