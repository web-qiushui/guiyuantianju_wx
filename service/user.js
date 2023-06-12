import ajax from './base'

// 用户登录
// loginId 用户手机号
// password 用户密码
export const userLogin = ({
    username,
    password
}) => {
    return ajax.post('/private/login', {
        username,
        password
    })
}

// 用户注册
// mobileNumber 手机号
// nickName 姓名
// password 密码
// validateCode 手机验证码
export const userRegister = ({
    name,
    username,
    password
}) => {
    return ajax.post('/private/register', {
        name,
        username,
        password
    })
}

// 获取注册验证码
export const getRegisterCode = ({
    phoneNumbers,
}) => {
    return ajax.post('/api/user/v1/sendValidateCode.html', {
        phoneNumbers
    })
}

// 用户修改密码
// userId 用户id
// originalPassword 原密码
// newPassword 新密码
// checkPassword 确认新密码
export const userUpdatePwd = ({
    userId,
    originalPassword,
    newPassword,
    checkPassword
}) => {
    return ajax.post('/api/user/v1/updatePassword.html', {
        userId,
        originalPassword,
        newPassword,
        checkPassword
    })
}

// 用户找回密码
// mobileNumber 手机号
// validateCode 手机验证码
// password 新密码
export const userForgotPwd = ({
    mobileNumber,
    validateCode,
    password

}) => {
    return ajax.post('/api/user/v1/forgetPassword.html', {
        mobileNumber,
        validateCode,
        password
    })
}

// 获取忘记密码验证码
export const getForgetCode = ({
    phoneNumbers,
}) => {
    return ajax.post('/api/user/v1/sendForgetCode.html', {
        phoneNumbers
    })
}
