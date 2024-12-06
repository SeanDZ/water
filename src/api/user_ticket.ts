import request from '@/utils/request'

// 水票总量统计列表
export function apiUserTicketLists(params: any) {
    return request.get({ url: '/finance.user_ticket/lists', params })
}

// 添加水票总量统计
export function apiUserTicketAdd(params: any) {
    return request.post({ url: '/finance.user_ticket/add', params })
}

// 编辑水票总量统计
export function apiUserTicketEdit(params: any) {
    return request.post({ url: '/finance.user_ticket/edit', params })
}

// 删除水票总量统计
export function apiUserTicketDelete(params: any) {
    return request.post({ url: '/finance.user_ticket/delete', params })
}

// 水票总量统计详情
export function apiUserTicketDetail(params: any) {
    return request.get({ url: '/finance.user_ticket/detail', params })
}