import storage from '../../../common/storage'
import {
    addCrop,
    updateCrop,
    getPloughDetail,
    getCropDetail
} from '../../../service/manage'

Page({
    data: {
        idx: '',
        midx: 0,
        orders: [],
        detail: {},
        userName: '',
        type: '',
        remark: '',
        edit: '',
        selectValue:'',
        // 作物名称
        name:'',
        // 作物图片
        imageUrl: '',
        // 状态
        status:'',
        // 规格
        specifications:'',
        // 单价
        unitPrice:'',
        // 产量
        amount:'',
         //作物状态(0生长中  1已成熟)
        cropList: [
            {key:'0',value:'生长中'},
            {key:'1',value:'已成熟'}
       ],
        ploughId: '',
        cropId:''

    },

    onLoad(options) {
        // 
        // if(options.ploughList){
        //     console.log(JSON.parse(options.ploughList),'options.ploughList')
        // }
        if(options.ploughid){
            this.setData({
                ploughId: options.ploughid,
                edit: options.cropid === 'null'? false : true
            })
        }
        if(options && options.cropid){
            this.setData({
                cropId: options.cropid
            })
            // 查作物信息
            this.getCropInfo()
        }
    },

    getCropInfo(){
        getCropDetail({
            id: this.data.cropId,
            ploughId: this.data.ploughId
        }).then(res => {
            this.setData({
                name : res.data.name,
                imageUrl : res.data.imageUrl,
                status : res.data.status,
                specifications : res.data.specifications,
                unitPrice :res.data.unitPrice,
                amount : res.data.amount
            })
        }).finally(() => {
            wx.hideLoading()
        })
    },

    submitCrop(){
        let that=this
        // 检验
        let formData={}
        // const formData = that.verifyFormData()
        // if (!formData) return
        let params = {}
        let edit = that.data.edit
        const ploughId = that.data.ploughId
        const name = that.data.name
        const imageUrl = that.data.imageUrl
        const status = that.data.status
        const specifications = that.data.specifications
        const unitPrice = that.data.unitPrice
        const amount = that.data.amount
        if(!edit){
            // const operatorId = storage.getItem('USER_ID')
            formData.ploughId=ploughId
            formData.name = name
            formData.imageUrl = imageUrl
            formData.status = status
            formData.specifications=specifications
            formData.unitPrice=unitPrice
            formData.amount=amount
        } else {
            params.ploughId=ploughId
            params.name = name
            params.imageUrl = imageUrl
            params.status = status
            params.specifications=specifications
            params.unitPrice=unitPrice
            params.amount=amount
        }
        const _this = this
          wx.showModal({
            title: '提示',
            content: '确认提交？',
            success (resData) {
              if (resData.confirm) {
                wx.showLoading({
                title: '正在提交...'
                })
                if(!edit){
                    addCrop(formData).then(res => {
                        if(res.code===200){
                          wx.setStorageSync('crop', formData)
                          _this.goBack()
                        }else{
                          wx.showToast({
                            title: '保存失败',
                            icon: 'none'
                          })
                        }
                    }).finally(() => {
                        wx.hideLoading()
                    })
                    
                } else {
                  params.id = that.data.cropId
                  updateCrop(params).then(res => {
                    if(res.code===200){
                      _this.goBack()
                    }else{
                      wx.showToast({
                        title: '保存失败',
                        icon: 'none'
                      })
                    }
                  }).finally(() => {
                      wx.hideLoading()
                  })
                }
              }
            }
          })    
    },
    goBack(){
      var pages = getCurrentPages(); //当前页面
      var before = pages[pages.length - 2];
      wx.navigateBack({
          success:() => {
          // 执行前一页面的onLoad方法
          before.onLoad(); 
          }
      })
    },
    // 提交工单
    // initSubmitProcessOrder() {
        
    // },
     //上传本地图片
     chooseImage: function (e) {
        var _this = this;
        wx.chooseImage({
        count: 1, // 默认1
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            console.log(res);
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

             // 上传文件
                wx.showLoading({
                    title: '上传中,请稍等...',
                })
                
                let tempFilePaths = res.tempFilePaths
    
                wx.uploadFile({
                    url: 'https://www.sxhjzynykf.cn:8103/backend/common/upload', //上传文件的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                    'user': 'admin'
                    },
                    success (res){
                        wx.hideLoading();
                        let data =JSON.parse(res.data)
                        _this.setData({
                            imageUrl: data.url
                        })
    
                        //do something

                
                    },
                    fail: function(res) {
                        wx.hideLoading()
                        wx.showToast({
                            title: '上传失败，请重新上传',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })
        }
        })
    },

    // 名称
    setCropName(e) {
        const len = e.detail.value
        this.setData({
            name: len
        })
    },

     // 选中作物状态
     bindCropStateChange(e) {
        const value = e.detail.value
        this.setData({
            status: parseInt(value)
        })
    },

    
    // 规格
    setStandard(e) {
        const len = e.detail.value
        this.setData({
            specifications: len
        })
    },
    // 单价
    setValue(e) {
        const len = e.detail.value
        this.setData({
            unitPrice: len
        })
    },
    // 产量
    setOutput(e) {
        const len = e.detail.value
        this.setData({
            amount: len
        })
    },

    cancel() {
        wx.navigateBack({
          delta: 1
        })
    }
})