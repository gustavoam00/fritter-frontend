<!-- Form for changing Group name (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeGroupForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/groups',
      method: 'PUT',
      hasBody: true,
      fields: [
        {id: 'groupName', label: 'Group Name', value: ''},
        {id: 'newName', label: 'New Group Name', value: ''},
      ],
      title: 'Change Group Name',
      callback: () => {
        const message = 'Successfully changed group name!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>