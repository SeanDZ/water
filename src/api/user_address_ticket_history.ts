import request from '@/utils/request'

// 水票流水记录列表
export function apiUserAddressTicketHistoryLists(params: any) {
    return request.get({ url: '/ticket_history.user_address_ticket_history/lists', params })
}

// 添加水票流水记录
export function apiUserAddressTicketHistoryAdd(params: any) {
    return request.post({ url: '/ticket_history.user_address_ticket_history/add', params })
}

// 编辑水票流水记录
export function apiUserAddressTicketHistoryEdit(params: any) {
    return request.post({ url: '/ticket_history.user_address_ticket_history/edit', params })
}

// 删除水票流水记录
export function apiUserAddressTicketHistoryDelete(params: any) {
    return request.post({ url: '/ticket_history.user_address_ticket_history/delete', params })
}

// 水票流水记录详情
export function apiUserAddressTicketHistoryDetail(params: any) {
    return request.get({ url: '/ticket_history.user_address_ticket_history/detail', params })
}