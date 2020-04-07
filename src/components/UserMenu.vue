<template>
  <div v-bind:class="classes">
    <slot></slot>
    <button class="user-menu-button" v-if="!hasSlotData"
        v-bind:style="styles"
        v-on:click="toggle">
      <img class="user-menu-icon" src="../assets/icons/arrow-dropdown.svg" v-if="useArrowIcon" />
      <img class="user-menu-icon" src="../assets/icons/menu.svg" v-else />
    </button>
    <div v-click-outside="hide"
         v-bind:style="dropdownStyles"
         class="dropdown-menu">
      <router-link v-for="item in items"
                   v-bind:key="item.name"
                   v-bind:to="{ name: item.name }"
                   v-on:click.native="hide"
                   class="dropdown-item">
        {{ item.label }}
      </router-link>
      <template v-if="showLogoutInMenu">
        <span class="dropdown-divider" />
        <a v-on:click="performLogout" class="dropdown-item logout">Log Out</a>
      </template>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';

export default {
  name: 'UserMenu',

  directives: {
    ClickOutside,
  },

  data() {
    return {
      show: false,
      dropdownStyles: null,
    };
  },

  props: {
    items: {
      type: Array,
      default: null,
    },
    includeLogout: {
      type: Boolean,
      default: true,
    },
    useArrowIcon: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 40,
    },
  },

  computed: {
    activeUser() {
      return this.$store.getters['user/activeUser'];
    },
    showLogoutInMenu() {
      return (this.activeUser.is_logged_in && this.includeLogout);
    },
    classes() {
      return [
        'user-menu',
        'dropdown',
        { show: this.show },
      ];
    },
    styles() {
      return {
        height: `${this.size}px`,
        width: `${this.size}px`,
      };
    },
    hasSlotData() {
      return this.$slots.default;
    },
  },

  mounted() {
    this.dropdownStyles = this.getDropdownStyles();

    // prevent click outside event with popupItem.
    this.popupItem = this.$el;
  },

  methods: {
    hide() {
      this.show = false;
      this.$emit('userMenu/hideMenu');
    },

    toggle() {
      this.show = !this.show;
      this.$emit(`userMenu/${this.show ? 'showMenu' : 'hideMenu'}`);
    },

    performLogout() {
      this.$store.dispatch('auth/logoutUser')
        .then(() => { this.$router.push('/'); });
    },

    getDropdownStyles() {
      const xPos = this.offset(this.$el).left;

      return this.viewport().width - 160 < xPos
        ? { right: 0 }
        : { left: 0 };
    },

    offset(el) {
      const rect = el.getBoundingClientRect();
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
      };
    },

    viewport() {
      const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      return {
        height,
        width,
      };
    },
  },
};
</script>

<style scoped>
  .user-menu-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
  }

  .user-menu-icon {
    height: 1.5rem;
    width: 1.5rem;
  }

  .dropdown {
    position: relative;
  }

  .dropdown-menu {
    display: none;
    float: left;
    position: absolute;
    left: auto;
    right: auto;
    min-width: 10rem;
    margin-top: 3px;
    padding: 0;
    background-color: #ffffff;
    border-radius: 3px;
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                0 1px 10px 0 rgba(0, 0, 0, 0.10),
                0 2px 4px -1px rgba(0, 0, 0, 0.08);
    list-style: none;
    text-align: left;
    z-index: 999;
  }

  .dropdown-divider {
    display: block;
    height: 1px;
    background-color: rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .dropdown-item {
    display: block;
    padding: .4rem 1rem;
    background-color: transparent;
    white-space: nowrap;
  }

  .dropdown-item.logout {
    padding-bottom: .5rem;
  }

  .dropdown-item:hover {
    background-color: #f8f9fa;
  }

  .show .dropdown-menu {
    display: block;
  }
</style>
