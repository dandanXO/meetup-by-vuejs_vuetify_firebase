<template>
  <v-app>
     <v-navigation-drawer temporary  fixed v-model="sideNav">
      <v-list>
        <v-list-tile 
        v-for="item in menuItems"
        :key="item.title" 
        :to="item.link">
        <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile 
        v-if="userAuthenticated"
        @click="onLogout">
        <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Log Out</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click.stop="sideNav = !sideNav"
       class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title >
        <router-link to="/" tag="span" style="cursor: pointer"> Meetup</router-link>
        </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items  class="hidden-xs-only">
          <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
         <v-btn
          v-if="userAuthenticated"
          @click="onLogout"
          flat>
          <v-icon left dark>exit_to_app</v-icon>
          Log Out
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
     <main>
     <router-view> </router-view>
   </main>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false
      }
    },
    computed: {
      menuItems () {
        let menuItems = [
          { icon: 'face', title: 'Sign up', link: '/signup' },
          { icon: 'lock_open', title: 'Sign in', link: '/signin' }
        ]
        if (this.userAuthenticated) {
          menuItems = [
          { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups' },
          { icon: 'room', title: 'Organize Meetup', link: '/meetup/new' },
          { icon: 'person', title: 'Profile', link: '/profile' }]
        }
        return menuItems
      },
      userAuthenticated () {
        return this.$store.getters.user != null && this.$store.getters.user !== undefined
      }
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logout')
      }
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>