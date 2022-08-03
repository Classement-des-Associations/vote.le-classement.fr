import 'unpoly/unpoly.css'
import '../css/app.css'

import 'unpoly'
import Alpine from 'alpinejs'
import focus from '@alpinejs/focus'
import collapse from '@alpinejs/collapse'

up.fragment.config.mainTargets.push('[layout-main]')

window.Alpine = Alpine

Alpine.plugin(focus)
Alpine.plugin(collapse)

document.addEventListener('alpine:initialized', () => {
  // Select all anchors with the attribut 'up-target'
  const anchors = document.querySelectorAll('[mobile-nav] a[up-target]')
  // Prevent default behavior for all anchors (used for x-teleport)
  for (const anchor of anchors) {
    anchor.addEventListener('click', (e) => {
      e.preventDefault()
      const target = anchor.getAttribute('up-target')
      const url = anchor.getAttribute('href')
      up.navigate({ target, url })
    })
  }
})

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

Alpine.start()
