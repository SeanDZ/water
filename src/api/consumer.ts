import request from '@/utils/request'

// 用户列表
export function getUserList(params: any) {
    return request.get({ url: '/user.user/lists', params }, { ignoreCancelToken: true })
}

// 用户详情
export function getUserDetail(params: any) {
    return request.get({ url: '/user.user/detail', params })
}

// 用户编辑
export function userEdit(params: any) {
    return request.post({ url: '/user.user/edit', params })
}

// 用户编辑
export function adjustMoney(params: any) {
    return request.post({ url: '/user.user/adjustMoney', params })
}

// 用户积分
export function userPoint(params: any) {
    return request.post({ url: '/user.user/point', params })
}
export function userAccount(params: any) {
    return request.post({ url: '/user.user/account', params })
}

//删除
export function deleteUser(params: any) {
    return request.get({ url: '/user.user/delete', params })
}


//分销权限设置
export function setUserAgent(params: any) {
    return request.post({ url: '/user.user/agentSet', params })
}
