<!-- Form to switch to anonymous mode (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'SwitchToAnonForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/anon/session',
      method: 'POST',
      setUsername: true,
      title: 'Enter Anonymous Mode',
      fields: [],
      content: '',
      callback: () => {
        this.$router.push({name: 'Home'}); // Goes to Home page after switching to Anon
        this.$store.commit('alert', {
          message: 'You are now in anonymous mode', status: 'success'
        });
      }
    };
  }
};
</script>
