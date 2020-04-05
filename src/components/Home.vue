<template>
	<div class="content-wrapper">
		<section>
			<div class="container">
				<h1 class="ui-title-1">Home</h1>
				<input type="text" placeholder="What we will watch?" v-model="taskTitle" @keyup.enter="newTask" name="">
				<textarea type="text" v-model="taskDescription" @keyup.enter="newTask" name=""></textarea>
				<div class="option-list">
					<input id="radioFilm" class="what-watch--radio" value="Film" v-model="whatWatch" type="radio">
					<label for="radioFilm">Film</label>
					<input id="radioSerial" value="Serial" v-model="whatWatch" class="what-watch--radio" type="radio">
					<label for="radioSerial">Serial</label>
				</div>
				<div class="total-time">

					<div class="total-time__film" v-if="whatWatch === 'Film'">
						<span class="time-title">Hours</span>
						<input class="time-input" type="number" v-model="filmHours">
						<span class="time-title">Minutes</span>
						<input class="time-input" type="number" v-model="filmMinutes">
						<p>{{ filmTime }}</p>
					</div>
					<div class="total-time__serial" v-if="whatWatch === 'Serial'">
						<span class="time-title">How many seasons?</span>
						<input class="time-input" type="number" v-model="serialSeason">
						<span class="time-title">How many series?</span>
						<input class="time-input" type="number" v-model="serialSeries">
						<span class="time-title">How long is one series (minutes)?</span>
						<input class="time-input" type="number" v-model="serialSeriesMinutes">
						<p>{{ serialTime }}</p>
					</div>
				</div>
				<div class="tag-list tag-list--add">
					<div class="ui-tag__wrapper" @click="tagMenuShow = !tagMenuShow">
						<div class="ui-tag">
							<span class="tag-title">Add new</span>
							<span class="button-close" :class="{active: !tagMenuShow}"></span>
						</div>
					</div>
				</div>
				<transition name="fade">
					<div class="tag-list tag-list--menu" v-if="tagMenuShow">
						<input type="text" placeholder="New tag" v-model="tagTitle" @keyup.enter="newTag">
						<div class="button button-default" @click="newTag">Send</div>
					</div>
				</transition>
				<div class="tag-list">
					<transition-group
					enter-active-class="animated fadeInRight"
					leave-active-class="animated fadeOutDown">
						<div class="ui-tag__wrapper" v-for="tag in tags" :key="tag.title">
							<div class="ui-tag" @click="addTagUsed(tag)" :class="{used: tag.use}">
								<span class="teg-title">{{ tag.title }}</span>
								<span class="button-close" @click="deleteTag(tag.id)"></span>
							</div>
						</div>
					</transition-group>
				</div>
				<div class="button-list">
					<div class="button button--round button-primary" @click="newTask">Send</div>
				</div>
			</div>
		</section>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				taskTitle: '',
				taskDescription: '',
				whatWatch: 'Film',
				filmHours: 1,
				filmMinutes: 30,
				serialSeason: 1,
				serialSeries: 11,
				serialSeriesMinutes: 40,
				tagTitle: '',
				tagsUsed: [],
				tagMenuShow: false,
			}
		},
		methods: {
			newTag () {
				if (this.tagTitle === '') {
					return
				}
				const tag = {
					title: this.tagTitle,
					use: false
				}
				this.$store.dispatch('newTag', tag)
				// eslint-disable-next-line
				console.log(tag)
				this.tagTitle = ''
			},
			deleteTag (id) {
				this.$store.dispatch('deleteTag', id)
					.then(() => {
						this.$store.dispatch('loadTags')
					})
			},
			newTask () {
				if (this.taskTitle === '') {
					return
				}
				let time
				if (this.whatWatch === "Film") {
					time = this.filmTime
				} else {
					time = this.serialTime
				}
				const task = {
					title: this.taskTitle,
					description: this.taskDescription,
					whatWatch: this.whatWatch,
					time,
					tags: this.tagsUsed,
					completed: false,
					editing: false
				}
				
				this.$store.dispatch('newTask', task)

				this.taskTitle = ''
				this.taskDescription = ''
				this.tagsUsed = []

				for(let i = 0 ; i < this.tags.length ; i++) {
					this.tags[i].use = false
				}
			},
			addTagUsed(tag) {
				tag.use = !tag.use
				if (tag.use) {
					this.tagsUsed.push({
						title: tag.title
					})
				} else {
					const idx = this.tagsUsed.indexOf(tag.title)
					this.tagsUsed.splice(idx, 1)
				}
			},
			getHoursAndMinutes (minutes) {
				let hours = Math.trunc(minutes / 60)
				let min = minutes % 60
				return hours + 'Hours ' + min + 'Minutes'
			}
		},
		computed: {
			tags () {
				return this.$store.getters.tags
			},
			filmTime () {
				let min = (this.filmHours * 60) + (this.filmMinutes * 1)
				return this.getHoursAndMinutes (min)
			},
			serialTime () {
				let min = this.serialSeason * this.serialSeries * this.serialSeriesMinutes
				return this.getHoursAndMinutes (min)
			}
		}
	}
</script>
<style lang="scss" scoped>
.option-list {
	display: flex;
	.what-watch--radio {
		margin-right: 12px;
	}
	label {
		margin-right: 20px;
		&:last-child {
			margin-bottom: 0;
		}
	}
}
.total-time {
	margin-bottom: 20px;
}
.time-title {
	display: block;
	margin-bottom: 6px;
}
.time-input {
	max-width: 80px;
	margin-right: 10px;
}
// tag list
.tag-list {
	margin-bottom: 20px;
}
.ui-tag__wrapper {
	margin-right: 18px;
	margin-bottom: 10px;
	&:last-child {
		margin-right: 0;
	}
}
.ui-tag .button-close.active {
  transform: rotate(45deg);
}
.ui-tag.used {
  background: #444ce0;
  color: #fff;
}
.ui-tag.used .button-close:before,
.ui-tag.used .button-close:after {
  background: #fff;
}	
.tag-list--menu {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.tag-add--input {
	margin-bottom: 0;
	margin-right: 10px;
	height: 42px;
}
.button-default {
	margin-bottom: 1.111111111111111rem;
	margin-left: 10px;
	height: 42px;
}
</style>