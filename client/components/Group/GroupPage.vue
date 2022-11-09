<!-- Page for groups  -->

<template>
    <main>
      <LeftBar />
      <section>
        <header>
          <h2>Groups for @{{ $store.state.username }}</h2>
        </header>
        <CreateGroupForm />
        <div class="groups">
          <GroupComponent
            v-for="group in $store.state.groups"
            :key="group.id"
            :group="group"
          />
        </div>
      </section>
    </main>
  </template>
  
  <script>
  import LeftBar from '@/components/common/LeftBar.vue';
  import CreateGroupForm from '@/components/Group/CreateGroupForm.vue';
  import GroupComponent from '@/components/Group/GroupComponent.vue'
  
  export default {
    name: 'GroupPage',
    components: {
      LeftBar,
      CreateGroupForm,
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