import React, { Suspense } from 'react'

const App = (props) => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			{props.children}
		</Suspense>
	)
}

export default App