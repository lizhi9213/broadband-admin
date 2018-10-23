const page = {
    state: {
        firstData: {},
        skay: '',
        callcode: ''
    },
    mutations: {
        setFormData(state, data) {
            state.firstData = data;
        },
        setskay(state, data) {
            state.skay = data;
        },
        setcallcode(state, data) {
            state.callcode = data;
        }
    },
}
export default page;