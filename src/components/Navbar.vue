<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="../assets/images/photosphere.png" width="200" height="41">
        </a>

        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item" @click="redirectToImages">
            Images
          </a>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Categories
            </a>

            <div class="navbar-dropdown">
              <a v-for="category in categories" v-bind:key="category.id" class="navbar-item" @click="setCategory(category.id)">
                {{category.name}}
              </a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div v-if="loggedIn" class="buttons">
              <a class="button is-light" @click="logUserOut">
                Log out
              </a>
            </div>
            <div v-else class="buttons">
              <a class="button is-primary" @click="redirectToSignup">
                <strong>Sign up</strong>
              </a>
              <a class="button is-light" @click="redirectToLogin">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="level">
      <div class="navbar-end">
        <div v-if="cartHasItems" class="button is-info" @click="viewCart">
          <span>Cart</span>
          <span class="icon is-small is-left">
            <font-awesome-icon :icon="['fas', 'shopping-cart']"></font-awesome-icon>
          </span>
        </div>
        <div v-if="cartHasItems" class="button is-warning sub-nav-bar" @click="loadCheckout">
          <span>Checkout</span>
          <span class="icon is-small is-left">
            <font-awesome-icon :icon="['fas', 'shopping-basket']"></font-awesome-icon>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'es6-promise/auto'
import { store } from 'vuex'

export default {
  data () {
    return {
    }
  },
  methods: {
    redirectToHome () {
      this.$router.push('/')
    },
    redirectToLogin () {
      this.$router.push('/login')
    },
    redirectToSignup () {
      this.$router.push('/signup')
    },
    redirectToImages () {
      this.$store.commit('setCategory', undefined)
      this.$store.dispatch('loadImages')
      this.$router.push('/photos')
    },
    logUserOut () {
      this.$http.secured.delete('/users/sign_out.json')
      this.$store.commit('logOutUser')
      this.$store.commit('clearCSRFToken')
      this.$store.dispatch('clearCart')
    },
    loadCheckout () {
      this.$router.push('/checkout')
    },
    setCategory (categoryId) {
      this.$store.commit('setCategory', categoryId)
      this.$store.dispatch('loadImages')
      this.$router.push('/photos')
    },
    viewCart () {
      this.$router.push('/cart')
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.loggedIn
    },
    cartHasItems () {
      return this.$store.state.cart.items.length > 0
    },
    categories () {
      return this.$store.state.tags
    }
  }
}
</script>

<style scoped>
  .sub-nav-bar {
    margin-left: 1em;
  }
</style>
