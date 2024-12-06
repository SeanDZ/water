import request from '@/utils/request'

// 积分可兑换商品表列表
export function apiPointGoodLists(params: any) {
    return request.get({ url: '/point.point_good/lists', params })
}

// 添加积分可兑换商品表
export function apiPointGoodAdd(params: any) {
    return request.post({ url: '/point.point_good/add', params })
}

// 编辑积分可兑换商品表
export function apiPointGoodEdit(params: any) {
    return request.post({ url: '/point.point_good/edit', params })
}

// 删除积分可兑换商品表
export function apiPointGoodDelete(params: any) {
    return request.post({ url: '/point.point_good/delete', params })
}

// 积分可兑换商品表详情
export function apiPointGoodDetail(params: any) {
    return request.get({ url: '/point.point_good/detail', params })
}