<template>

  <div class="page">

    <div class="component-wrapper">
      <div>(default)</div>
      <user-menu
        v-bind:items="items" />
    </div>

    <div class="component-wrapper">
      <div>useArrowIcon = true</div>
      <user-menu
        v-bind:items="items"
        v-bind:useArrowIcon="true" />
    </div>

  </div>

</template>

<script>
export default {
  name: 'UserMenuPage',

  data() {
    return {
      items: [
        { name: 'home', label: 'Home Page' },
        { name: 'public', label: 'Public Page' },
        { name: 'private', label: 'Private Page' },
      ],
    };
  },
};
</script>

<style lang="scss">
  .component-wrapper {
    border: 1px solid #c9c9c9;
    padding: 20px;
    margin: 0 auto 10px auto;
    width: 300px;
    border-radius: 3px;

    display: flex;
    flex-direction: column;

    > div {
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
