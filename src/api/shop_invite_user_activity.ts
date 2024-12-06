import request from '@/utils/request'

// 用户参加活动表列表
export function apiShopInviteUserActivityLists(params: any) {
    return request.get({ url: '/activity.shop_invite_user_activity/lists', params })
}
