/* Sass Document */
;(function(){
	'use strict'
	function copy(obj) {
		return Object.assign({},obj)
	}
	
	var Event = new Vue()
	var alert_sound = document.getElementById("alert-sound")
	
	Vue.component('task',{
		template: '#task-tpl',
		props: ['todo'],
		methods: {
			action: function(name, params) {
				Event.$emit(name,params)
			}
		}
	})
	 new Vue({
		el: "#main",
		data: {
			list: [],
			last_id: 0,
			current: {
			title: '...',
			completed: false,
			desc: '...',
			remind_at: '2020-10-01'
			}
		},
		mounted: function() {
			var me = this
			this.list = ms.get("list") || this.list
			this.last_id = ms.get("last_id") || this.last_id
//			this.check_alerts()
			setInterval(function(){
			me.check_alerts()
			},1000)
			Event.$on('remove', function(params){
				if (params) {
					me.remove(params)
				}
			})
			Event.$on('toggle_complete', function(params){
				if (params) {
					me.toggle_complete(params)
				}
			})
			Event.$on('setCurrent', function(params){
				if (params) {
					me.setCurrent(params)
				}
			})
			Event.$on('toggle_detail', function(params){
				if (params) {
					me.toggle_detail(params)
				}
			})
			
		},
		methods: {
			//提醒功能
			check_alerts: function() {
			var me = this
			this.list.forEach(function(row,i){
				var remind_at = row.remind_at
				if (!remind_at || row.alert_confirmed) {
					return
				} else {
					var remind_at = new Date(remind_at)
					var timestamp = remind_at.getTime()
					var now = new Date().getTime()
//					console.log(now)
//					console.log(timestamp)
					//时间到提醒
					if (now >= timestamp) {
						alert_sound.play()
						var confirmed = confirm(row.title)
						Vue.set(me.list[i],'alert_confirmed',confirmed)
				}
				}
			})
			},
			merge: function() {
//				console.log('this.current:',this.current)
				//更新判断
				var is_update,
					id
				
				 is_update = id = this.current.id
				if(is_update) {
					//定位数据
					var index = this.find_index_by_id(id)
					
					//更新数据(vue中的数组更新检测需要set)
						Vue.set(this.list,index,copy(this.current))
//					this.list[index] = copy(this.current)
				} else {
					//增加数据
				var title = this.current.title
				if(!title) {
					return
				}
					//数据提交渲染
				var todo = copy(this.current)
				//todo.id = this.next_id()
				this.last_id++
				ms.set('last_id',this.last_id)
				todo.id = this.last_id
				this.list.push(todo)
//				console.log(this.list)
				}
//				ms.set("list",this.list)
				this.reset_current()
			},
			//显示详情
			toggle_detail: function(id) {
				var index = this.find_index_by_id(id)
			Vue.set(this.list[index],'show_detail',!this.list[index].show_detail)
			},
			//删除数据
			remove: function(id) {
				var index = this.find_index_by_id(id)
				this.list.splice(index,1)
//				ms.set("list",this.list)
			},
			//设置单独id
			next_id: function() {
				return (this.list.length + 1)
			},
			//更新当前数据
			setCurrent: function(todo) {
				this.current = copy(todo)
			},
			//清空
			reset_current: function() {
				this.setCurrent({})
			},
			//寻找id
			find_index_by_id: function(id) {
				return this.list.findIndex(function(item) {
					return item.id === id
				})
			},
			//控制完成状态
			toggle_complete: function(id) {
				var i = this.find_index_by_id(id)
				Vue.set(this.list[i],'completed',!this.list[i].completed)
//				this.list[i].completed = this.list[i].completed
			}
		},
		//监听数组变化
		watch: {
			list: {
				deep: true,
				handler: function(n, o) {
					if (n) {
						ms.set("list",n)
					} else {
						ms.set("list",[])
					}
				}
			}
		}
	})
})();
