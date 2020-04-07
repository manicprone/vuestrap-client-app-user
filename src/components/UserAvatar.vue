<template>
  <div v-if="user" class="user-avatar" v-bind:style="avatarBaseStyle">

    <div class="image-wrapper" v-bind:style="imageWrapperStyle">
      <div v-bind:class="avatarImageClass"
           v-bind:style="avatarImageStyle">
      </div>
    </div>

    <div v-if="showDisplayName" class="display-name">
      {{ user.display_name }}
    </div>

  </div>
</template>

<script>
export default {
  name: 'UserAvatar',

  props: {
    user: {
      type: Object,
      default: null,
    },
    size: {
      type: Number,
      default: 32,
    },
    showDisplayName: {
      type: Boolean,
      default: false,
    },
    showUsername: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    avatarBaseStyle() {
      return `line-height: ${this.size}px;`;
    },
    avatarURL() {
      // TODO: Rethink how to handle this logic !!!
      // const existingURL = (this.size <= 50) ? this.user.avatar_thumb_url : this.user.avatar_url;
      const existingURL = this.user.avatar_url;
      return existingURL || '/static/img/icons/default-user-avatar.svg';
    },
    imageWrapperStyle() {
      return `height: ${this.size}px; width: ${this.size}px`;
    },
    avatarImageClass() {
      return 'avatar-image';
    },
    avatarImageStyle() {
      return `background-image: url(${this.avatarURL})`;
    },
  },
};
</script>

<style scoped>

  .image-wrapper {
    display: inline-block;
    vertical-align: top;
    user-select: none;
  }

  .avatar-image {
    display: inline-block;
    height: 100%;
    width: 100%;
    background-color: #fff;
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    border-radius: 50%;
  }

  .display-name {
    display: inline-block;
    margin: 0 0 0 10px;
  }

</style>
