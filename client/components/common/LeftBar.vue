<template>
    <nav>
        <div class="top">
            <h1 class = 'title'> Fritter </h1> 
            <img class = 'icon logo' src="../../public/logo.png">
        </div>
        <div class="paths">
            <router-link to="/home">
                <img class = 'icon' src="../../public/home.png">
            </router-link>
            <router-link to="/groups">
                <img class = 'icon' src="../../public/group.png">
            </router-link>
            <router-link to="/settings">
                <img class = 'icon' src="../../public/settings.png">
            </router-link>
        </div>
        <div class="bottom">
            <p class = "handle">@{{ $store.state.username}}</p>
            <article v-if="$store.state.anon">
                <img class = 'pic' src="../../public/incognito.png">
            </article>
            <article v-else>
                <img class = 'pic' src="../../public/profile.png">
            </article>
            
        </div>
        <section class="alerts">
            <article
                v-for="(status, alert, index) in $store.state.alerts"
                :key="index"
                :class="status"
            >
                <p>{{ alert }}</p>
            </article>
        </section>
    </nav>
</template>

<script>
/**
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    switchToAnon() {
        const params = {
        method: 'POST',
        message: 'Successfully switched to Anonymous!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    switchFromAnon(){
        const params = {
        method: 'DELETE',
        message: 'Successfully switchout out of Anonymous!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
        const options = {
            method: params.method, headers: {'Content-Type': 'application/json'}
        };
        
        try {
            const r = await fetch('/api/anon/session', options);
            if (!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
            }

            this.$store.commit('refreshFreets');

            params.callback();
        } catch (e) {
            this.$set(this.alerts, e, 'error');
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    }
  }
};
*/
</script>

<style scoped>

nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 10%;
    /* max-width: 150px; */
    height: 100%;
    background-color: #ccc;
    display: flex;
    flex-direction: column;
    align-items: center;
    
}
.top {
    width:100%;
    text-align: center;
}
.title {
    padding: 0;
    margin: 0;
    width: 100%;
    font-size: 3vw;
}
.paths{
    width: 100%;
    text-align: center;
    margin-top: 25%;
    display: flex;
    flex-direction: column;
}
.icon {
    width: 50%;
}
.alerts {
    width: 25%;
}
.bottom{
    width:100%;
    text-align: center;
    position: absolute;
    bottom: 0;
}
.handle{
    margin:0;
    padding: 0;
    font-size: 1.25vw;
}
.pic {
    width: 80%;
    margin:10%;
}

</style>
