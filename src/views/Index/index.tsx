import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import SmartButton from '@/components/SmartButton/index';

export default defineComponent({
  name: 'index',
  components: {
    SmartButton
  },
  setup() {
    const router = useRouter();
    const handleClick = () => {
      router.push('/content');
    };
    return () => (
      <div>
        <SmartButton onClick={handleClick}>查看</SmartButton>
      </div>
    );
  }
});
