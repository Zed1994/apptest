<template>
  <button class="smart-button">smart button</button>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SmartButton'
});
</script>
<style lang="scss" scoped>
.smart-button {
  height: 32px;
  padding: 0 8px;
  background: #4781ff;
  color: #fff;
  cursor: pointer;
  &:hover {
    background: #2861de;
  }
}
</style>
