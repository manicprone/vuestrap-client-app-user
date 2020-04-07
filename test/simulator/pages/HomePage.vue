<template>
  <div>

    <div class="welcome-message" v-if="activeUser.is_logged_in">
      <div>{{ welcomeMessageText }}</div>
      <div class="smiley">:)</div>
    </div>

    <div v-else>
      <div class="login-message">
        <span>{{ loginText }}</span>
      </div>
      <local-account-login class="login-link" v-on:login="performLogin" />
    </div>

  </div>
</template>

<script>
export default {
  name: 'HomePage',

  computed: {
    activeUser() {
      return this.$store.getters['user/activeUser'];
    },
    loginText() {
      return 'Login with your account';
    },
    welcomeMessageText() {
      return `Welcome, ${this.activeUser.display_name} !`;
    },
  },

  methods: {
    performLogin(creds) {
      return this.$store.dispatch('auth/loginUser', creds)
        .catch(() => {
          console.log('[HomePage] invalid credentials !!!');
        });
    },
  },
};
</script>

<style scoped>

  .login-message {
    font-size: 18px;
    text-align: center;
    margin: 30px auto 30px auto;
    width: 240px;
  }

  .welcome-message {
    font-size: 28px;
    text-align: center;
    margin: 30px auto 30px auto;
  }
  .welcome-message .smiley {
    margin-top: 20px;
  }


</style>
