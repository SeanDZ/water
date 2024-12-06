import request from '@/utils/request'

// 首页图标配置列表
export function apiShopIconLists(params: any) {
    return request.get({ url: '/shop_icon.shop_icon/lists', params })
}

// 添加首页图标配置
export function apiShopIconAdd(params: any) {
    return request.post({ url: '/shop_icon.shop_icon/add', params })
}

// 编辑首页图标配置
export function apiShopIconEdit(params: any) {
    return request.post({ url: '/shop_icon.shop_icon/edit', params })
}

// 删除首页图标配置
export function apiShopIconDelete(params: any) {
    return request.post({ url: '/shop_icon.shop_icon/delete', params })
}

// 首页图标配置详情
export function apiShopIconDetail(params: any) {
    return request.get({ url: '/shop_icon.shop_icon/detail', params })
}