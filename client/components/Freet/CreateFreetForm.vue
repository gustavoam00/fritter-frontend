<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateFreetForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/freets', // '/api/freets/:groupName?'
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'groupName', label: 'Group (optional)', value: ''}
      ],
      title: 'Create a freet',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
