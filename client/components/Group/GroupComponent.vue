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
            <div v-for="member in group.members">
                <p>@{{member}}</p>
            </div>
        </article>
        <article class = members v-else>
            <p>No Members</p>
        </article>
        <div class = "bottom">
            <div v-if="editing">
                <input
                    type="text"
                    v-model="input"
                    :placeholder = "placeholder"
                >
                <div class = "button-label">
                    <button @click="call" type = "submit" class = "button">
                        {{this.editType}}
                    </button>
                </div>
                    
            </div>
            <div v-else>
                <div class = "buttons">
                    <div class = "button-label">
                        <button @click="startAdd" class = "button">
                            Add Member
                        </button>
                    </div>
                    <div class = "button-label">
                        <button @click="startRemove" class = "button">
                            Remove Member
                        </button>
                    </div>
                    <div class = "button-label">
                        <button @click="startChange" class = "button">
                            Change Name
                        </button>
                    </div>
                    <div class = "button-label">
                        <button @click="deleteGroup" class = "button">
                            Delete Group
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <section class="alerts">
            <article
                v-for="(status, alert, index) in alerts"
                :key="index"
                :class="status"
            >
                <p>{{ alert }}</p>
            </article>
        </section>
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
            editing: false,
            editType: "",
            placeholder: "",
            alerts: {},
        };
    }, 
    methods:{
        startChange(){
            this.editing = true;
            this.editType = 'Change Name';
            this.placeholder = "(new name)";
        },
        startAdd(){
            this.editing = true;
            this.editType = 'Add Member';
            this.placeholder = "(username)";
        },
        startRemove(){
            this.editing = true;
            this.editType = 'Remove Member';
            this.placeholder = "(username)";
        },
        call(){
            if (this.editType == 'Change Name') this.changeName();
            else if (this.editType == 'Add Member') this.addMember();
            else if (this.editType == 'Remove Member') this.removeMember();
            this.editType = '';
        },
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
        changeName(){
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
            let username = this.input;
            if (username.substring(0,1) === '@'){
                username = username.substring(1)
            }
            const params = {
                method: 'POST',
                body: JSON.stringify({groupName: this.group.name, username: username}),
                callback: () => {
                    this.$store.commit('alert', {
                        message: 'Successfully added member!', status: 'success'
                    });
                }
            };
            this.requestMember(params);
        },
        removeMember(){
            let username = this.input;
            if (username.substring(0,1) === '@'){
                username = username.substring(1)
            }
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
                this.editing = false;
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
                this.editing = false;

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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    width:24%;
    display:flex;
    flex-direction: column;
}
.buttons {
    width:100%;
    display: flex;
    justify-content: space-between;
}
.button{
    font-size: 0.75em;
    height:100%
}
.label{
  color: #ffffff;
  text-align: center;
  line-height: 17px;
  font-size: 0.7em;
  width: fit-content + 1em;
  height: 1.2em;
  background-color: var(--primary-color);
  position: relative;
  top: 5px;
  border-radius: 20px;
  opacity: 0;
  transition: opacity .2s ease-in-out 0s;
}
.button-label:hover .label{
  opacity: 1;
}

</style>