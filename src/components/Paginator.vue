<template>
  <nav class="pagination is-centered" role="navigation" aria-label="pagination">
    <a class="pagination-previous">Previous</a>
    <a class="pagination-next">Next page</a>
    <ul class="pagination-list">
      <li v-bind:key="1"><a class="pagination-link" :aria-label="goToPageLabel(1)">1</a></li>
      <li v-for="index in indicesBetweenEllipses" v-bind:key="index"><a class="pagination-link" :aria-label="goToPageLabel(index)">{{index}}</a></li>
      <li><span class="pagination-ellipsis">&hellip;</span></li>
    </ul>
  </nav>
</template>

<script>
export default {
  data () {
    return {
      inidices: {
        centreFirst: 1,
        centreLast: 1
      }
    }
  },
  methods: {
    goToPageLabel (index) {
      return 'Goto page' + index
    },
    indicesBetweenEllipses () {
      let currentPage = this.currentPage
      let pages = this.pages
      let indices = []

      if (pages < 6) {
        this.indices.centreFirst = 2
        this.indices.centreLast = pages - 1
      } else {
        this.indices.centreFirst = currentPage < 4 ? 2 : currentPage - 1
        this.indices.centreLast = currentPage > pages - 3 ? pages - 1 : currentPage + 1
      }

      for (i = this.indices.centreFirst; i <= this.indices.centreLast && i < pages; i++)
      {
        indices.push(i)
      }

      return indices
    },
    indexAfterEllipses () {
      let indices = currentPage > this.$store.state.pagination.pages - 4 ? [] : [1,2,3]
    }
  },
  computed: {
    pages () {
      return this.$store.state.pagination.pages
    },
    currentPage () {
      return this.$store.state.pagination.current_page
    }
  }
}
</script>

<style scoped>

</style>
