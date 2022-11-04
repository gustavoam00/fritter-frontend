<template>
    <div class="container">
        <div class="main">
        <!-- Reaction system start -->
        <div class="reaction-container"><!-- container div for reaction system -->
            <span class="reaction-btn"> <!-- Default like button -->
                <span class="reaction-btn-emo like-btn-default"></span> <!-- Default like button emotion-->
                <button> React </button> <!-- Default like button text,(Like, wow, sad..) default:Like  -->
                <ul class="emojies-box"> <!-- Reaction buttons container-->
                    <li class="emoji emo-haha" data-reaction="HaHa" @click = "react('haha')"></li>
                    <li class="emoji emo-wow" data-reaction="Wow" @click = "react('wow')"></li>
                    <li class="emoji emo-sad" data-reaction="Sad" @click = "react('sad')"></li>
                    <li class="emoji emo-angry" data-reaction="Angry" @click = "react('angry')"></li>
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
            method: 'POST',
            callback: () => {
                this.$store.commit('alert', {
                    message: 'Successfully reacted!', status: 'success'
                });
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
  font-weight: bold;
  color: #7f7f7f;
  position: relative;
  cursor: pointer;
}

.emojies-box {
  height: 300%;
  width: 600%;
  padding: 30%;
  position: absolute;
  top: -350%;
  left: 0;
  box-shadow: 1px 1px 2px #cccccc, -1px 0px 2px #eeeeee;
  border-radius: 20px;
  display: none;
}

.emoji {
  list-style-type: none;
  cursor: pointer;
  display: inline-block;
  width: 48px;
  height: 48px;
  position: absolute;
  top: 10%;
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
  left: 3%;
  transition-delay: 0s;
  background-image: url('../../public/reactions_love.png');
}

.emo-haha {
  left: 19%;
  transition-delay: 0s;
  background-image: url('../../public/reactions_haha.png');
}

.emo-wow {
  left: 35%;
  transition-delay: 0s;
  background-image: url('../../public/reactions_wow.png');
}

.emo-sad {
  left: 51%;
  transition-delay: 0s;
  background-image: url('../../public/reactions_sad.png');
}

.emo-angry {
  left: 67%;
  transition-delay: 0s;
  background-image: url('../../public/reactions_angry.png');
}

.reaction-btn:hover .emoji {
  opacity: 1;
  /*animation-name: reaction_delay;*/
  animation-duration: .5s;
}

@keyframes reaction_delay {
  0% {
    width: 48px;
    height: 48px;
  }
  50% {
    width: 56px;
    height: 56px;
  }	
  100% {
    width: 48px;
    height: 48px;
  }
}


.reaction-btn:hover .emo-like {
  animation-delay: 0s
}

.reaction-btn:hover .emo-love {
  animation-delay: 0s
}

.reaction-btn:hover .emo-haha {
  animation-delay: 0s
}

.reaction-btn:hover .emo-wow {
  animation-delay: 0s
}

.reaction-btn:hover .emo-sad {
  animation-delay: 0s
}

.reaction-btn:hover .emo-angry {
  animation-delay: 0s
}

.emoji:hover {
  transform: scale(1.3, 1.3);
  top: 2px
}

.emoji::before {
  display: inline-block;
  color: #ffffff;
  text-align: center;
  line-height: 17px;
  font-size: .7em;
  width: 80%;
  height: 17px;
  margin-left: 10%;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  position: absolute;
  top: -25px;
  opacity: 0;
  transition: opacity .2s ease-in-out 0s;
}

.emoji:hover::before {
  opacity: 1
}

.emo-haha::before {
  content: 'Haha'
}

.emo-wow::before {
  content: 'Wow'
}

.emo-sad::before {
  content: 'Sad'
}

.emo-angry::before {
  content: 'Angry'
}

.like-stat {
  margin-top: 10px;
}

.like-btn-haha{
  background-image: url('../../public/reaction-small.png');
  background-repeat: no-repeat;
  background-size: auto;
  background-position: 0 -151px;
}

.like-btn-wow{
  background-image: url('../../public/reaction-small.png');
  background-repeat: no-repeat;
  background-size: auto;
  background-position: -17px -185px;
}

.like-btn-sad{
  background-image: url('../../public/reaction-small.png');
  background-repeat: no-repeat;
  background-size: auto;
  background-position: -17px -168px;
}

.like-btn-angry{
  background-image: url('../../public/reaction-small.png');
  background-repeat: no-repeat;
  background-size: auto;
  background-position: -17px -117px;
}

</style>