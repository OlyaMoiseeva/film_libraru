<template>
	<div class="content-wrapper">
		<section>
			<div class="container">
				<div class="auth">
					<div class="auth__banner">
						<h1 class="ui-title-2">Hello banner</h1>
					</div>
					<div class="auth__form">
						<span class="ui-title-2">Registration</span>
						<form @submit.prevent="onSubmit">
							<div class="form-item" :class="{ errorInput: $v.email.$error }">
								<input
								type="email"
								placeholder="Email"
								v-model="email"
								:class="{ error: $v.email.$error }"
								@change="$v.email.$touch()">
								<div class="error" v-if="!$v.email.required">Field is required</div>
								<div class="error" v-if="!$v.email.email">Email is not correct</div>
							</div>
							<div class="form-item" :class="{ errorInput: $v.password.$error }">
								<input
								type="password"
								placeholder="Password"
								v-model="password"
								:class="{ error: $v.password.$error }"
								@change="$v.password.$touch()">
								<div class="error" v-if="!$v.password.required">Password is required.</div>
								<div class="error" v-if="!$v.password.minLength">Password must have at least {{ $v.password.$params.minLength.min }} letters.</div>
							</div>
							<div class="form-item" :class="{ errorInput: $v.repeatPassword.$error }">
								<input
								type="password"
								placeholder="Repeat your password"
								v-model="repeatPassword"
								:class="{ error: $v.repeatPassword.$error }"
								@change="$v.repeatPassword.$touch()">
								<div class="error" v-if="!$v.repeatPassword.sameAsPassword">Passwords must be identical.</div>
							</div>
							<div class="buttons-list">
								<button 
								class="button button-primary" 
								type="buttton"
								>
									<span v-if="loading">Loading...</span>
									<span v-else>Registration</span>
								</button>
							</div>
							<div class="buttons-list buttons-list--info">
								<p class="typo__p" v-if="submitStatus === 'OK'">Thanks for your submission!</p>
								<p class="typo__p" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
								<p class="typo__p" v-else>{{ submitStatus }}</p>
							</div>
							<div class="buttons-list buttons-list--info">
								<span>Do you have account? <router-link class="" to="/login">Enter Here</router-link></span>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
<script>
	import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
	export default {
		data () {
			return {
				email: '',
				password: '',
				repeatPassword: '',
				submitStatus: null
			}
		},
		validations: {
			email: {
				required,
				email
			},
			password: {
				required,
				minLength: minLength(6)
			},
			repeatPassword: {
				sameAsPassword: sameAs('password')
			}
		},
		methods: {
			onSubmit() {
				this.$v.$touch()
				if (this.$v.$invalid) {
					this.submitStatus = 'ERROR'
				} else {
					const user = {
						email: this.email,
						password: this.password
					}
					this.$store.dispatch('registerUser', user)
						.then(() => {
							this.submitStatus = 'OK'
							this.$router.push('/')
						})
						.catch(err => {
							this.submitStatus = err.message
						})
				}
			}
		},
		computed: {
			loading () {
				return this.$store.getters.loading
			}
		}
	}
</script>
<style lang="scss" scoped>
	.auth {
		display: flex;
		.auth__banner,
		.auth__form {
			width: 50%;
		}
	}
	.form-item {
		.error {
			display: none;
			margin-bottom: 8px;
			font-size: 13px;
			color: #fc5c65;
		}
		&.errorInput {
			.error {
				display: block;
			}
		}
	}
	input {
		&.error {
			border-color: #fc5c65;
			animation: shake .3s;
		}
	}
	.buttons-list {
		text-align: right;
		margin-bottom: 20px;
		&.buttons-list--info {
			text-align: center;
		}
		&:last-child {
			margin-bottom: 0;
		}
	}
	a {
		color: #444ce0;
	}
	@media screen and (max-width: 768px) {
		.auth {
			flex-direction: column;
			.auth__banner,
			.auth__form {
				width: 100%;
				margin-bottom: 30px;
				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}
</style>