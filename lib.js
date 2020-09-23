module.exports = {
   //request post方法 支持双写法
   post(data, _data, _success, _fail, _complete) {
      if (!this.isLoading){
         this.isLoading = true;
         wx.showNavigationBarLoading()
      }
      var _this = this
      if (data) {
         var __url, __data, __fn, __success, __fail, __complete;
         if (typeof data === 'string') {
            __url = data, __data = _data, __success = _success, __fail = _fail, __complete = _complete
         } else if (typeof data === 'object') {
            __url = data.url, __data = data.data, __success = data.success, __fail = data.fail, __complete = data.complete
         } else {
            console.error("post参数格式错误")
         }
         wx.request({
            url: getApp().globalData.url + __url,
            data: __data,
            header: {
               'content-type': "application/x-www-form-urlencoded"
            },
            method: 'post',
            success(res) {
               setTimeout(() => {
                  if (__success) {
                     __success(res)
                  }
               }, 50)
            },
            fail(res) {
               setTimeout(() => {
                  if (__fail) {
                     __fail(res)
                  } else {
                     console.error(res)
                  }
                  wx.showToast({
                     title: '网络异常',
                     icon: 'none',
                     duration: 1000
                  })
               }, 50)
            },
            complete(res) {
               wx.hideNavigationBarLoading()
               _this.isLoading=false;
               setTimeout(() => {
                  if (__complete) {
                     __complete(res)
                  }
               }, 50)
            }
         })
      } else {
         console.error('post未传参')
      }


   },
   //等待数据获取到后执行,函数无回调值 data类型为string
   wait(obj, data, fn) {
      (function a() {
         if (!obj[data]) {
            setTimeout(() => {
               a()
            }, 300)
         } else {
            fn()
         }
      })()
   },
   //msg提示框
   msg(str, bool = false) {
      if (bool) {
         wx.showToast({
            title: str,
            duration: 1000,
            mask: true
         })
      } else {
         wx.showToast({
            title: str,
            icon: 'none',
            duration: 800
         })
      }
   },
   //对象转换为数据
   toData(obj) {
      return JSON.parse(JSON.stringify(obj))
   },


   //new------------------
   //直接跳转处理
   navto(e) {
      wx.navigateTo({
         url: e.currentTarget.dataset.url
      })
   },
   //手机号格式
   notphone(str) {
      var re = /^\d{11}$/
      return !re.test(str)
   },
   //是否为空
   kong(str) {
      if (!str || str == "") {
         return true
      } else {
         return false
      }
   },
   //时间戳转换-时间格式转换
   time(str, num, bool = true) {
      if (num == 'now' || !num) {
         var date = new Date()
      } else {
         var num = parseInt(num) || num.replace(/-/g, '/'),
            date = new Date(num)
      }
      var
         Y = date.getFullYear(),
         M = date.getMonth() + 1,
         D = date.getDate(),
         h = date.getHours(),
         m = date.getMinutes(),
         s = date.getSeconds(),
         w = date.getDay();
      if (bool) {
         M = n(M), D = n(D), h = n(h), m = n(m), s = n(s)
      }

      function n(nu) {
         return nu > 9 ? nu : '0' + nu
      }
      if (str) {
         str = str.replace(/Y/g, Y)
         str = str.replace(/M/g, M)
         str = str.replace(/D/g, D)
         str = str.replace(/h/g, h)
         str = str.replace(/m/g, m)
         str = str.replace(/s/g, s)
         return str
      } else {
         console.error('lib.time\n第一参数为格式 必传（YMDhmsw w为星期\n第二参数为时间戳 不传或传“now”时转换当前时间\n第三参数为是否将时间一位数转两位数（boolean）默认为true')
      }
   },
   //拨打电话
   call(num, fn) {
      var num = num.toString()
      wx.makePhoneCall({
         phoneNumber: num,
         complete(e) {
            if (fn) {
               fn(e)
            } else {
               console.log(e.errMsg)
            }
         }
      })
   }
}