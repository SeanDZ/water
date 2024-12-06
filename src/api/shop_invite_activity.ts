import request from '@/utils/request'

// 裂变活动列表
export function apiShopInviteActivityLists(params: any) {
    return request.get({ url: '/activity.shop_invite_activity/lists', params })
}

// 添加裂变活动
export function apiShopInviteActivityAdd(params: any) {
    return request.post({ url: '/activity.shop_invite_activity/add', params })
}

// 编辑裂变活动
export function apiShopInviteActivityEdit(params: any) {
    return request.post({ url: '/activity.shop_invite_activity/edit', params })
}

// 删除裂变活动
export function apiShopInviteActivityDelete(params: any) {
    return request.post({ url: '/activity.shop_invite_activity/delete', params })
}

// 裂变活动详情
export function apiShopInviteActivityDetail(params: any) {
    return request.get({ url: '/activity.shop_invite_activity/detail', params })
}