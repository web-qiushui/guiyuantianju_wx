import {verifyForm} from '../../utils/util'
import {userUpdatePwd} from '../../service/user'
import {hexMD5} from '../../common/md5'
import storage from '../../common/storage'
Page({
    data: {
        isShow: false,
        animationData: null,
        error: {},
        formData: {
            password: '',
            newPassword: '',
            confirmPassword: ''
        }
    },

    onLoad: function (options) {

    },

    // 验证规则
    verifyRules() {
        const rules = {
            password: [{
                required: true,
                errorMsg: '必填'
            }, {
                max: 16,
                errorMsg: '有误'
            }],
            newPassword: [{
                required: true,
                errorMsg: '必填'
            }, {
                max: 16,
                errorMsg: '有误'
            }],
            confirmPassword: [{
                required: true,
                errorMsg: '必填'
            }, {
                max: 16,
                errorMsg: '有误'
            }]
        }
        return rules
    },

    // 设置原密码
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

    // 设置新密码
    setNewPassword(e) {
        const pwd = e.detail.value
        this.setData({
            ['formData.newPassword']: pwd
        }, () => {
            if (this.data.formData.newPassword !== '') {
                this.setData({
                    error: {}
                })
            }
        })
    },

    // // 新旧密码一致性校验
    // validatePass = async(rule, value, callback) => {
    //     if (value.length < 1) {
    //       return callback(new Error('重复密码不能为空！'));
    //     } else if(this.newForm.newPwd !== this.newForm.newAgainPwd){
    //       return callback(new Error('两次输入密码不一致！'));
    //    }else{
    //      callback()
    //    }
    //  }

    // 设置confirm密码
    setConfirmPassword(e) {
        const pwd = e.detail.value
        this.setData({
            ['formData.confirmPassword']: pwd
        }, () => {
            if (this.data.formData.confirmPassword !== '') {
                this.setData({
                    error: {}
                })
            }
        })
    },

    // 修改密码
    updatePwd() {
        verifyForm(this.data.formData, this.verifyRules()).then(res => {
            if(this.data.newPassword !== this.data.confirmPassword){
                this.setData({
                    error: {
                        newPassword: '有误',
                        confirmPassword: '有误'
                    }
                })
                return;
            }
            // 验证成功
            this.setData({
                error: {}
            })
            wx.showLoading({
                title: '正在修改...',
            })
            const USER_ID = storage.getItem('USER_ID')
            let param={
                userId: USER_ID,
                originalPassword: hexMD5(res.password),
                newPassword: hexMD5(res.newPassword),
                checkPassword: hexMD5(res.confirmPassword),
            } 
            console.log('param',param)
            console.log('ccc',storage.getItem('TOKEN'))
            userUpdatePwd({
                userId: USER_ID,
                originalPassword: hexMD5(res.password),
                newPassword: hexMD5(res.newPassword),
                checkPassword: hexMD5(res.confirmPassword),
            }).then(res => {
                storage.removeItem('TOKEN')
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

    // 修改密码成功，点击确定
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