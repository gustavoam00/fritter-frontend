<template>
    <article class="group">
      <header>
        <h3 class="name">
          {{ group.name }}
        </h3>
      </header>
      <article 
        class = "members"
        v-if="group.members.length !== 0"
      >
        <div
            v-for="member in group.members"
        >
            <p>{{member}}</p>
        </div>
      </article>
    <article class = members v-else>
        <p>No Members</p>
    </article>
    <div class = "bottom">
        <input
            type="text"
            v-model="input"
            :placeholder = "placeholder"
        >
        <div class = "buttons">
            <div class = "button-label">
                <button @click="addMember">
                    Add Member
                </button>
            </div>
            <div class = "button-label">
                <button @click="removeMember">
                    Remove Member
                </button>
            </div>
            <div class = "button-label">
                <button @click="changeGroup">
                    Change Name
                </button>
            </div>
            <div class = "button-label">
                <button @click="deleteGroup">
                    Delete
                </button>
            </div>
        </div>
    </div>
    </article>
</template>  

<script>
export default {
    name: 'GroupComponent',
    props: {
        group: {
        type: Object,
        required: true
        }
    },
    data() {
        return {
            input:"",
            placeholder: "",
            alerts: {},
        };
    }, 
    methods:{
        deleteGroup(){
            const params = {
                method: 'DELETE',
                body: JSON.stringify({groupName: this.group.name}),
                callback: () => {
                this.$store.commit('alert', {
                    message: 'Successfully deleted group!', status: 'success'
                });
                }
            };
        this.request(params);
        },
        changeGroup(){
            this.placeholder = "(new name)";
            const params = {
                method: 'PUT',
                body: JSON.stringify({groupName: this.group.name, newName: this.input}),
                callback: () => {
                this.$store.commit('alert', {
                    message: 'Successfully changed group name!', status: 'success'
                });
                }
            };
            this.request(params);
        },
        addMember(){
            this.placeholder = "(username)";
            const params = {
                method: 'POST',
                body: JSON.stringify({groupName: this.group.name, username: this.input}),
                callback: () => {
                    this.$store.commit('alert', {
                        message: 'Successfully added member!', status: 'success'
                    });
                }
            };
            this.requestMember(params);
        },
        removeMember(){
            this.placeholder = "(username)";
            const params = {
                method: 'DELETE',
                body: JSON.stringify({groupName: this.group.name, username: this.input}),
                callback: () => {
                    this.$store.commit('alert', {
                        message: 'Successfully removed member!', status: 'success'
                    });
                }
            };
            this.requestMember(params);
        },
        async request(params) {
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };

            if (params.body) {
                options.body = params.body;
            }

            try {
                const r = await fetch('/api/groups/', options);
                this.input = '';
                this.placeholder = '';
                if (!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
                }

                this.$store.commit('refreshGroups');

            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async requestMember(params) {
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json'}
            };

            if (params.body) {
                options.body = params.body;
            }

            try {
                const r = await fetch('/api/groups/members', options);
                this.input = '';
                this.placeholder = '';

                if (!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
                }
                
                this.$store.commit('refreshGroups');

            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
    }
}
</script>

<style scoped>
input {
    width:100%;
    margin-bottom: 5%;
}
.group {
    border: 2px solid var(--primary-color);
    border-radius: 20px;
    width: 47.5%;
    padding: 2.5%;
    margin-bottom: 5%;
    position:relative;
}
.name{
    margin:0;
    padding:0;
}
p{
    margin:0;
    padding:0;
}
.members{
   margin-top: 2.5%;
   margin-bottom: 2.5%; 
}
.button-label{
    display:flex;
    flex-direction: column;
}
.buttons {
    width:100%;
    display: flex;
    justify-content: space-between;
}
</style>