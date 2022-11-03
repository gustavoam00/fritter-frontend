<!-- Form to switch out of anonymous mode (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'SwitchFromAnonForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/anon/session',
      method: 'DELETE',
      setUsername: true,
      title: 'Leave Anonymous Mode',
      fields: [],
      content: 'You can also switch from Anonymous Mode by clicking the profile picture on bottom left.',
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