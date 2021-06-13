
import { createHooks } from '@wordpress/hooks'

// const root = document.getElementById('wpbsv-auto-upload')
// root.textContent = "Hey there"
// alert('alert')

let globalHooks = createHooks();

const onPostPublished = () => {
	// alert('post published: ' + id)
	alert('post published')
	console.log('post published')
}

// globalHooks.addAction('post_published', 'wpbsv-auto-upload', onPostPublished)
globalHooks.doAction('publish_post')