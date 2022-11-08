<!-- Page for groups  -->

<template>
    <main>
      <LeftBar />
      <section>
        <header>
          <h2>Groups for @{{ $store.state.username }}</h2>
        </header>
        <div class="groups">
          <GroupComponent
            v-for="group in $store.state.groups"
            :key="group.id"
            :group="group"
          />
          <CreateGroupForm />
        </div>
      </section>
    </main>
  </template>
  
  <script>
  import LeftBar from '@/components/common/LeftBar.vue';
  import CreateGroupForm from '@/components/Group/CreateGroupForm.vue';
  import DeleteGroupForm from '@/components/Group/DeleteGroupForm.vue';
  import ChangeGroupForm from '@/components/Group/ChangeGroupForm.vue';
  import AddMemberForm from '@/components/Group/AddMemberForm.vue';
  import DeleteMemberForm from '@/components/Group/DeleteMemberForm.vue';
  import GroupComponent from '@/components/Group/GroupComponent.vue'
  
  export default {
    name: 'GroupPage',
    components: {
      LeftBar,
      CreateGroupForm,
      DeleteGroupForm,
      ChangeGroupForm,
      AddMemberForm,
      DeleteMemberForm,
      GroupComponent,
    },
    mounted() {
      this.$store.commit('refreshGroups');
    }
  };
  </script>
  
  <style scoped>
  main {
    margin-left: 10%;
  }
  .groups {
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  </style>