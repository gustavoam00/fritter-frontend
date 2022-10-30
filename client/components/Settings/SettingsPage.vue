<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
    </section>
    <section>
      <header>
        <h2>Groups</h2>
      </header>
      <CreateGroupForm />
      <DeleteGroupForm />
      <ChangeGroupForm />
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Settings/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Settings/ChangePasswordForm.vue';
import CreateGroupForm from '@/components/Settings/CreateGroupForm.vue';
import DeleteGroupForm from '@/components/Settings/DeleteGroupForm.vue';
import ChangeGroupForm from '@/components/Settings/ChangeGroupForm.vue';
import DeleteAccountForm from '@/components/Settings/DeleteAccountForm.vue';
import LogoutForm from '@/components/Settings/LogoutForm.vue';

export default {
  name: 'SettingsPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    CreateGroupForm,
    DeleteGroupForm,
    ChangeGroupForm,
    DeleteAccountForm,
    LogoutForm
  }
};
</script>
