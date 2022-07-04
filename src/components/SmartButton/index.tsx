import { ref, defineComponent } from 'vue';
import style from './index.module.scss';

export default defineComponent({
  name: 'SmartButton',
  props: {
    val: {
      type: String,
      default: 'test click'
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const name = ref('button');
    const handleClick = () => {
      console.log(props.val);
      emit('click');
    };
    return {
      name,
      handleClick
    };
  },
  render() {
    return (
      <button class={style.smartButton} onClick={this.handleClick}>
        {this.$slots.default ? this.$slots.default() : 'Button'}
      </button>
    );
  }
});
