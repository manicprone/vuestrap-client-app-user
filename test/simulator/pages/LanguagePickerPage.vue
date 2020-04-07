<template>

  <div class="page">
    <h1>LanguagePicker</h1>

    <section class="section api">
      <code>&lt;language-picker /&gt;</code>
    </section>

    <section class="section examples">
      <h2>active locale: {{ activeLocale }}</h2>

      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>Description</th>
            <th>Props</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <language-picker />
            </td>
            <td>
              Default
            </td>
            <td>
            </td>
          </tr>

          <tr>
            <td>
              <language-picker v-bind:locales="locales1" />
            </td>
            <td>
              Custom locales
            </td>
            <td>
              <code>locales="[{ code: 'en-GB', label: 'English' }]"</code>
            </td>
          </tr>

          <tr>
            <td>
              <language-picker label="語言" />
            </td>
            <td>
              Custom label
            </td>
            <td>
              <code>label="語言"</code>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

  </div>

</template>

<script>
export default {
  name: 'LanguagePickerPage',

  data() {
    return {
      locales1: [
        { code: 'en-GB', label: 'English' },
        { code: 'zh-HK', label: '繁體中文' },
      ]
    };
  },

  computed: {
    activeLocale() {
      return this.$store.getters['user/activeLocale'];
    },
  },
};
</script>

<style scoped>
  .row {
    margin-bottom: 1rem;
  }
</style>
