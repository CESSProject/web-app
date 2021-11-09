// console.log('MobileDetect===', MobileDetect)
// const md = new MobileDetect(window.navigator.userAgent)
const utils = {
	namespaced: true,
	state: {
		device: (navigator.userAgent === 'UlordUosAndroid' || navigator.userAgent === 'UlordUosiOS') ? 'mobile' : 'pc',
		// device: (md.mobile() || navigator.userAgent === 'UlordUosAndroid' || navigator.userAgent === 'UlordUosiOS') ? 'mobile' : 'pc',
		language: 'en'
	},
	mutations: {
		setLanguage(state, language) {
			state.language = language
		},
		setDevice(state, device) {
			state.device = device
		}
	}
}
export default utils
