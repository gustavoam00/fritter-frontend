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
                <img @click = "switchFromAnon" class = 'pic' src="../../public/incognito.png">
            </article>
            <article v-else>
                <img @click = "switchToAnon" class = 'pic' src="../../public/profile.png">
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
export default {
    name: 'LeftBar',
    methods: {
        switchToAnon() {
            const params = {
                method: 'POST',
                message: 'Successfully switched to Anonymous!',
                callback: () => {
                    this.$router.push({name: 'Home'});
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.submit(params);
        },
        switchFromAnon(){
            const params = {
                method: 'DELETE',
                message: 'Successfully switchout out of Anonymous!',
                callback: () => {
                    this.$router.push({name: 'Home'});
                    this.$set(this.alerts, params.message, 'success');
                    setTimeout(() => this.$delete(this.alerts, params.message), 3000);
                }
            };
            this.submit(params);
        },
        async submit(params) {
            const options = {
                method: params.method,
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin' // Sends express-session credentials with request
            };

            try {
                const r = await fetch('/api/anon/session', options);
                if (!r.ok) {
                    // If response is not okay, we throw an error and enter the catch block
                    const res = await r.json();
                    throw new Error(res.error);
                }

                const text = await r.text();
                const res = text ? JSON.parse(text) : {user: null};
                this.$store.commit('setUsername', res.user ? res.user.username : null);
                this.$store.commit('changeAnon', res.user? res.user.anon: false);

                this.$store.commit('refreshFreets');
                location.reload();
                params.callback();

            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}
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
    cursor: default;
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
    cursor: default;
}
.pic {
    width: 80%;
    margin:10%;
    cursor: pointer;
}

</style>
