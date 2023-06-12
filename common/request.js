import storage from '../common/storage'

class Request {
    constructor(opts) {
        this.baseURL = opts.baseURL
        this.header = {
            ...opts.header
        }
    }

    request({
        url,
        data = {},
        method = 'GET',
        header = {}
    }) {
        return new Promise((resolve, reject) => {
            const token = storage.getItem('TOKEN')
            header.token = token ? token : '',
            wx.request({
                url: this.baseURL + url,
                data,
                method,
                header: Object.assign(this.header, header),
                success: (res) => {
                    if(res.statusCode == 200){
                        const {code, msg} = res.data
                        if(code == 200){
                            resolve(res.data)
                            return
                        }
                        this.statusHandle(code, msg)
                        return
                    }
                    this.statusHandle(res.statusCode, res.data.msg)
                },
                fail(err) {
                    reject(err)
                }
            })
        })
    }

    get(url, data = {}, header = {}) {
        return this.request({
            url,
            data,
            method: 'GET',
            header
        })
    }

    post(url, data = {}, header = {}) {
        return this.request({
            url,
            data,
            method: 'POST',
            header
        })
    }

    statusHandle(code, msg) {
        if(code == 500){
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })
            return;
        }

        if(code == 404){
            wx.showToast({
              title: '服务器资源丢失，请重试',
              icon: 'none',
              duration: 2000
            })
            return;
        }

        if(code == 405 || code == 401){
            wx.showToast({
              title: '用户未登录或登录已失效，请重新登录',
              icon: 'none',
              duration: 2000
            })
            storage.removeItem('TOKEN')
            wx.navigateTo({
              url: '/pages/login/index',
            })
            return;
        }

        if(code == 301){
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })
            return;
        }

        if(code == 422){
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })
            return;
        }

        if(code == 424){
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })
            return;
        }

        if(code == 425){
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })
            return;
        }

        if(code == 207){
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })
            return;
        }else{
            wx.showToast({
                title: msg,
                icon: 'none',
                duration: 2000
              })
              return;
        }
    }
}

export default Request