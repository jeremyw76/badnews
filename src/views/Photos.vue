<template>
  <div>
    <Navbar></Navbar>
    <div class="level filters">
      <div class="level-left">
        <Paginator v-if="hasManyPages"></Paginator>
      </div>
      <div class="level-right">
        <SearchBar></SearchBar>
      </div>
    </div>
    <PhotoGrid v-if="images.length > 0" :images="images"></PhotoGrid>
    <div v-else><p>No images found</p></div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Paginator from '@/components/Paginator'
import PhotoGrid from '@/components/PhotoGrid'
import SearchBar from '@/components/SearchBar'

export default {
  components: {
    Navbar,
    Paginator,
    PhotoGrid,
    SearchBar
  },
  data: function () {
    return {
    }
  },
  computed: {
    images () {
      return this.$store.state.images
    },
    errors () {
      return this.$store.state.errors
    },
    hasManyPages () {
      return this.$store.state.pagination.pages > 1
    }
  },
  mounted () {
    this.$store.dispatch('loadImages')
  },
}
</script>

<style scoped>
.columns {
  margin-top: 3em;
}

.filters {
  padding-top: 1em;
}

p {
  padding-top: 5em;
}
</style>
