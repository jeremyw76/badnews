<template>
  <nav class="pagination is-centered" role="navigation" aria-label="pagination">
    <a class="pagination-previous" :disabled="!isNotFirstPage" @click="previousPage">Previous</a>
    <a class="pagination-next" :disabled="!isNotLastPage" @click="nextPage">Next page</a>
    <ul class="pagination-list">
      <li v-bind:key="1"><a class="pagination-link" v-bind:class="{'is-current': isCurrent(1)}" :aria-label="goToPageLabel(1)" @click="loadPage(1)">1</a></li>
      <li v-if="isNotNearBeginning"><span class="pagination-ellipsis">&hellip;</span></li>
      <li v-for="index in indicesBetweenEllipses" v-bind:key="index"><a class="pagination-link" v-bind:class="{'is-current': isCurrent(index)}" :aria-label="goToPageLabel(index)" @click="loadPage(index)">{{index}}</a></li>
      <li v-if="isNotNearEnd"><span class="pagination-ellipsis">&hellip;</span></li>
      <li v-bind:key="pages"><a class="pagination-link" v-bind:class="{'is-current': isCurrent(pages)}" :aria-label="goToPageLabel(pages)" @click="loadPage(pages)">{{pages}}</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  methods: {
    goToPageLabel (index) {
      return 'Goto page' + index
    },
    indexAfterEllipses () {
      let indices = currentPage > this.$store.state.pagination.pages - 4 ? [] : [1,2,3]
    },
    loadPage (index) {
      this.$store.commit('setCurrentPage', index)
    },
    previousPage () {
      if (this.currentPage > 1) {
        this.$store.commit('setCurrentPage', this.currentPage - 1)
      }
    },
    nextPage () {
      if (this.currentPage < this.pages) {
        this.$store.commit('setCurrentPage', this.currentPage + 1)
      }
    },
    isCurrent (index) {
      return index == this.currentPage
    }
  },
  computed: {
    pages () {
      return this.$store.state.pagination.pages
    },
    currentPage () {
      return this.$store.state.pagination.current_page
    },
    isNotNearBeginning () {
      return this.$store.state.pagination.current_page > 3
    },
    isNotNearEnd() {
      let pagination = this.$store.state.pagination
      return pagination.pages - pagination.current_page > 1
    },
    isNotFirstPage() {
      return this.$store.state.pagination.current_page > 1
    },
    isNotLastPage() {
      let pagination = this.$store.state.pagination
      return pagination.current_page < pagination.pages
    },
    indicesBetweenEllipses () {
      let indices = []
      let lowerBound = this.currentPage - 1
      let upperBound = this.currentPage + 2

      if (!this.isNotNearBeginning) {
        upperBound = this.pages < 5 ? this.pages : 5
        lowerBound = 2 > this.pages ? this.pages : 2
      }

      if (!this.isNotNearEnd) {
        lowerBound = this.pages - 3 < 2 ? 2 : this.pages - 3
        upperBound = this.pages
      }

      for (var i = lowerBound; i < upperBound; i++) {
        indices.push(i)
      }
      return indices
    }
  }
}
</script>

<style scoped>

</style>
