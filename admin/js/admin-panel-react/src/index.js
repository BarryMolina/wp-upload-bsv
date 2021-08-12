import React, { Suspense } from 'react'
import { render } from 'react-dom'

// import AdminPanel from './components/AdminPanel'
// import DefaultPrefixes from './components/DefaultPrefixes'

const adminPanelContainer = document.getElementById('wpbsv-admin-panel')
const defaultPrefixesContainer = document.getElementById('wpbsv-prefix-container')

const App = (props) => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			{props.children}
		</Suspense>
	)
}

// Dynamically render components to avoid loading unused modules
const DefaultPrefixes = React.lazy(() => import('./components/DefaultPrefixes'))
const AdminPanel = React.lazy(() => import('./components/AdminPanel'))

if (adminPanelContainer) {
	render(<App><AdminPanel/></App>, adminPanelContainer)
}
else if (defaultPrefixesContainer) {
	render(<App><DefaultPrefixes/></App>, defaultPrefixesContainer)
}
