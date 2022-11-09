<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <header>
      <h1>
        <img src = "logo.png" class = "logo">
        Welcome to Fritter 
      </h1>
      <h3>Please sign in or create an account to proceed</h3>
    </header>
    <section>
      <header>
        <h2>New to Fritter?</h2>
      </header>
      <RegisterForm />
    </section>
    <section>
      <header>
        <h2>Have an account?</h2>
      </header>
      <LoginForm />
    </section>
  </main>
</template>

<script>
import RegisterForm from '@/components/Login/RegisterForm.vue';
import LoginForm from '@/components/Login/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: {
    RegisterForm,
    LoginForm
  }
};
</script>

<style scoped>
.logo{
  height: 0.8em;
}
</style>
