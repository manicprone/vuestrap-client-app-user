<template>
  <div v-bind:class="classes">
    <button class="btn btn-language-picker" v-on:click="toggle">
      <span v-if="locales.length > 2" class="label">{{ label }}</span>
      <span v-else>{{ labelToDisplay }}</span>
      <span v-if="locales.length > 2" class="arrow down" />
    </button>
    <div v-click-outside="hide"
         v-bind:style="dropdownStyles"
         class="dropdown-menu" >
      <div v-for="(locale, index) in locales"
           v-on:click="switchLanguage(index)"
           v-bind:class="{ 'dropdown-item': true, 'active': activeIndex === index }">
        {{ locale.label }}
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';

export default {
  name: 'LanguagePicker',

  directives: {
    ClickOutside,
  },

  props: {
    label: {
      type: String,
      default: 'Languages',
    },
    locales: {
      type: Array,
      default: () => [
        { code: 'en-GB', label: 'English' },
        { code: 'zh-HK', label: '繁體中文' },
        { code: 'zh-CN', label: '简体中文' },
      ],
    },
  },

  data() {
    return {
      dropdownStyles: null,
      show: false,
    };
  },

  computed: {
    activeLocale() {
      return this.$store.getters['user/activeLocale'];
    },
    activeIndex() {
      return (this.activeLocale) ? this.getActiveIndex(this.activeLocale) : 0;
    },
    labelToDisplay() {
      if (this.locales.length === 2) {
        const oppositeIndex = this.activeIndex === 0 ? 1 : 0;
        return this.locales[oppositeIndex].label;
      }
      return this.locales[this.activeIndex].label;
    },
    classes() {
      return [
        ...(this.locales.length > 2 ? ['dropdown'] : []),
        'language-picker',
        { show: this.show },
      ];
    },
  },

  mounted() {
    // prevent click outside event with popupItem.
    this.popupItem = this.$el;
  },

  methods: {
    hide() {
      this.show = false;
    },

    toggle() {
      if (this.locales.length > 2) {
        this.show = !this.show;
      } else {
        const index = this.activeIndex === 0 ? 1 : 0;
        this.switchLanguage(index);
      }
    },

    getActiveIndex(code) {
      let index = 0;
      for (let i = 0; i < this.locales.length; i += 1) {
        if (this.locales[i].code === code) {
          index = i;
          break;
        }
      }
      return index;
    },

    switchLanguage(index) {
      this.$store.dispatch('user/setActiveLocale', this.locales[index].code);
      this.$emit('languagePicker/switchLanguage', this.locales[index].code);
      this.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "../styles/variables";
  @import "../styles/buttons";

  .language-picker {
    display: inline-flex;
  }

  .btn-language-picker {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border-color: transparent;
    outline: none;
    padding: .3rem 1rem;
  }

  .dropdown {
    position: relative;
  }

  .dropdown-menu {
    display: none;
    float: left;
    position: absolute;
    top: $button-font-size + 2 * $button-padding-vertical;
    left: auto;
    right: auto;
    min-width: 10rem;
    margin-top: 3px;
    padding: 0;
    background-color: #FFFFFF;
    border-radius: 3px;
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                0 1px 10px 0 rgba(0, 0, 0, 0.10),
                0 2px 4px -1px rgba(0, 0, 0, 0.08);
    list-style: none;
    text-align: left;
    z-index: 999;

    .show & {
      display: block;
    }
  }

  .dropdown-item {
    display: block;
    padding: $dropdown-item-padding;
    background-color: transparent;
    border-bottom: 1px solid $border-color;
    white-space: nowrap;

    &:last-child {
      border-bottom: none;
    }

    &.active {
      color: $color-primary;
    }

    &:hover:not(.active) {
      background-color: #ECECEC;
      cursor: pointer;
    }
  }
</style>
