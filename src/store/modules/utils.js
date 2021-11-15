
const utils = {
	namespaced: true,
	state: {
		device: (navigator.userAgent === 'UlordUosAndroid' || navigator.userAgent === 'UlordUosiOS') ? 'mobile' : 'pc',
		// device: (md.mobile() || navigator.userAgent === 'UlordUosAndroid' || navigator.userAgent === 'UlordUosiOS') ? 'mobile' : 'pc',
		language: 'en'
	},
	mutations: {

		setDevice(state, device) {
			state.device = device
		}
	}
}
export default utils
