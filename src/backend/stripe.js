export default {
  instance: Stripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY_DEV),
  sessionId: undefined,
  sendToCheckout (successCallback, errorCallback)  {
    this.instance.redirectToCheckout({
      sessionId: this.sessionId
    }).then(successCallback).catch(errorCallback)
  }
}
