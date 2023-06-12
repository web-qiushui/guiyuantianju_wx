import storage from '../../../common/storage'
import {
    addPlough,
    updatePlough,
    getPloughDetail
} from '../../../service/manage'

Page({
    data: {
        ctx:null,
        videoLoad:false,
        videoShow:false,
        videoTimer: null,
        idx: '',
        midx: 0,
        detail: {},
        remark: '',
        edit: false,
        selectValue:'',
        port:'',
        // 耕地名称
        name:'',
        // 耕地图片
        imgUrl: '',
        // 耕地简介
        description:'',
        ploughList:{},
        cropEntities:[],
        status: null
    },

    onLoad(options) {
        // 文本框
        console.log('options',options)
        if(options && options.textarea) {
            this.setData({
                description: options.textarea
            })
            console.log(options.textarea)
        }
        // id 耕地id
        if(options && options.id){
            this.setData({
                edit: true,
                idx: options.id
                // 编辑回填
            })
        }
        // 根据id查详情
        this.getPloughDetail()
        
    },

     // 种植物
     getLiveStreamByIp: function () {
        this.setData({
            videoShow:true
        })
        let that = this
        let data = {
            channelName: this.data.name,
            channelStream: '101',
            ip: this.data.port
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
    
    playSuccess(){
        clearTimeout(this.data.videoTimer)
        this.setData({
            videoLoad:false
        })
    },
    playError(){
        console.log('playerror')
        let that =this
        this.data.videoTimer=setTimeout(function(){
            console.log('videoTimer')
            that.setData({
                videoShow:false
            })
            that.getLiveStreamByIp()
        }, 3000);  
    },

  


    // 根据单号获取详情
    getPloughDetail() {
        // if (this.data.idx == 0) return
        let id= this.data.idx
        getPloughDetail(id).then(res => {
            if(res.data){
                this.setData({
                    status: res.data.status,
                })
                // 回填
                this.handleDetail(res.data)
            }
            
        })
    },
    handleDetail(data){
        this.setData({
            name: data.name,
            imgUrl: data.imageUrl,
            description: data.description,
            cropEntities: data.cropEntities,
            ploughDetailUrl:data.port,
            videoShow:true,
            videoLoad:true
        })

        this.data.ctx = wx.createVideoContext('myVideo')
        this.data.ctx.play()
        // this.getLiveStreamByIp()
    },

    // 表单校验
    // 验证表单信息 
    verifyFormData() {
        const name = this.data.name
        if(name === ''){
            wx.showToast({
              title: '请填写耕地名称',
              icon: 'none',
              duration: 2000
            })
            return false
        }

        return {
            name
        }
    },


    submitPlough(){
        if(!this.verifyFormData()) return
        let that=this
        var formData={}
        // 校验表单
        // const formData = that.verifyFormData()
        // if (!formData) return
        let params = {}
        let edit = that.data.edit
        const name = that.data.name
        const imageUrl = that.data.imgUrl
        const description = that.data.description
        if(!edit){
            // const operatorId = storage.getItem('USER_ID')
            formData.name = name
            // "status":0,  //1 认领，0不认领
            formData.status = 0
            formData.imageUrl = imageUrl
            formData.description = description
        } else {
            params.id= that.data.idx
            params.name = name
            params.status = that.data.status
            params.imageUrl = imageUrl
            params.description = description
        }
          wx.showModal({
            title: '提示',
            content: '确认提交？',
            success (resData) {
              if (resData.confirm) {
                
                wx.showLoading({
                    title: '正在提交...'
                })
                if(!edit){
                    addPlough(formData).then(res => {
                        wx.showToast({
                            title: '提交成功',
                            icon: 'success',
                            duration: 2000
                        })
                        let pages = getCurrentPages(); //当前页面
                        let before = pages[pages.length - 1];
                        // wx.navigateBack({
                        //     delta: 1,
                        //     success:() => {
                        //         // 执行前一页面的onLoad方法
                        //         before.onLoad(); 
                        //     }
                        // })
                        setTimeout(()=>{
                          wx.reLaunch({
                            url: '/pages/home/home',
                        })
                        },1000)
                        
                    }).finally(() => {
                        wx.hideLoading()
                    })
                } else {
                    updatePlough(params).then(res => {
                        wx.showToast({
                            title: '编辑成功',
                            icon: 'success',
                            duration: 2000
                        })
                        let pages = getCurrentPages(); //当前页面
                        let before = pages[pages.length - 1];
                        wx.navigateBack({
                            delta: 1,
                            success:() => {
                                // 执行前一页面的onLoad方法
                                before.onLoad(); 
                            }
                        })
                    }).finally(() => {
                        wx.hideLoading()
                    })
                }
                console.log('用户点击确定')
              } else if (resData.cancel) {
                console.log('用户点击取消')
              }
            }
          })    
    },

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
                            imgUrl: data.url
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

    // 耕地简介
    setName(e) {
        const len = e.detail.value
        this.setData({
            name: len
        })
    },

    // 耕地简介
    cropDetail:function (e) { 
        // wx.redirectTo({
        //     url: '/pages/data/cropTextarea/index',
        // })
        if(this.data.description){
            wx.navigateTo({
                url: '/pages/data/cropTextarea/index?textarea=' + this.data.description
            })
        }else{
            wx.navigateTo({
                url: '/pages/data/cropTextarea/index'
            })
        }
        
    },

    // 点击作物
    chooseOrder(e){
        console.log(e.currentTarget.dataset.id)
        let id = e.currentTarget.dataset.id
        // debugger
        // if(id){

        // }else{

        // }
        let that = this
        // 耕地idx  作物id
        wx.navigateTo({
            url: '/pages/data/crop/index?ploughid=' 
            + that.data.idx+"&cropid="+id
        })
    },

    cancel() {
        wx.navigateBack({
          delta: 1
        })
    },

    goRecord(){
        wx.navigateTo({
            url: '../../claimRecord/claimRecord?id='+this.data.idx,
          })
    }
})