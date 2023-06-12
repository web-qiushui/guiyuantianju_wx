function getRandomColor() {
    const rgb = []
    for (let i = 0; i < 3; ++i) {
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length === 1 ? '0' + color : color
      rgb.push(color)
    }
    return '#' + rgb.join('')
  }
  let videoContext = ''
  let inputValue = ''

  Component({
   
      data:{

      },
      attached(){
        this.videoContext = wx.createVideoContext('myVideo')
      },
      methods: {
          setUrl(url){
            
            console.log(this.videoContext)
            this.videoContext.url = url
            this.videoContext.play()
          },
     
        bindVideoEnterPictureInPicture() {
            console.log('进入小窗模式')
          },
        
          bindVideoLeavePictureInPicture() {
            console.log('退出小窗模式')
          },
          bindPlayVideo() {
            console.log('1')
            this.videoContext.play()
          },
          bindSendDanmu() {
            this.videoContext.sendDanmu({
              text: this.inputValue,
              color: getRandomColor()
            })
          },
        
          videoErrorCallback(e) {
            console.log('视频错误信息:')
            console.log(e.detail.errMsg)
          }
    }
}) 
   
  
   
  
