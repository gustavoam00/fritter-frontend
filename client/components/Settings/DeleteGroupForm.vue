<!-- Form for deleting Group (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateGroupForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/groups',
      method: 'DELETE',
      hasBody: true,
      fields: [
        {id: 'groupName', label: 'Group Name', value: ''}
      ],
      title: 'Delete Group',
      callback: () => {
        const message = 'Successfully deleted group!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>