<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app class="d-print-none">
      <v-list class="pl-4 pt-10">
        <v-subheader class="text-h5">
          Navigator
        </v-subheader>
        <v-list-item-group color="primary">
          <v-list-item link nuxt to="/">
            <v-list-item-icon>
              <v-icon>mdi-file-document-check-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Document</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link nuxt to="/LPF">
            <v-list-item-icon>
              <v-icon>mdi-link</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Low-Pass Filter</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link nuxt to="/HPF">
            <v-list-item-icon>
              <v-icon>mdi-link</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>High-Pass Filter</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-list class="pl-4 pt-10">
        <v-subheader class="text-h5">
          Actions
        </v-subheader>
        <v-list-item @click="renderMath">
          <v-list-item-icon>
            <v-icon color="primary">mdi-math-integral-box</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Render Math</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="scroll_to_top">
          <v-list-item-icon>
            <v-icon color="primary">mdi-arrow-up-bold-box</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>To Top</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="scroll_to_bottom">
          <v-list-item-icon>
            <v-icon color="primary">mdi-arrow-down-bold-box</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>To Bottom</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app class="d-print-none">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-h4 font-weight-bold">
        Butterworth-Sallen-Key Filter Designer
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: true
    }
  },

  methods: {
    renderMath() {
      if (window.MathJax) {
        window.MathJax.texReset()
        window.MathJax.typeset()
      }
    },

    scroll_to_bottom() {
      this.$vuetify.goTo(document.body.clientHeight, { duration: 500 })
    },

    scroll_to_top() {
      this.$vuetify.goTo(0, { duration: 500 })
    }
  },
}
</script>
