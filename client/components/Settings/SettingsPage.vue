<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <LeftBar />
    <section>
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
    </section>
    <section>
      <header>
        <h2>Anonymous</h2>
      </header>
      <article v-if="$store.state.anon">
        <SwitchFromAnonForm />
      </article>
      <article v-else>
        <SwitchToAnonForm />
      </article>
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
import LeftBar from '@/components/common/LeftBar.vue';

import ChangeUsernameForm from '@/components/Settings/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Settings/ChangePasswordForm.vue';

import SwitchToAnonForm from '@/components/Settings/SwitchToAnonForm.vue';
import SwitchFromAnonForm from '@/components/Settings/SwitchFromAnonForm.vue';

import DeleteAccountForm from '@/components/Settings/DeleteAccountForm.vue';
import LogoutForm from '@/components/Settings/LogoutForm.vue';

export default {
  name: 'SettingsPage',
  components: {
    LeftBar,
    ChangeUsernameForm,
    ChangePasswordForm,
    SwitchToAnonForm,
    SwitchFromAnonForm,
    DeleteAccountForm,
    LogoutForm
  }
};
</script>

<style scoped>
main {
  margin-left: 10%;
}
</style>