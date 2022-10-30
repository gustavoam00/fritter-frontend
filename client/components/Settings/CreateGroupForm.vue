<!-- Form for creating Group (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateGroupForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/groups',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'groupName', label: 'Group Name', value: ''}
      ],
      title: 'Create Group',
      callback: () => {
        const message = 'Successfully created group!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>