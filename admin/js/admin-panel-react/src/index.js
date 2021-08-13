import React, { Suspense } from 'react'
import { render } from 'react-dom'
import App from './App'

// import AdminPanel from './components/AdminPanel'
// import DefaultPrefixes from './components/DefaultPrefixes'

// Dynamically render components to avoid loading unused modules
const DefaultPrefixes = React.lazy(() => import('./components/DefaultPrefixes'))
const AdminPanel = React.lazy(() => import('./components/AdminPanel'))

const page = wpbsv_ajax_obj.page


if (page === 'tools') {
	const adminPanelContainer = document.getElementById('wpbsv-admin-panel')
	render(<App><AdminPanel/></App>, document.getElementById('wpbsv-admin-panel'))
}
else if (page === 'settings') {
	render(<App><DefaultPrefixes/></App>, document.getElementById('wpbsv-prefix-container'))
}
else if (page === 'block-editor') {
	// Dynamic import for side effects
	import('./components/MirrorToBSV')
}
