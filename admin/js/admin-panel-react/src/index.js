import React from 'react'
import { render } from 'react-dom'

import AdminPanel from './components/AdminPanel'
import DefaultPrefixes from './components/DefaultPrefixes'

render(<AdminPanel />, document.getElementById('wpbsv-prefix-container'))
// render(<DefaultPrefixes />, document.getElementById('wpbsv-default-prefixes'))

// adminPanel = document.getElementById('wpbsv-admin-panel')
// defaultPrefixes = document.getElementById('wpbsv-default-prefixes')

// if (adminPanel) render(<AdminPanel />, adminPanel)
// if (defaultPrefixes) render(<DefaultPrefixes />, defaultPrefixes)

// render(<DefaultPrefixes />, document.getElementById('wpbsv-default-prefixes'))