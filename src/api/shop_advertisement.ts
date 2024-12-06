import request from '@/utils/request'

// 首页弹窗设置列表
export function apiShopAdvertisementLists(params: any) {
    return request.get({ url: '/advertisement.shop_advertisement/lists', params })
}

// 添加首页弹窗设置
export function apiShopAdvertisementAdd(params: any) {
    return request.post({ url: '/advertisement.shop_advertisement/add', params })
}

// 编辑首页弹窗设置
export function apiShopAdvertisementEdit(params: any) {
    return request.post({ url: '/advertisement.shop_advertisement/edit', params })
}

// 删除首页弹窗设置
export function apiShopAdvertisementDelete(params: any) {
    return request.post({ url: '/advertisement.shop_advertisement/delete', params })
}

// 首页弹窗设置详情
export function apiShopAdvertisementDetail(params: any) {
    return request.get({ url: '/advertisement.shop_advertisement/detail', params })
}