import request from '@/utils/request'

// 参团数据列表
export function apiShopActivityGroupLists(params: any) {
    return request.get({ url: '/activity_group.shop_activity_group/lists', params })
}

// 添加参团数据
export function apiShopActivityGroupAdd(params: any) {
    return request.post({ url: '/activity_group.shop_activity_group/add', params })
}

// 编辑参团数据
export function apiShopActivityGroupEdit(params: any) {
    return request.post({ url: '/activity_group.shop_activity_group/edit', params })
}

// 删除参团数据
export function apiShopActivityGroupDelete(params: any) {
    return request.post({ url: '/activity_group.shop_activity_group/delete', params })
}

// 参团数据详情
export function apiShopActivityGroupDetail(params: any) {
    return request.get({ url: '/activity_group.shop_activity_group/detail', params })
}

// 一键成团
export function apiShopActivityGroupSuccess(params: any) {
    return request.post({ url: '/activity_group.shop_activity_group/order_group', params })
}