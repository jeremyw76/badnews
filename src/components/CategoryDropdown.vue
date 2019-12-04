<template>
  <div class="dropdown" v-bind:class="{'is-active': dropdownIsVisible}">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="showDropdown" @blur="hideDropdown">
        <span>{{selectedSearchCategoryName}}</span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <a v-for="category in categories" v-bind:key="category.id" class="dropdown-item" @mousedown="setSearchCategory(category.id)">
          {{category.name}}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import 'es6-promise/auto'
import { store } from 'vuex'

export default {
  data: function () {
    return {
      dropdownIsVisible: false
    }
  },
  methods: {
    setSearchCategory (id) {
      this.$store.commit('setSelectedSearchCategoryId', id)
      this.hideDropdown()
    },
    showDropdown () {
      this.dropdownIsVisible = true
    },
    hideDropdown () {
      this.dropdownIsVisible = false
    }
  },
  computed: {
    categories () {
      return this.$store.state.tags
    },
    selectedSearchCategoryName () {
      let category = this.$store.state.tags.find(tag => tag.id == this.$store.state.selectedSearchCategoryId)

      return category == undefined ? 'All' : category.name
    }
  }
}
</script>

<style scoped>
.dropdown-trigger button {
  width: 9em;
}
</style>
