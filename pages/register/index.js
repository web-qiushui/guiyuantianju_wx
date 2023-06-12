import {verifyForm, verifyMobile} from '../../utils/util'
import {userRegister, getRegisterCode} from '../../service/user'
import {hexMD5} from '../../common/md5'
let timer = null
Page({
    data: {
        isShow: false,
        animationData: null,
        error: {},
        time: 60,
        info: '发送验证码',
        formData: {
            name:'',
            userName: '',
            mobile: '',
            password: '',
            verifyCode: ''
        }
    },

    onLoad: function (options) {
        console.log('register load')
    },

    // 验证规则
    verifyRules(isVerify = 'verifyCode') {
        const rules = {
            userName: [{
                required: true,
                errorMsg: '必填'
            }],
            name: [{
                required: true,
                errorMsg: '必填'
            }],
            // mobile: [{
            //     required: true,
            //     errorMsg: '必填'
            // }, {
            //     isMobile: true,
            //     errorMsg: '有误'
            // }, {
            //     max: 11,
            //     errorMsg: '有误'
            // }],
            password: [{
                required: true,
                errorMsg: '必填'
            }, {
                max: 16,
                errorMsg: '有误'
            }]
        }
        if (isVerify === 'login') {
            // rules.verifyCode = [{
            //     required: true,
            //     errorMsg: '必填'
            // },
            // {
            //     max: 6,
            //     errorMsg: '有误'
            // }]
        }
        return rules
    },

    // 设置yyonghu
    setUserName(e) {
        const userName = e.detail.value
        this.setData({
            ['formData.userName']: userName
        }, () => {
            if (this.data.formData.userName !== '') {
                this.setData({
                    error: {}
                })
            }
        })
    },

     // 设置姓名
     setName(e) {
        const name = e.detail.value
        this.setData({
            ['formData.name']: name
        }, () => {
            if (this.data.formData.name !== '') {
                this.setData({
                    error: {}
                })
            }
        })
    },

    // 设置手机号
    setMobile(e) {
        const mobile = e.detail.value
        this.setData({
            ['formData.mobile']: mobile
        }, () => {
            if (verifyMobile(this.data.formData.mobile)) {
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

    // 设置验证码
    setVerifyCode(e) {
        const verifyCode = e.detail.value
        this.setData({
            ['formData.verifyCode']: verifyCode
        }, () => {
            if (this.data.formData.verifyCode !== '') {
                this.setData({
                    error: {}
                })
            }
        })
    },

    // 发送验证码
    sendVerifyCode() {
        if(this.data.time < 60) return
        let formData = this.data.formData
        delete formData.verifyCode
        verifyForm(formData, this.verifyRules()).then(res => {
            console.log('this.data.time',this.data.time)
            // 验证成功
            this.setData({
                error: {}
            })
            timer = setInterval(() => {
                if(this.data.time <= 1){
                    clearInterval(timer)
                    this.setData({
                        time: 60,
                        info: '发送验证码'
                    })
                    return
                }
                this.setData({
                    time: this.data.time - 1,
                    info: (this.data.time - 1) + 's'
                })
                // wx.showToast({
                //     title: '验证码接口正在开发中',
                //     icon: 'none'
                // })
            }, 1000)
            // wx.showLoading({
            //     title: '正在登录...',
            // })
            getRegisterCode({
                phoneNumbers: res.mobile,
            }).then(res => {
                console.log(res)
                wx.hideLoading()
                if(res.code==='200'){
                     wx.showToast({
                        title: '验证码发送成功！',
                        icon: 'none'
                     })
                }
            }).catch(err => {
                wx.hideLoading()
                // 业务逻辑出错
                wx.showToast({
                    title: err.message,
                    icon: 'none',
                    duration: 2000
                })
            })
        }).catch(err => {
            // 验证失败
            this.setData({
                error: err
            })
        })
    },

    // 注册
    register() {
        verifyForm(this.data.formData, this.verifyRules('login')).then(res => {
            // 验证成功
            this.setData({
                error: {}
            })
            wx.showLoading({
                title: '正在注册...',
            })
            userRegister({
                username: res.userName,
                name: res.name,
                password: hexMD5(res.password),
            }).then(res => {
                this.createAnimation()
                this.setData({
                    isShow: true
                })
            }).finally(() => {
                wx.hideLoading()
            })
        }).catch(err => {
            console.log(err)
            // 验证失败
            this.setData({
                error: err
            })
        })
    },

    // 注册成功，点击确定
    confirm() {
        wx.redirectTo({
            url: '/pages/login/index',
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