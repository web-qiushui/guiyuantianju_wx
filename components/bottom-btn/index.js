// 弹窗组件
Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {
        text: String,
        content: String,
        disabled: Boolean
    },
    // observers: {
    //     disabled(val) {
    //       this.setData({
    //         disabled: val
    //       })
    //     },
    // },
    data: {
        isShow: false
    },

    methods: {
        confirm() {
            this.triggerEvent('confirm')
        }
    }
})