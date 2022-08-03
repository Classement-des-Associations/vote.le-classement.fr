import 'unpoly/unpoly.css'
import '../css/app.css'

import 'unpoly'
import Alpine from 'alpinejs'
import focus from '@alpinejs/focus'
import collapse from '@alpinejs/collapse'

Alpine.plugin(focus)
Alpine.plugin(collapse)

Alpine.data('dropdown', () => ({
  open: false,
  toggle() {
    if (this.open) {
      return this.close()
    }

    this.$refs.button.focus()

    this.open = true
  },
  close(focusAfter) {
    if (!this.open) return

    this.open = false

    focusAfter && focusAfter.focus()
  },
}))

window.Alpine = Alpine
Alpine.start()
