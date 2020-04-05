<template lang="pug">
  <div id="app">
    <header>
      <div class="navbar">
        <div class="container">
          <div class="navbar-content">
            <router-link class="header-logo" to="/">Film library
            </router-link>
            <div class="button-burger" @click="menuShow = !menuShow" :class="{ active: menuShow }">
              <span class="line line-1"></span>
              <span class="line line-2"></span>
              <span class="line line-3"></span>
            </div>
            <div class="navbar-list__wrapper" :class="{ active: menuShow }">
              <ul class="navbar-list">
                <li class="navbar-item" v-for="link in linkMenu" :key="link.title" @click="menuShow = false" >
                  <router-link class="navbar-link" :to="`${link.url}`">{{ link.title }}</router-link>
                <li class="navbar-item" v-if="checkUser" @click="logout">
                  <span class="navbar-link">Logout</span>
                </li>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        menuShow: false
      }
    },
    methods: {
      logout () {
        this.$store.dispatch('logoutUser')
        this.$router.push('/login')
      }
    },
    computed: {
      checkUser () {
        return this.$store.getters.checkUser
      },
      linkMenu () {
        if (this.checkUser) {
          return [
          {title: 'Home', url: '/'},
          {title: 'Tasks', url: '/task'},
          {title: 'Cats', url: '/cats'}
          ]
        }
        return [
          {title: 'Login', url: '/login'},
          {title: 'Registration', url: '/registration'}
        ]
      }
    }
  }
</script>
<style lang="scss">
  @import './assets/animation.scss'
</style>
