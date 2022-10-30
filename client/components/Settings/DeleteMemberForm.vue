<!-- Form for adding member to a Group (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'DeleteMemberForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/groups/members',
      method: 'DELETE',
      hasBody: true,
      fields: [
        {id: 'groupName', label: 'Group Name', value: ''},
        {id: 'username', label: 'Username of Member', value: ''}
      ],
      title: 'Delete Member from Group',
      callback: () => {
        const message = 'Successfully deleted member';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>