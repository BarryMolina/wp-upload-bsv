import React from 'react'
import { render } from 'react-dom'

import AdminPanel from './components/AdminPanel'
import DefaultPrefixes from './components/DefaultPrefixes'

const adminPanel = document.getElementById('wpbsv-admin-panel')
const defaultPrefixes = document.getElementById('wpbsv-prefix-container')

if (adminPanel) render(<AdminPanel />, adminPanel)
if (defaultPrefixes) render(<DefaultPrefixes />, defaultPrefixes)
