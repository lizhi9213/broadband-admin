import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import page from './modules/page';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        bbc: [1, 2, 3]
    },
    mutations: {
        //
    },
    actions: {

    },
    modules: {
        app,
        user,
        page
    }
});

export default store;
