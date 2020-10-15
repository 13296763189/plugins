module.exports = {
	/**
	 * 获取顶部导航信息
	 * @param {object} fn 
	 */
	getNavigationInfo(fn) {
		wx.getSystemInfo({
			success: function (res) {
				setTimeout(function () {
					var app = getApp();
					var statusBarHeight = res.statusBarHeight
					var menuInfo = wx.getMenuButtonBoundingClientRect()
					var navigationHeight = res.statusBarHeight + (menuInfo.top - res.statusBarHeight) * 2 + menuInfo.height+4;
					if (typeof fn == 'function') {
						fn({
							statusBarHeight,
							menuInfo,
							navigationHeight
						})
					}
				})
			},
		})
	},
	/**
	 * request post方法
	 * 
	 * @param {string} url 
	 * @param {object} data
	 * @param {Function} success 
	 * @param {Function} fail 
	 * @param {Function} complete 
	 */
	// 2020.7.5
	post(url, data, success, fail, complete) {
		var app=getApp();
		if (!this.isLoading) {
			this.isLoading = true;
			wx.showNavigationBarLoading()
		}
		var _this = this
		if (url) {
			var header={
				'content-type': "application/x-www-form-urlencoded"
			}
			header=Object.assign(header,app.globalData.header)
			// // mark: 当前位置为杭商小程序临时修改
			// if((url.indexOf('addVote')!==-1)||(url.indexOf('getVote')!==-1)||(url.indexOf('getVoteById')!==-1)||(url.indexOf('getRule')!==-1)){
			// 	var base_url=app.globalData.url2
			// }else{
			// 	var base_url=app.globalData.url
			// }
			wx.request({
				url: app.globalData.url + url,
				data: data,
				header: header,
				method: 'post',
				success(res) {
					if (res.statusCode != 200) {
						_this.msg('err: ' + res.statusCode)
					}
					if (success) {
						success(res)
					}
				},
				fail(res) {
					if (fail) {
						fail(res)
					}
					console.log(url, res)
					wx.showToast({
						title: '网络异常',
						icon: 'none',
						duration: 2000
					})
				},
				complete(res) {
					wx.hideNavigationBarLoading()
					_this.isLoading = false;
					if (complete) {
						complete(res)
					}
				}
			})
			var returnFuncitons={
				then(fn){
					success = fn
					return returnFuncitons;
				},
				catch(fn){
					fail = fn
					return returnFuncitons;
				},
				success(fn) {
					success = fn
					return returnFuncitons;
				},
				fail(fn) {
					fail = fn
					return returnFuncitons;
				},
				complete(fn) {
					complete = fn
					return returnFuncitons;
				},
				loading(str) {
					wx.showLoading({
						title: str || '加载中',
						mask: true
					})
					return returnFuncitons;
				}
			}
			return returnFuncitons;
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
	/**
	 * 提示框
	 * @param {string} str 提示文字
	 * @param {boolean | number} bool 是否显示对号 | 延时时间
	 */
	msg(str, bool = false) {
		var success=null,fail=null
		if (bool === true) {
			wx.showToast({
				title: str,
				duration: 1500,
				mask: true,
				success(res){
					if(success)success(res)
				},
				fail(res){
					if(fail)fail(res)
				}
			})
		} else if (typeof bool == 'number') {
			wx.showToast({
				title: str,
				icon: 'none',
				duration: bool,
				success(res){
					if(success)success(res)
				},
				fail(res){
					if(fail)fail(res)
				}
			})
		} else {
			wx.showToast({
				title: str,
				icon: 'none',
				duration: 1500,
				success(res){
					if(success)success(res)
				},
				fail(res){
					if(fail)fail(res)
				}
			})
		}
		return {
			success(fn){
				success=fn
			},
			then(fn){
				success=fn
			},
			fail(fn){
				fail=fn
			},
			catch(fn){
				fail=fn
			}
		}
	},
	/**
	 * 克隆对象,去除关联
	 * @param {object} obj 
	 */
	clone(obj) {
		return JSON.parse(JSON.stringify(obj))
	},


	//wxml带参跳转处理
	navto(e) {
		var dataset = e.currentTarget.dataset
		var url = dataset.url + (dataset.query ? '?' + dataset.query : '')
		wx.navigateTo({
			url: dataset.url
		})
	},
	//匹配手机号格式
	notphone(str) {
		return !(/^\d{11}$/).test(str)
	},
	//是否为空
	kong(str) {
		return !str||!(/\S/).test(str);
	},
	/**
	 * 时间戳转换-时间格式转换
	 * @param {string} str 想要转换的目标时间格式
	 * @param {number} num 时间戳，单位毫秒 非必填
	 * @param {boolean} bool 是否个位前补0，默认为true 非必填
	 */
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
	/**
	 * 拨打电话
	 * @param {number|string} num 电话号码
	 * @param {function} fn callback 
	 */
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
	},
	butlerSelectTime(fn) {
		getApp().selectTimeOver = fn;
		wx.navigateTo({
			url: '/pages/butler/select_time/select_time',
		})
	},
	/**
	 * 页面滚动
	 * @param {number|string} num 
	 */
	scrollTo(num) {
		wx.pageScrollTo({
			scrollTop: Number(num)
		})
	},
	onfocus(e) {
		var offsetTop = e.currentTarget.offsetTop
		setTimeout(() => {
			this.scrollTo(offsetTop);
		}, 200)
	},
	statusBarHeight() {
		var h = null;
		wx.getSystemInfo({
			success: function (res) {
				h = res.statusBarHeight
			},
		})
		return h;
	},
	// 胶囊
	jnData() {
		return wx.getMenuButtonBoundingClientRect();
	},
	/**
	 * 返回dataset
	 * @param {any} e 
	 */
	data(e) {
		return e.currentTarget.dataset;
	},
	// 转换为北京时间，ps:时间戳会改变
	changeCount(time) {
		// 目标时区，东8区
		var targetTimezone = -8;
		// 当前时区与中时区时差，以min为维度
		var dif, east9time
		if (time) {
			dif = new Date(time).getTimezoneOffset();
			east9time = new Date(time).getTime() + dif * 60 * 1000 - (targetTimezone * 60 * 60 * 1000);
		} else {
			dif = new Date().getTimezoneOffset();
			east9time = new Date().getTime() + dif * 60 * 1000 - (targetTimezone * 60 * 60 * 1000);
		}
		// 本地时区时间 + 本地时区时差  = 中时区时间
		// 目标时区时间 + 目标时区时差 = 中时区时间
		// 目标时区时间 = 本地时区时间 + 本地时区时差 - 目标时区时差
		// 东8区时间
		// console.log('new Date(east9time)', dif, new Date(east9time));
		return new Date(east9time)
	},
	select(str, _this, fn) {
		let query = wx.createSelectorQuery().in(_this)
		query.select(str).boundingClientRect(function (res) {
			if (typeof fn == 'function') {
				fn(res)
			}
		}).exec()
	},
	selectAll(str, _this, fn) {
		let query = wx.createSelectorQuery().in(_this)
		query.selectAll(str).boundingClientRect(function (res) {
			if (typeof fn == 'function') {
				fn(res)
			}
		}).exec()
	},
	// 获取更新信息
	getUpdate(app) {
		var app = app || getApp();
		if (wx.canIUse('getUpdateManager') && !app.globalData.cannotGetUpdate) {
			const updateManager = wx.getUpdateManager()
			updateManager.onCheckForUpdate(function (res) {
				console.log('onCheckForUpdate====', res)
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					console.log('res.hasUpdate====')
					updateManager.onUpdateReady(function () {
						wx.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success: function (res) {
								console.log('success====', res)
								// res: {errMsg: "showModal: ok", cancel: false, confirm: true}
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate()
								} else {
									app.globalData.cannotGetUpdate = true;
								}
							}
						})
					})
					updateManager.onUpdateFailed(function () {
						// 新的版本下载失败
						wx.showModal({
							title: '已经有新版本了哟~',
							content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
						})
					})
				}
			})
		}
	},
	// 需要openid时
	useopenid(fn, app) {
		var app = app || getApp();
		if (typeof fn == 'function') {
			if (app.globalData.openid) {
				fn(app.globalData.openid);
			} else {
				if (!app.waitOpenidFns) {
					app.waitOpenidFns = [];
				}
				app.waitOpenidFns.push(fn);
			}
		}
	},
	// 登录
	login(app,callback) {
		var app = app || getApp();
		var lib = this;
		if (!app.globalData.loginApi) {
			throw ('app.globalData中没有loginApi')
		}

		var Header={
			'content-type': "application/x-www-form-urlencoded",
		}
		if(app.globalData.header){
			Header=Object.assign(Header,app.globalData.header)
		}
		wx.login({
			success: res => {
				wx.request({
					url: app.globalData.url + app.globalData.loginApi,
					method: 'POST',
					data: {
						js_code: res.code
					}, //传递后台code值
					header: Header,
					success: function (res) {
						if (res.data.code == 200 && res.data.data && res.data.data.openid) {
							app.globalData.openid = res.data.data.openid;
							app.globalData.session_key = res.data.data.session_key;
							// 回调
							if (app.waitOpenidFns) {
								app.waitOpenidFns.forEach(item => {
									item(res.data.data.openid);
								})
								app.waitOpenidFns = [];
							}
							callback?callback():false;
						} else {
							lib.msg('获取openid失败！请退出重试', 3000)
						}
					},
					fail(res) {
						lib.msg('获取openid失败！请退出重试', 3000)
					}
				})
			}
		})
	},
	/**
	 * 返回login/getopenid
	 */
	back() {
		wx.navigateBack();
	},
	/**
	 * 输入
	 * @param {*} e e
	 * @param {*} _this page
	 */
	input(e,_this){
		var {attr}=this.data(e);
		_this.setData({
			[attr]:e.detail.value
		})
	}
}