import { defineComponent } from 'vue';
import style from './index.module.scss';

export default defineComponent({
  name: 'Content',
  emits: ['goBack'],
  setup(props, { emit }) {
    const goBack = () => {
      emit('goBack');
    };
    return () => (
      <div class={style.content}>
        <div class={style.menu}>
          <router-link to="/content/school">校本资源</router-link>
          <router-link to="/content/question">精品题库</router-link>
          <router-link to="/content/error-question">错题库</router-link>
          <router-link to="/content/paper">精品卷库</router-link>
        </div>
        <div class={style.main}>
          <el-button type="text" onClick={goBack}>
            返回
          </el-button>
          <router-view></router-view>
        </div>
      </div>
    );
  }
});
