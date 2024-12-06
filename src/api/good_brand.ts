import request from '@/utils/request'

// 商品品牌列表
export function apiGoodBrandLists(params: any) {
    return request.get({ url: '/good.good_brand/lists', params })
}

// 添加商品品牌
export function apiGoodBrandAdd(params: any) {
    return request.post({ url: '/good.good_brand/add', params })
}

// 编辑商品品牌
export function apiGoodBrandEdit(params: any) {
    return request.post({ url: '/good.good_brand/edit', params })
}

// 删除商品品牌
export function apiGoodBrandDelete(params: any) {
    return request.post({ url: '/good.good_brand/delete', params })
}

// 商品品牌详情
export function apiGoodBrandDetail(params: any) {
    return request.get({ url: '/good.good_brand/detail', params })
}
