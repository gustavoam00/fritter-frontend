<!-- Form to switch out of anonymous mode (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'SwitchToAnonForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/anon/session',
      method: 'DELETE',
      setUsername: true,
      title: 'Leave Anonymous Mode',
      fields: [],
      content: '',
      callback: () => {
        this.$router.push({name: 'Home'}); // Goes to Home page after switching to Anon
        this.$store.commit('alert', {
          message: 'You are now out of anonymous mode', status: 'success'
        });
      }
    };
  }
};
</script>