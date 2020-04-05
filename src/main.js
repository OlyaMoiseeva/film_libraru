import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Uimini from 'uimini/dist/css/uimini.css'
import VueRouter from 'vue-router'
import App from './App.vue'
import firebase from 'firebase/app'
import store from './store'

import Home from '@/components/Home'
import Task from '@/components/Task'
import Login from '@/components/Auth/Login'
import Registration from '@/components/Auth/Registration'
import Cats from '@/components/Auth/Cats'

import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'
import 'firebase/storage'

Vue.use(Vuelidate, Uimini)
Vue.use(VueRouter)
Vue.config.productionTip = false

const firebaseConfig = {
	apiKey: 'AIzaSyCNUhR0bKOA6XcFvVhKNKfMORtgwxF3PVA',
	authDomain: 'time-libraru.firebaseapp.com',
	databaseURL: 'https://time-libraru.firebaseio.com',
	projectId: 'time-libraru',
	storageBucket: 'time-libraru.appspot.com',
	messagingSenderId: '742095186879',
	appId: '1:742095186879:web:095018e3b3b22e47b4cf0a',
	measurementId: 'G-HY2WN6YRHL'
};
firebase.initializeApp(firebaseConfig);

const router = new VueRouter({
	mode: 'history',
  routes: [
  {
			path: '/',
			name: 'home',
			component: Home,
			beforeEnter (to, from, next) {
				bestAuth().then(() => {
					store.getters.checkUser ? next() : next('/login')
				})
			}
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/task',
			name: 'task',
			component: Task,
			beforeEnter (to, from, next) {
				bestAuth().then(() => {
					store.getters.checkUser ? next() : next('/login')
				})
			}
		},
		{
			path: '/registration',
			name: 'registration',
			component: Registration
		},
		{
			path: '/cats',
			name: 'cats',
			component: Cats
		}],
})

const app = new Vue({
  router,
  store,
  render(h) {
		return h(App)
  }, 
}).$mount('#app')

function bestAuth() {
	return new Promise(
		function auth(resolve) {
			firebase.auth().onAuthStateChanged(user => resolve(user))
		}
	)
	.then((user) => {
		if (user) {
			app.$store.dispatch('loggedUser', user)
		}
		app.$store.dispatch('loadTags')
		app.$store.dispatch('loadTasks')
	})
} 



