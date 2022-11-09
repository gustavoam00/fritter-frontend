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
      refreshGroup: true,
      fields: [
        {id: 'groupName', label: 'Group Name', value: ''}
      ],
      title: 'Create Group',
      callback: () => {
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>

<style scoped>
form {
  border: 2px solid var(--primary-color);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
  width: 100%;
  padding: 2.5%;
  margin-bottom: 5%;
}
article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
   font-family: inherit;
   font-size: inherit;
}
</style>