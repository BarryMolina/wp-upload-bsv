
console.log('hello from invisibleMB')
console.log(wpbsv_ajax_obj)

// const hooks = wp.hooks.createHooks()
// console.log(wp.hooks)
// console.log(hooks)

// const onPublish = () => {
// 	console.log('published')
// }
// wp.hooks.addAction('publish_post', 'some_namespace', onPublish)
// wp.hooks.addAction( 'all', 'namespace', onPublish )
// hooks.addAction( 'all', 'namespace', onPublish )

// console.log(wp.data)
// wp.data.subscribe( () => {
// 	let isSavingPost = wp.data.select('core/editor').isSavingPost();
// 	let isAutosavingPost = wp.data.select('core/editor').isAutosavingPost();

// 	if (isSavingPost && !isAutosavingPost) {
// 		console.log('saving')
// 	}
// })
console.log(wp.data.select('core/editor'))
console.log(wp.data.select('core/editor').getCurrentPost())


