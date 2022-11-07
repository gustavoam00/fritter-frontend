<template>
    <div class="container">
        <div class="main">
        <!-- Reaction system start -->
        <div class="reaction-container"><!-- container div for reaction system -->
            <span class="reaction-btn"> <!-- Default like button -->
                <span class="reaction-btn-emo like-btn-default"></span> <!-- Default like button emotion-->
                <img src="../../public/react.png" class="reaction-icon">
                <ul class="emojies-box"> <!-- Reaction buttons container-->
                    <li class="emoji emo-haha" data-reaction="HaHa" @click = "react('haha')"></li>
                    <li class="emoji emo-wow" data-reaction="Wow" @click = "react('wow')"></li>
                    <li class="emoji emo-sad" data-reaction="Sad" @click = "react('sad')"></li>
                    <li class="emoji emo-angry" data-reaction="Angry" @click = "react('angry')"></li>
                    <li class="emoji x" data-reaction="X" @click = "deleteReact"></li>
                </ul>
            </span>
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
.reaction-container{
  max-width:100%;
  position: relative;
}

.reaction-btn {
  position: relative;
}
.reaction-icon {
  height: 40px;
  width: 40px;
  margin: 0;
  padding: 0;
}

.emojies-box {
  width: 250px;
  height: 60px;
  padding: 30%;
  position: absolute;
  top: -102px;
  left: 0;
  box-shadow: 1px 1px 2px #cccccc, -1px 0px 2px #eeeeee;
  border-radius: 20px;
  display: none;
}

.emoji {
  list-style-type: none;
  cursor: pointer;
  display: inline-block;
  height: 40px;
  width: 40px;
  margin-right: 2.5px;
  margin-left: 2.5px;
  opacity: 0;
  transform: scale(1, 1);
  transition: opacity .5s ease-in-out 1s, transform .07s ease-in-out 0s, top .07s ease-in-out 0s;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center
}

.reaction-btn:hover .emojies-box {
  display: block;
}

.emo-love {
  background-image: url('../../public/reactions_love.png');
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

.reaction-btn:hover .emoji {
  opacity: 1;
  animation-duration: .5s;
}

.emoji:hover {
  transform: scale(1.2, 1.2);
}

.emoji::before {
  display: inline-block;
  color: #ffffff;
  text-align: center;
  line-height: 17px;
  font-size: .5em;
  width: 100%;
  height: 45%;
  background-color: #ca0fff;
  border-radius: 20px;
  position: absolute;
  top: -25px;
  opacity: 0;
  transition: opacity .2s ease-in-out 0s;
}

.emoji:hover::before {
  opacity: 1;
}

.emo-haha::before {
  content: 'Haha';
}

.emo-wow::before {
  content: 'Wow';
}

.emo-sad::before {
  content: 'Sad';
}

.emo-angry::before {
  content: 'Angry';
}

.x::before {
  font-size: 0.18em;
  content: 'Delete Reaction';
}
.count {
  display: inline-block;
  color: #ffffff;
  text-align: center;
  line-height: 17px;
  font-size: 0.7em;
  width: 40px;
  height: 1.2em;
  background-color: #ca0fff;
  position: relative;
  border-radius: 20px;
  opacity: 1;
  transition: opacity .2s ease-in-out 0s;
}
</style>