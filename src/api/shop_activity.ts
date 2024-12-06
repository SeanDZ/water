import request from '@/utils/request'

// 营销活动列表
export function apiShopActivityLists(params: any) {
    return request.get({ url: '/activity.shop_activity/lists', params })
}

// 添加营销活动
export function apiShopActivityAdd(params: any) {
    return request.post({ url: '/activity.shop_activity/add', params })
}

// 编辑营销活动
export function apiShopActivityEdit(params: any) {
    return request.post({ url: '/activity.shop_activity/edit', params })
}

// 删除营销活动
export function apiShopActivityDelete(params: any) {
    return request.post({ url: '/activity.shop_activity/delete', params })
}

// 营销活动详情
export function apiShopActivityDetail(params: any) {
    return request.get({ url: '/activity.shop_activity/detail', params })
}



// 营销活动列表
export function apiShopActivityLists2(params: any) {
    return request.get({ url: '/activity.shop_activity/group_lists', params })
}
