import Vue from 'vue'
import Vuex from 'vuex'
import 'es6-promise/auto'
import { securedAxiosInstance, plainAxiosInstance } from './backend/index'
import Stripe from './backend/stripe'

Vue.use(Vuex)

const postToCartUpdate = (state, errorHandler) => {
  securedAxiosInstance.post('/carts/update.json', { items: state.cart.items })
      .catch(error => errorHandler(error))
}

const initialState = () => { return {
  showSingleImageModal: false,
  modalImage: null,
  loggedIn: false,
  user: {
    name: null,
    paymentTokens: [],
    addresses: [],
  },
  currentAddress: {
    address1: undefined,
    address2: undefined,
    city: undefined,
    province: undefined,
    country: undefined,
    postalCode: undefined
  },
  cart: {
    items: []
  },
  pagination: {
    pages: 1,
    per_page: 10,
    current_page: 1
  },
  previousPage: '/',
  images: [],
  count: 0,
  errors: {
    customerDataError: undefined,
    orderProcessError: undefined,
    connectionError: undefined
  },
  provinces: [],
  taxes: {
    canCalculateTaxes: false,
    provinceId: undefined,
    rate: 0
  },
  shouldSaveAddress: true,
  tags: []
}}

export default {
  store: new Vuex.Store({
    state: {},
    getters: {
      currentProvince: state => {
        return state.provinces.find(province => province.name === state.currentAddress.province)
      },
      selectedProvinceIsValid: state => {
        const provinceNames = state.provinces.map(province => province.name)

        return provinceNames !== [] && provinceNames.includes(state.currentAddress.province)
      },
      canCalculateTaxes: (state, getters) => {
        return getters.selectedProvinceIsValid
      },
      isValidOrder (state, getters) {
        return getters.canCalculateTaxes &&
               state.currentAddress !== undefined &&
               Object.keys(state.currentAddress).filter(key =>
                key !== 'address2' &&
                (state.currentAddress[key] === undefined || state.currentAddress[key].trim() == '')
                ).length === 0
      }
    },
    mutations: {
      showSingleImageModal (state, image) {
        state.showSingleImageModal = true;
        state.modalImage = image;
      },
      hideSingleImageModal (state) {
        state.showSingleImageModal = false;
        state.modalImage = null;
      },
      logInUser (state, user) {
        state.loggedIn = true;
        state.user.name = user.name;
      },
      logOutUser (state) {
        state.loggedIn = false;
        state.user = {
          name: null,
          paymentTokens: [],
          addresses: []
        }
      },
      addToCart (state, cartItem) {
        let index = state.cart.items.findIndex(item => item.id === cartItem.id)

        if (index > -1) {
          state.cart.items[index].qty += 1
        } else {
          cartItem.qty = 1
          state.cart.items.push(cartItem)
        }
      },
      removeFromCart (state, cartItem) {
        let index = state.cart.items.findIndex(item => item.id === cartItem.id)

        if (index > -1) {
          if (state.cart.items[index].qty - 1 < 1) {
            state.cart.items.splice(index, 1)
          } else {
            state.cart.items[index].qty -= 1
          }
        }
      },
      canCalculateTaxes (state, payload)
      {
        state.taxes.provinceId = payload.provinceId
        state.taxes.canCalculateTaxes = payload.validProvince
        state.taxes.rate = state.provinces.find(province => province.id == payload.provinceId).tax_rate
      },
      clearStore (state) {
        this.replaceState(initialState())
      },
      clearTaxData (state) {
        state.taxes.canCalculateTaxes = false
        state.taxes.provinceId = null
        state.taxes.rate = 0
      },
      setShouldSaveAddress(state, shouldSaveAddress) {
        state.shouldSaveAddress = shouldSaveAddress
      },
      setAddress(state, address) {
        state.currentAddress = {
          address1: address.address1,
        address2: address.address2,
        city: address.city,
        province: address.province.name,
        country: address.province.country,
        postalCode: address.postal_code
        }
      },
      setImages(state, images)
      {
        state.images = images
      },
      setCurrentPage(state, index)
      {
        if (state.pagination.current_page != index) {
          state.pagination.current_page = index
          this.dispatch('loadImages')
        }
      },
      stripeSuccess (response) {
        console.log('Stripe Success!!')
      },
      stripeError (error) {
        console.log('Stripe Error!')
      }
    },
    actions: {
      addToCartAsync ({ commit, state }, cartItem) {
        commit('addToCart', cartItem)
        postToCartUpdate(state, error => commit('removeFromCart', cartItem))
      },
      removeFromCartAsync ({ commit, state }, cartItem) {
        commit('removeFromCart', cartItem)
        postToCartUpdate(state, error => commit('addToCart', cartItem))
      },
      clearCart({ commit, state }) {
        commit('clearCart')
        postToCartUpdate(state, {})
      },
      loadInitialData({ commit, state }) {
        commit('clearStore')
        plainAxiosInstance.get('sessions/new.json')
          .then(response => {
            if (response.data.cart) {
              response.data.cart.forEach(item => {
                commit('addToCart', item)
              })
            }
            if (response.data.pagination) {
              this.state.pagination.per_page = response.data.pagination.per_page
              this.state.pagination.pages = response.data.pagination.pages
              this.state.pagination.page = 2
            }

            let tags = response.data.tags
            if (tags !== undefined) {
              this.state.tags = []

              tags.forEach(tag => {
                this.state.tags.push(tag)
              }
            }


            let session = response.data.session
            if (session === undefined) return

            if (session.customer) {
              this.commit('logInUser', response.data.session.customer)
            }

            if (session.cart) {
              session.cart.forEach(item => {
                this.state.cart.items.push({
                  type: item.type,
                  id: item.id,
                  qty: item.quantity
                })
              })
            }
          }).catch(error => {
            state.errors.connectionError = 'Unable to connect.'
          })
      },
      loadImages({ commit, state }) {
        plainAxiosInstance.get('/photos', {
          params: {
            page: state.pagination.current_page,
            per_page: state.pagination.per_page
          }
        })
        .then(response => {
          let knownIds = state.images.map(image => image.id)
          let unknownImages = response.data.images.filter(image => !knownIds.includes(image.id))
          commit('setImages', response.data.images)
          state.pagination.current_page = response.data.page
          state.pagination.per_page = response.data.per_page
          state.pagination.pages = response.date.pages
        })
        .catch(error => {
          state.errors.connectionError = error
        })
      },
      retrieveCartImages({ commit, state }) {
        let cartImageIds = state.cart.items.map(item => { return  item.id })
        plainAxiosInstance.get('/photos', { params: { ids: cartImageIds }})
        .then(response => {
          let knownIds = state.images.map(image => image.id)
          let unknownImages = response.data.images.filter(image => !knownIds.includes(image.id))
          commit('setImages', [...state.images, ...unknownImages])
        })
        .catch(error => {
          state.errors.connectionError = error
        })
      },
      loadCheckout({ commit, state }) {
        securedAxiosInstance.post('/checkout.json')
          .then(response => {
            state.user.addresses = response.data.addresses
            state.provinces = response.data.provinces
            state.errors.customerDataError = null
          })
          .catch(error => {
            state.errors.customerDataError = error
          })
      },
      processOrder({ commit, state }) {
        const orderPayload = {
          cart: state.cart,
          currentAddress: state.currentAddress,
          userId: state.user.id,
          provinceId: state.provinces.find(province => province.name === state.currentAddress.province).id,
          saveAddress: state.shouldSaveAddress
        }

        securedAxiosInstance.post('/payments/create.json', orderPayload)
          .then(response => {
            Stripe.sessionId = response.data.sessionId
            Stripe.sendToCheckout(commit.stripeSuccess, commit.stripeError)
          }).catch(error => {
            state.errors.orderProcessError = error
          })
      }
    }
  })
}
