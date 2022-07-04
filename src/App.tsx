import { createApp, defineComponent, onBeforeMount, onUnmounted } from 'vue';
import { VueSvgIconPlugin } from '@yzfe/vue3-svgicon';
import ElementPlus from 'element-plus';
import { useStore } from 'vuex';
import http from './api';
import router from './router';
import './assets/style/index.scss';
import store from './store';

const App = defineComponent({
  setup() {
    const _store = useStore();
    const handleOnline = () => _store.commit('isOnline', true);
    const handleOffline = () => _store.commit('isOnline', false);

    onBeforeMount(async () => {
      _store.dispatch('getInfo');
      _store.dispatch('getIsPermissionAll');
      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);
    });

    onUnmounted(() => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    });

    return () => <router-view />;
  }
});

const app = createApp(App);
app.config.globalProperties.$http = http;

app
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(VueSvgIconPlugin, {
    tagName: 'svgicon'
  })
  .mount('#app');
