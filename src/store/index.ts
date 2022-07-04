import { createStore } from 'vuex';
// import $http from '../api';
// import router from '../router';
import menu from './mockdata';

const defaultState = {
  count: 0,
  author: '布局demo',
  lastOneRoute: '',
  userInfo: {},
  menuList: [],
  projectList: []
};

export default createStore({
  state() {
    return defaultState;
  },
  mutations: {
    increment(state: typeof defaultState) {
      state.count += 1;
    },
    setUserInfo(state: typeof defaultState, data: any) {
      state.userInfo = data;
    },
    setMenuList(state: typeof defaultState, data: any) {
      state.menuList = data;
    }
  },
  actions: {
    // 实际开发中请参考这个接口处理左侧菜单
    asyncSetUserInfoAndMenuList({ commit }) {
      commit('setUserInfo', {
        email: 'xiaochuan@zuoyebang.com',
        phone: '110',
        realName: '小船',
        uname: 'xiaochuan'
      });
      commit('setMenuList', menu);
      // $http.getuserinfo({ platform: 'bc-annotation' }).then((data: any) => {
      //   commit('setUserInfo', data.userinfo);
      //   commit('setMenuList', data.menulist);
      //   if (data.menulist.length === 0) {
      //     router.push({ path: '/power' });
      //   }
      // });
    },
    // asyncSetUserInfoBrushTopic({ commit }) {
    // $http.getbrushuser({}).then((data: any) => {
    //   commit('setUserInfo', data.userinfo);
    //   commit('setMenuList', data.menulist);
    //   if (data.menulist.length === 0) {
    //     router.push({ path: '/power' });
    //   }
    // });
    // },
    increment(context) {
      context.commit('increment');
    }
  },
  getters: {
    double(state: typeof defaultState) {
      return 2 * state.count;
    }
  }
});
