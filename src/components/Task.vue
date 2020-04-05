<template>
	<div class="content-wrapper">
		<section>
			<div class="container">
				<div class="task-list__header">
					<h1 class="ui-title-1">Tasks</h1>
					<div class="buttons-list">
						<button class="button--round button-default"
						@click="filter = 'active'"
						:class="{used: this.filter === 'active'}"

						>Active</button>
						<button class="button--round button-default"
						@click="filter = 'completed'"
						:class="{used: this.filter === 'completed'}"

						>Completed</button>
						<button class="button--round button-default"
						@click="filter = 'all'"
						:class="{used: this.filter === 'all'}"
						>All</button>
					</div>
				</div>
				<div class="task-list">
					<transition-group name="fade">
						<div class="task-item" v-for="task in tasksFilter" :key="task.id" :class="{ completed: task.completed }">
							<div class="ui-card ui-card--shadow">
								<div class="task-item__info">
									<div class="task-item__main-info">
										<span class="ui-label ui-label--light">{{ task.whatWatch }}</span>
										<span>Total Time: {{ task.time }}</span>
									</div>
									<span class="button-close"
									@click="deleteTask(task.id)"></span>
								</div>
								<div class="task-item__content">
									<div class="task-item-header">
										<div class="ui-checkbox-wrapper">
										<input class="ui-checkbox"
										type="checkbox" v-model="task.completed"
										name="checkbox"
										@click="taskCompleted(task.id, task.completed)">
										</div>
										<span class="ui-title-3">{{ task.title }}</span>
									</div>
									<div class="task-item-body">
										<p class="ui-text-regular">{{ task.description }}</p>
									</div>
									<div class="task-item__foter">
										<div class="tag-list">
											<div>
											<div class="ui-tag__wrapper" v-for="tag in task.tags" :key="tag.title">
												<div class="ui-tag">
													<span class="teg-title">{{ tag.title }}</span>
												</div>
											</div>
											</div>
											<div class="buttons-list">
												<div class="button button--round button-default"
												@click="taskEdit(task.id, task.title, task.description)">Edit</div>
												<div class="button button--round button-primary"
												@click="taskCompleted(task.id, task.completed)"
												:class="[{ 'button-primary': !task.completed }, { 'button-light': task.completed  }]"
												>
													<span v-if="task.completed">Return</span>
													<span v-else>Done</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</transition-group>
				</div>
			</div>
		</section>
		<div class="ui-messageBox__wrapper"
		v-if="editing"
		:class="{active: editing}">
			<div class="ui-messageBox fadeInDown">
				<div class="ui-messageBox__header">
					<span class="messageBox-title">{{  titleEditing }}</span>
					<span class="button-close"
					@click="cancelTaskEdit"></span>
				</div>
				<div class="ui-messageBox__content">
					<p>Title</p>
					<input type="text"
					v-model="titleEditing">
					<p>Description</p>
					<textarea type="text"
					v-model="desrEditing"></textarea>
				</div>
				<div class="ui-messageBox__footer">
					<div class="button button-light"
					@click="cancelTaskEdit">Cansel</div>
					<div class="button button-primary"
					@click="finishTaskEdit">OK</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data () {
			return {
				filter: 'active',
				editing: false,
				titleEditing: '',
				desrEditing: '',
				taskId: null,
				com: false
			}
		},
		methods: {
			taskCompleted (id, completed) {
				completed ? completed = false : completed = true
				this.$store.dispatch('taskCompleted', {id, completed})
			},
			taskEdit (id, title, description) {
				this.editing = !this.editing
				//eslint-disable-next-line
				console.log({id, title, description})
				this.taskId = id
				this.titleEditing = title
				this.desrEditing = description
			},
			cancelTaskEdit () {
				this.editing = !this.editing
				this.taskId = null
				this.titleEditing = ''
				this.desrEditing = ''
			},
			finishTaskEdit () {
				this.$store.dispatch('editTask', {
					id: this.taskId,
					title: this.titleEditing,
					description: this.desrEditing
				})
				this.editing = !this.editing
			},
			deleteTask (id) {
				this.$store.dispatch('deleteTask', id)
					.then(() => {
						this.$store.dispatch('loadTasks')
					})
			}
		},
		computed: {
			tasksFilter () {
				if (this.filter === 'active') {
					return this.$store.getters.taskNotCompleted
				} else if (this.filter === 'completed') {
					return this.$store.getters.taskCompleted
				} else if (this.filter === 'all') {
					return this.$store.getters.tasks
				}
				return this.filter === 'active'
			}
		}
	}
</script>
<style lang="scss" scoped>
.button--round.used {
  background: #444ce0;
  color: #fff;
}
.task-list__header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30px;
	.button--round {
		margin-right: 8px;
	}
	.ui-title-1 {
		margin-bottom: 0;
	}
}
.task-item {
	margin-bottom: 20px;
	&:last-child {
		margin-bottom: 0;
	}
	&.completed {
		.ui-title-3,
		.ui-text-regular,
		.ui-tag {
			text-decoration: line-through;
			color: #909399;
		}
	}
}
.ui-label {
	margin-right: 8px;
}
.task-item__info {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;
}
.button-close {
	width: 20px;
	height: 20px;
}
.task-item-header {
	display: flex;
	align-items: center;
	margin-bottom: 18px;
	.ui-checkbox-wrapper {
		margin-right: 8px;
	}
	.ui-title-3 {
		margin-bottom: 0;
	}
}
.tag-list {
	.buttons-list {
		width: 180px;
		display: flex;
		justify-content: space-between;
	}
  display: flex;
  justify-content: space-between;
}
.active {
	display: flex;
}
</style>