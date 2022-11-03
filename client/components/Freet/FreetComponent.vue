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
    <div class = actions>

      <button v-if="upvoted" @click="upvote" class = "liked">
        Like
      </button>
      <button v-else @click="upvote">
        Like
      </button>

      <button v-if="downvoted" @click="downvote" class = "disliked">
        Dislike
      </button>
      <button v-else @click="downvote">
        Dislike
      </button>

      <button @click = "react">
        React
      </button>

      <div
          v-if="$store.state.username === freet.author"
      >
        <button 
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button 
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
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
          message: 'Successfully deleted vote!',
          callback: () => {
            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        }
        await this.deleteVote(params);
        if (this.upvoted) {
          this.upcount--;
          this.upvoted = false;
          this.voteId = undefined;
          vote = false;
        } else if (this.downvoted) {
          this.downcount--;
          this.downvoted = false;
        }
      }
      if (vote){
        const params = {
          method: 'POST',
          refresh: true,
          message: 'Successfully liked freet!',
          body: JSON.stringify({up: true}),
          callback: () => {
            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        };
        const vote = (await this.requestVote(params)).vote;
        this.voteId = vote._id;
        this.upcount++;
        this.upvoted = true;
      }
    },
    async downvote() {
      let vote = true;
      if (this.voteId){
        const params = {
          message: 'Successfully deleted vote!',
          callback: () => {
            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        }
        await this.deleteVote(params);
        if (this.downvoted) {
          this.downcount--;
          this.downvoted = false;
          this.voteId = undefined;
          vote = false;
        } else if (this.upvoted) {
          this.upcount--;
          this.upvoted = false;
        }
      }
      if (vote){
        const params = {
          method: 'POST',
          refresh: true,
          message: 'Successfully disliked freet!',
          body: JSON.stringify({up: false}),
          callback: () => {
            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        };
        const vote = (await this.requestVote(params)).vote;
        this.voteId = vote._id;
        this.downcount++;
        this.downvoted = true;
      }
    },
    allVotes(){
      const params = {
        method: 'GET',
        message: '',
        refresh: false,
        callback: () => {
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      return this.requestVote(params);
    },
    react() {

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

        params.callback();
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
        if (params.refresh){
          this.$store.commit('refreshFreets');
        }
        params.callback();
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
        this.$store.commit('refreshFreets');
        params.callback();

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
    border: 1px solid #111;
    padding: 2.5%;
    position: relative;
}
header {
  display: flex;
  flex-direction:row;
}
.actions {
  display: flex;
}

.info {
  font-size: 0.75em;
  position: absolute;
  right:2.5%;

}
.liked{
  background-color: green;
}
.disliked{
  background-color: red;
}
</style>
