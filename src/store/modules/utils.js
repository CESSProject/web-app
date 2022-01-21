
const utils = {
	namespaced: true,
	state: {
		device: (navigator.userAgent === 'UlordUosAndroid' || navigator.userAgent === 'UlordUosiOS') ? 'mobile' : 'pc',
	},
	mutations: {
		setDevice(state, device) {
			state.device = device
		}
	}
}
export default utils
