<template>
  <div class="level">
    <div class="level-left">
      <div class="level-item">
        <div class="field has-addons">
          <CategoryDropdown></CategoryDropdown>
          <p class="control">
            <input class="input" type="text" placeholder="Search images" v-model="searchText">
          </p>
          <p class="control">
            <button class="button" @click="clickSearch" v-bind:disabled="hasValidSearchText">
              Search
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'es6-promise/auto'
import { store } from 'vuex'
import CategoryDropdown from './CategoryDropdown'

export default {
  data: function () {
    return {
      searchText: ''
    }
  },
  methods: {
    clickSearch () {
      this.$store.commit('setSearchText', this.searchText.trim())
      this.$store.commit('setCategory', this.$store.state.selectedSearchCategoryId)
      this.$store.dispatch('loadImages')
      this.$store.commit('setSearchText', undefined)
    }
  },
  components: {
    CategoryDropdown
  },
  computed: {
    hasValidSearchText () {
      return this.searchText.trim() == ''
    }
  }
}
</script>

<style scoped>
</style>
