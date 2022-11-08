<!-- Reusable component representing a single freet and its actfreet.authorions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        @{{ freet.author }}
      </h3>
      <p class="info">
        {{ freet.dateModified }}
        <i v-if="freet.edited">(edited)</i>
      </p>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <div class = "buttons">
        <div class = "button-label">
          <div
            v-if="upvoted" 
            @click="upvote" 
            class = "icon filled-like icon-number"
          ></div>

          <div
            v-else @click="upvote" 
            class = "icon like icon-number"
          ></div>
          <div class = "count">
            {{up}}
          </div>
        </div>
        
        <div class="button-label">
          <div
            v-if="downvoted" 
            @click="downvote" 
            class = "icon filled-dislike icon-number"
          ></div>

          <div  
            v-else @click="downvote" 
            class = "icon dislike icon-number"
          ></div>
          <div class = "count">
            {{down}}
          </div>
        </div>
        

        <ReactionComponent 
        :freet = "freet"
        />

      <div class = "modify">
        <div
            v-if="$store.state.username === freet.author"
        > 
          <div 
            class="editing"
            v-if="editing"
          >
            <div class = "button-label" @click="submitEdit">
              <div class = "icon save"></div>
              <div class = "label">Save</div>
            </div>
            <div class = "button-label" @click="stopEditing">
              <div class = "icon discard"></div>
              <div class = "label">Discard</div>
            </div>
          </div>

          <div
            class="editing"
            v-else
          > 
            <div class = "button-label" @click="startEditing">
              <div class = "icon edit"></div>
              <div class = "label">Edit</div>
            </div>
            <div class = "button-label" @click="deleteFreet">
              <div class = "icon delete"></div>
              <div class = "label">Delete</div>
            </div>
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
import ReactionComponent from '@/components/Freet/ReactionComponent.vue';

export default {
  name: 'FreetComponent',
  components: {ReactionComponent},
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      upvoted: false,
      downvoted: false,
      voteId: undefined,
      up: 0,
      down: 0,
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  async mounted() {
    const options = {
        method: 'GET', headers: {'Content-Type': 'application/json'}
    };
    const user = (await (await fetch('/api/users/', options)).json()).user;

    const allVotes = await this.allVotes();
    let upcount = 0;
    let downcount = 0;

    for (const vote of allVotes) {
      if (vote.up){
        if (vote.authorId === user._id){
          this.upvoted = true;
          this.voteId = vote._id;
        }
        upcount++;
      } else {
        if (vote.authorId === user._id){
          this.downvoted = true;
          this.voteId = vote._id;
        }
        downcount++;
      }
    }

    this.up = upcount;
    this.down = downcount;
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async upvote() {
      let vote = true;
      if (this.voteId){
        const params = {
          callback: () => {
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        }
        await this.deleteVote(params);
        if (this.upvoted) {
          this.up--;
          this.upvoted = false;
          this.voteId = undefined;
          vote = false;
        } else if (this.downvoted) {
          this.down--;
          this.downvoted = false;
        }
      }
      if (vote){
        const params = {
          method: 'POST',
          body: JSON.stringify({up: true}),
          callback: () => {
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        };
        const vote = (await this.requestVote(params)).vote;
        this.voteId = vote._id;
        this.up++;
        this.upvoted = true;
      }
      this.$store.commit('refreshFreets');
    },
    async downvote() {
      let vote = true;
      if (this.voteId){
        const params = {
          callback: () => {
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        }
        await this.deleteVote(params);
        if (this.downvoted) {
          this.down--;
          this.downvoted = false;
          this.voteId = undefined;
          vote = false;
        } else if (this.upvoted) {
          this.up--;
          this.upvoted = false;
        }
      }
      if (vote){
        const params = {
          method: 'POST',
          body: JSON.stringify({up: false}),
          callback: () => {
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        };
        const vote = (await this.requestVote(params)).vote;
        this.voteId = vote._id;
        this.down++;
        this.downvoted = true;
      }
      this.$store.commit('refreshFreets');
    },
    allVotes(){
      const params = {
        method: 'GET',
        message: '',
        callback: () => {
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      return this.requestVote(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async requestVote(params) {
      /**
       * Submits a request to the votes's endpoint
       * @param params - Options for the request
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/votes/${this.freet._id}`, options);
        const res = await r.json();

        if (!r.ok) {
          throw new Error(res.error);
        }
        return res;

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async deleteVote(params) {
      /**
       * Submits a request to the votes's endpoint
       * @param params - Options for the request
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: 'DELETE', headers: {'Content-Type': 'application/json'}
      };

      try {
        const r = await fetch(`/api/votes/${this.voteId}`, options);
        const res = await r.json();

        if (!r.ok) {
          throw new Error(res.error);
        }

      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border: 2px solid var(--primary-color);
    border-radius: 20px;
    margin: 0.5%;
    padding: 2.5%;
    position: relative;
}
header {
  display: flex;
  flex-direction:row;
}
.author{
  color: var(--primary-color);
}
.buttons {
  width:100%;
  display: flex;
  justify-content: space-between;
}
.modify {
  width: 75%;
  display: flex;
  flex-direction: row-reverse;
}

.info {
  font-size: 0.75em;
  position: absolute;
  right:2.5%;
}
.icon{
  height:40px;
  width:40px;
  padding:0;
  margin:0;
  list-style-type: none;
  cursor: pointer;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center
}

.filled-like{
  background-image: url("../../public/heart_filled.png");
}

.like{
  background-image: url("../../public/heart.png");
}
.filled-dislike{
  background-image:url("../../public/broken_heart_filled.png");
}
.dislike{
  background-image:url("../../public/broken_heart.png");
}
.save{
  background-image:url("../../public/save.webp");
}
.discard{
  background-image:url("../../public/x_icon_black.png");
}
.edit{
  background-image: url("../../public/pencil.png");
}
.delete{
  background-image:url("../../public/trash.png");
}

.button-label{
  display:flex;
  flex-direction: column;
}

.count {
  display: inline-block;
  color: #ffffff;
  text-align: center;
  line-height: 17px;
  font-size: 0.75em;
  width: 40px;
  height: 1.2em;
  background-color: var(--primary-color);
  position: relative;
  border-radius: 20px;
  opacity: 1;
  transition: opacity .2s ease-in-out 0s;
}
.label{
  color: #ffffff;
  text-align: center;
  line-height: 17px;
  font-size: 0.7em;
  width: 40px;
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

.icon:hover {
  transform: scale(1.2, 1.2);
}

.editing {
  display:flex;
  flex-direction: row;
}
</style>
