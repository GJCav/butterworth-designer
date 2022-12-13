<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list class="pl-4 pt-10">
        <v-subheader class="text-h5">
          Navigator
        </v-subheader>
        <v-list-item-group color="primary">
          <v-list-item link nuxt to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
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
    </v-navigation-drawer>

    <v-app-bar app>
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
  }
}
</script>
