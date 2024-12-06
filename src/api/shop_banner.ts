import request from '@/utils/request'

// 首页轮播图列表
export function apiShopBannerLists(params: any) {
    return request.get({ url: '/banner.shop_banner/lists', params })
}

// 添加首页轮播图
export function apiShopBannerAdd(params: any) {
    return request.post({ url: '/banner.shop_banner/add', params })
}

// 编辑首页轮播图
export function apiShopBannerEdit(params: any) {
    return request.post({ url: '/banner.shop_banner/edit', params })
}

// 删除首页轮播图
export function apiShopBannerDelete(params: any) {
    return request.post({ url: '/banner.shop_banner/delete', params })
}

// 首页轮播图详情
export function apiShopBannerDetail(params: any) {
    return request.get({ url: '/banner.shop_banner/detail', params })
}