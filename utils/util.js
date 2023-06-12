// 格式化日期
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

// 给日期个位+0
export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 验证手机号
 * mobile 手机号
 */
export function verifyMobile(mobile) {
	return /^1[3456789]\d{9}$/.test(mobile)
}


/**
 * 验证身份证号
 * 身份证号合法性验证  支持15位和18位身份证号 支持地址编码、出生日期、校验位验证
 */
export function verifyIDCard(code) {
	let city = {
		11: "北京",
		12: "天津",
		13: "河北",
		14: "山西",
		15: "内蒙古",
		21: "辽宁",
		22: "吉林",
		23: "黑龙江 ",
		31: "上海",
		32: "江苏",
		33: "浙江",
		34: "安徽",
		35: "福建",
		36: "江西",
		37: "山东",
		41: "河南",
		42: "湖北 ",
		43: "湖南",
		44: "广东",
		45: "广西",
		46: "海南",
		50: "重庆",
		51: "四川",
		52: "贵州",
		53: "云南",
		54: "西藏 ",
		61: "陕西",
		62: "甘肃",
		63: "青海",
		64: "宁夏",
		65: "新疆",
		71: "台湾",
		81: "香港",
		82: "澳门",
		91: "国外 "
	};

	// 身份证格式
	if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) return false

	// 地址编码
	if (!city[code.substr(0, 2)]) return false

	//18位身份证需要验证最后一位校验位
	if (code.length == 18) {
		code = code.split('');
		//∑(ai×Wi)(mod 11)
		//加权因子
		let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		//校验位
		let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
		let sum = 0;
		let ai = 0;
		let wi = 0;
		for (let i = 0; i < 17; i++) {
			ai = code[i];
			wi = factor[i];
			sum += ai * wi;
		}
		let last = parity[sum % 11];
		if (parity[sum % 11] != code[17]) return false
	}

	return true
}
// 判断是否为空
export function isEmpty(value) {
	return value === '' && value.length === 0
}

// 判断位数
export function isMax(value, max) {
	console.log(value, max)
	return value <= max
}

// 表单验证
export const verifyForm = (formData, rules) => {
	return new Promise((resolve, reject) => {
		for (let key in rules) {
			for (let i = 0; i < rules[key].length; i++) {
				let v = rules[key][i]
				let error = {}

				// 必填项
				if (v.required && isEmpty(formData[key])) {
					error[key] = v.errorMsg
					reject(error)
					return
				}

				// 判断位数
				if (v.max && !isMax(formData[key].length, v.max)) {
					error[key] = v.errorMsg
					reject(error)
					return
				}

				// 判断是否手机号
				if (v.isMobile && !verifyMobile(formData[key])) {
					error[key] = v.errorMsg
					reject(error)
					return
				}

				// 判断是否身份证号
				if (v.isIDCard && !verifyIDCard(formData[key])) {
					error[key] = v.errorMsg
					reject(error)
					return
				}
			}
		}
		
		// 验证通过
		resolve(formData)
	})
}
