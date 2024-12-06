import request from '@/utils/request'

// 商家管理列表
export function apiShopLists(params: any) {
    return request.get({ url: '/shop.shop/lists', params })
}

// 添加商家管理
export function apiShopAdd(params: any) {
    return request.post({ url: '/shop.shop/add', params })
}

// 编辑商家管理
export function apiShopEdit(params: any) {
    return request.post({ url: '/shop.shop/edit', params })
}
//分配权限
export function apiShopPer(params: any) {
    return request.post({ url: '/shop.shop/per', params })
}
// 删除商家管理
export function apiShopDelete(params: any) {
    return request.post({ url: '/shop.shop/delete', params })
}

// 商家管理详情
export function apiShopDetail(params: any) {
    return request.get({ url: '/shop.shop/detail', params })
}
//重置密码
export function apiShopPassword(params: any) {
    return request.get({ url: '/shop.shop/resetPassword', params })
}