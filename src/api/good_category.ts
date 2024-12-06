import request from '@/utils/request'

// 商品分类列表
export function apiGoodCategoryLists(params: any) {
    return request.get({ url: '/good.good_category/lists', params })
}

// 添加商品分类
export function apiGoodCategoryAdd(params: any) {
    return request.post({ url: '/good.good_category/add', params })
}

// 编辑商品分类
export function apiGoodCategoryEdit(params: any) {
    return request.post({ url: '/good.good_category/edit', params })
}

// 删除商品分类
export function apiGoodCategoryDelete(params: any) {
    return request.post({ url: '/good.good_category/delete', params })
}

// 商品分类详情
export function apiGoodCategoryDetail(params: any) {
    return request.get({ url: '/good.good_category/detail', params })
}



export function apiGoodCategoryLists2(params: any) {
    return request.get({ url: '/good.good_category/cate', params })
}