// 弹窗组件
Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {
        title: String,
        content: String,
        showCancel: {
            type: Boolean,
            value: true
        },
        cancelText: {
            type: String,
            value: '取消'
        },
        confirmText: {
            type: String,
            value: '确定'
        }
    },

    data: {
        isShow: false
    },

    methods: {
        cancel() {
            this.triggerEvent('cancel')
        },
        confirm() {
            this.triggerEvent('confirm')
        }
    }
})