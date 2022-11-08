<template>
    <div class="container">
        <div class="main">
        <!-- Reaction system start -->
        <div class="reaction-btn"><!-- container div for reaction system -->
                <img 
                v-if="!reacted"
                src="../../public/react.png" 
                class="reaction-icon"
                >
                <img 
                v-else-if="type == 'haha'"
                src="../../public/reactions_haha.png" 
                class="reaction-icon"
                >
                <img 
                v-else-if="type == 'wow'"
                src="../../public/reactions_wow.png" 
                class="reaction-icon"
                >
                <img 
                v-else-if="type == 'sad'"
                src="../../public/reactions_sad.png" 
                class="reaction-icon"
                >
                <img 
                v-else-if="type == 'angry'"
                src="../../public/reactions_angry.png" 
                class="reaction-icon"
                >
                
                <div class="emojies-box"> <!-- Reaction buttons container-->
                    <div class="emoji-count">
                      <div class="emoji emo-haha" @click = "react('haha')"></div>
                      <div class="counter">{{haha_count}}</div>
                    </div>
                    <div class="emoji-count">
                      <div class="emoji emo-wow" @click = "react('wow')"></div>
                      <div class="counter">{{wow_count}}</div>
                    </div>
                    <div class="emoji-count">
                      <div class="emoji emo-sad" @click = "react('sad')"></div>
                      <div class="counter">{{sad_count}}</div>
                    </div>
                    <div class="emoji-count">
                      <div class="emoji emo-angry" @click = "react('angry')"></div>
                      <div class="counter">{{angry_count}}</div>
                    </div>
                    <div class="emoji-count">
                      <div class="emoji x" @click = "deleteReact"></div>
                      <div class="counter"> Delete</div>
                    </div>
                </div>
        </div>
        <!-- Reaction system end -->
        </div>
    </div>
</template>

<script>
export default {
  name: 'ReactionComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
        alerts: {},
        reacted: false,
        type: undefined,
        id: undefined,
        haha_count: 0,
        wow_count: 0,
        sad_count: 0,
        angry_count: 0,
    };
  },
  async mounted() {
    const options = {
        method: 'GET', headers: {'Content-Type': 'application/json'}
    };
    const user = (await (await fetch('/api/users/', options)).json()).user;

    const allReactions = await this.allReactions();

    for (const react of allReactions){
        if (react.authorId === user._id){
            this.reacted = true;
            this.type = react.emoji;
            this.id = react._id;
        }
        if (react.emoji == 'haha'){
          this.haha_count++;
        } else if (react.emoji == 'wow'){
          this.wow_count++;
        } else if (react.emoji == 'sad'){
          this.sad_count++;
        } else if (react.emoji == 'angry'){
          this.angry_count++;
        }
    }
  },
  methods: {
    async react(emoji){
        if (this.reacted) {
            if (emoji == this.type) {return}
            else {await this.deleteReact()}
        }
        const params = {
            body: JSON.stringify({
               emoji: emoji, 
            }),
            message: 'Successfully reacted!',
            method: 'POST',
            callback: () => {
              this.$set(this.alerts, params.message, 'success');
              setTimeout(() => this.$delete(this.alerts, params.message), 3000);
            }
        };
        const res = await this.requestReact(params);
        if (res) {
            this.reacted = true;
            this.type = emoji;
            this.id = res.reaction._id;
            if (emoji == 'haha'){
              this.haha_count++;
            } else if (emoji === 'wow'){
              this.wow_count++;
            } else if (emoji === 'sad'){
              this.sad_count++;
            } else if (emoji === 'angry'){
              this.angry_count++;
            }
        }
    },
    async requestReact(params) {
      const options = {
        method: params.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin', // Sends express-session credentials with request
        body: params.body,
      };

      try {
        const r = await fetch(`/api/reactions/${this.freet._id}`, options);
        const res = await r.json();

        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          throw new Error(res.error);
        }

        params.callback();
        return res;

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async deleteReact(){
        const options = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin',
        };
        try {
        const r = await fetch(`/api/reactions/${this.id}`, options);
        const res = await r.json();

        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          throw new Error(res.error);
        }

        if (this.type == 'haha'){
          this.haha_count--;
        } else if (this.type === 'wow'){
          this.wow_count--;
        } else if (this.type === 'sad'){
          this.sad_count--;
        } else if (this.type === 'angry'){
          this.angry_count--;
        }
        this.reacted =  false;
        this.type = undefined;
        this.id = undefined;
        this.$store.commit('alert', {
            message: 'Successfully deleted reaction!', status: 'success'
        });

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    allReactions(){
      const params = {
        method: 'GET',
        callback: () => {
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      return this.requestReact(params);
    },
  }
};
</script>

<style scoped>

.reaction-icon {
  height: 40px;
  width: 40px;
  margin: 0;
  padding: 0;
}

.emojies-box {
  width: fit-content;
  height: 60px;
  padding: 10px;
  position: absolute;
  top: -10px;
  left: 40px;
  box-shadow: 1px 1px 2px #cccccc, -1px 0px 2px #eeeeee;
  border-radius: 20px;
  display: none;
}

.emoji {
  cursor: pointer;
  height: 40px;
  width: 40px;
  margin-right: 2.5px;
  margin-left: 2.5px;
  opacity: 0;
  transform: scale(1, 1);
  transition: opacity .5s ease-in-out 1s, transform .07s ease-in-out 0s, top .07s ease-in-out 0s;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center
}
.reaction-btn {
  position: relative;
}

.reaction-btn:hover .emojies-box {
  display: flex;
  flex-direction: row;
}
.reaction-btn:hover .emoji {
  opacity: 1;
  animation-duration: .5s;
}

.emo-haha {
  background-image: url('../../public/reactions_haha.png');
}

.emo-wow {
  background-image: url('../../public/reactions_wow.png');
}

.emo-sad {
  background-image: url('../../public/reactions_sad.png');
}

.emo-angry {
  background-image: url('../../public/reactions_angry.png');
}

.x {
  background-image: url('../../public/x_icon.png');
}

.emoji:hover {
  transform: scale(1.2, 1.2);
}
.counter {
  display: inline-block;
  color: #ffffff;
  text-align: center;
  line-height: 17px;
  font-size: 0.7em;
  width: 45px;
  height: 1.2em;
  position: absolute;
  top: 50px;
  background-color: var(--primary-color);
  border-radius: 20px;
  margin-top: 10px;
  opacity: 0;
  transition: opacity .2s ease-in-out 0s;
}
.emoji-count{
  display:flex;
  flex-direction: column;
}

.emoji-count:hover .counter{
  opacity: 1;
}
</style>