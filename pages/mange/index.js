const app = getApp()
var startPoint
import storage from '../../common/storage'
import {getPloughList, deletePlough} from '../../service/manage'

Component({
    data: {
        listData:[],
        moving:false,
        moveIndex:-1,
        pageSize: 10,
        pageNum: 1,
        disabled: false,

        //按钮位置参数
        buttonTop: 0,
        buttonLeft: 0,
        windowHeight: '',
        windowWidth: ''
    },
    properties: {
      ploughList: {
          type: Object,
          value: {}
      },
    },
    attached(){
      this.getSystemInfo()
    },
    methods: {
        touchS(e) {
            let index = e.currentTarget.dataset.index;
            // 获得起始坐标
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
            this.setData({
              moveIndex:index
            })
        }, 
        touchM(e) {
            // 获得当前坐标
            this.currentX = e.touches[0].clientX;
            this.currentY = e.touches[0].clientY;
            const x = this.startX - this.currentX; //横向移动距离
            const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
            if (x > 35 && y < 110) {
            //向左滑是显示删除
              this.setData({
                moving: true
              })
            } else if (x < -35 && y < 110) {
            //向右滑
              this.setData({
                moving: false
              })
            }
        },
    
        // 删除详情
        deleteDetail() {
            const paramId = this.data.detail.production.id
            let that=this
              wx.showModal({
                title: '确认删除',
                content: '删除后将不可恢复',
                success (resData) {
                  if (resData.confirm) {
                    wx.showLoading({
                        title: '正在删除...',
                      })
                      console.log(paramId)
                      deleteOrder(paramId).then(res => {
                        console.log(res)
                        this.triggerEvent('refresh', true)
                        that.setData({
                              title: '删除耕地',
                              content: '删除成功',
                              isShow: true
                          }, () => {
                            that.createAnimation()
                          })
                      }).finally(() => {
                          wx.hideLoading()
                      })
                  } else if (resData.cancel) {
                    console.log('用户点击取消')
                  }
                }
              }) 
        },
    
        // 返回上一页
        back() {
            wx.navigateBack({
              delta: 1
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
    
         // 管理
         manage(e) {
            const id = e.currentTarget.dataset.id
            console.log("e.currentTarget.dataset",e.currentTarget.id)
            wx.navigateTo({
              url: '/pages/data/write/index?id=' + id,
            })
        },

        // 删除
        delBtn(e) {
          const id = e.currentTarget.dataset.id
          let that = this
          wx.showModal({
            title: '提示',
            content: '确认删除该耕地吗？',
            success (resData) {
                if (resData.confirm) {
                    wx.showLoading({
                        title: '正在提交...'
                    })
                    console.log('正在提交...',resData)
                    deletePlough(id).then(res => {
                        console.log('res',res)
                        //向右滑
                        this.setData({
                          moving: false
                        })
                        if(res.code === 200){
                          wx.showToast({
                            title: '删除成功',
                            icon: 'none',
                            duration: 2000
                          },() => {
                            that.createAnimation()
                          })
                        }  
                    }).finally(() => {
                        console.log('hideLoading')
                        wx.hideLoading()
                    })
                    
                    // 获取列表
                    that.triggerEvent('refresh', true)
                } else if (resData.cancel) {
                    console.log('用户点击取消')
                }
            }
          }) 
          
        },
        // 新增耕地
        addDetail() {
            wx.navigateTo({
                url: '/pages/data/write/index',
            })
        },
         // 获取购物车控件适配参数
         getSystemInfo(){
          var that =this;
          wx.getSystemInfo({
            success: function (res) {
              console.log(res);
              // 屏幕宽度、高度
              console.log('height=' + res.windowHeight);
              console.log('width=' + res.windowWidth);
              // 高度,宽度 单位为px
              that.setData({
                windowHeight:  res.windowHeight,
                windowWidth:  res.windowWidth,
                buttonTop:res.windowHeight*0.70,//这里定义按钮的初始位置
                buttonLeft:res.windowWidth*0.70,//这里定义按钮的初始位置
              })
            }
          })
        },
         //可拖动悬浮按钮点击事件
         btn_Suspension_click:function(){
          //这里是点击购物车之后将要执行的操作
          wx.showToast({
            title: '点击成功',
            icon:'success',
            duration:1000
          })
        },
        //以下是按钮拖动事件
        buttonStart: function (e) {
          startPoint = e.touches[0]//获取拖动开始点
        },
        buttonMove: function (e) {
          var endPoint = e.touches[e.touches.length - 1]//获取拖动结束点
          //计算在X轴上拖动的距离和在Y轴上拖动的距离
          var translateX = endPoint.clientX - startPoint.clientX
          var translateY = endPoint.clientY - startPoint.clientY
          startPoint = endPoint//重置开始位置
          var buttonTop = this.data.buttonTop + translateY
          var buttonLeft = this.data.buttonLeft + translateX
          //判断是移动否超出屏幕
          if (buttonLeft+50 >= this.data.windowWidth){
            buttonLeft = this.data.windowWidth-50;
          }
          if (buttonLeft<=0){
            buttonLeft=0;
          }
          if (buttonTop<=0){
            buttonTop=0
          }
          if (buttonTop + 50 >= this.data.windowHeight){
            buttonTop = this.data.windowHeight-50;
          }
          this.setData({
            buttonTop: buttonTop,
            buttonLeft: buttonLeft
          })
        },
        buttonEnd: function (e) {
        }
    }    
})