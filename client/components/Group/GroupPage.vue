<!-- Page for groups  -->

<template>
    <main>
      <LeftBar />
      <section>
        <header>
          <h2>Groups for @{{ $store.state.username }}</h2>
        </header>
        <CreateGroupForm />
        <DeleteGroupForm />
        <ChangeGroupForm />
        <AddMemberForm />
        <DeleteMemberForm />
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
  
  export default {
    name: 'GroupPage',
    components: {
      LeftBar,
      CreateGroupForm,
      DeleteGroupForm,
      ChangeGroupForm,
      AddMemberForm,
      DeleteMemberForm,
    }
  };
  </script>
  
  <style scoped>
  main {
    margin-left: 10%;
  }
  </style>