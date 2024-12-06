/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path : string) {
	return /^(https?:|mailto:|tel:)/.test(path)
}

export function isPhone(value : any) {
	const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}(,1[3|4|5|6|7|8|9][0-9]\d{8})*$/
	return reg.test(value)
}