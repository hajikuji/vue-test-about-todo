/* Sass Document */
;(function(){
	'use strict'
	function copy(obj) {
		return Object.assign({},obj)
	}
	new Vue({
		el: "#main",
		data: {
			list: [],
			current: {
			title: '...',
			completed: false,
			desc: '...',
			remind_at: '2020-10-01'
			}
		},
		methods: {
			merge: function() {
//				console.log('this.current:',this.current)
				//更新判断
				var is_update = this.current.id
				if(is_update) {
					//定位数据
					var index = this.list.findIndex(function(item){
						return item.id === is_update
					})
					//更新数据
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
				todo.id = this.next_id()
				this.list.push(todo)
				console.log(this.list)
				}
				this.reset_current()
			},
			
			remove: function(index) {
				this.list.splice(index,1)
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
			}
		}
	})
})();
