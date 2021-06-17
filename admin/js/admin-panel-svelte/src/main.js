import App from './App.svelte';

const app = new App({
	target: document.getElementById('wpbsv-admin-panel-svelte'),
	props: {
		name: 'world'
	}
});

export default app;