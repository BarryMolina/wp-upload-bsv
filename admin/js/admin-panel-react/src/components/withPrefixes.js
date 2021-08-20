import React, { useState } from 'react'

const protocolList = [
	['B:// (Default)', '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut'],
	['D://', '19iG3WTYSsbyos3uJ733yK4zEioi1FesNU']
]

// Define protocol list map 
const protocolMap = new Map(protocolList)

// Reverse map it as well
const prefixMap = new Map(
	protocolList.map(x => [x[1], x[0]])
)

const withPrefixes = (Component) => (props) => { 

	const [prefixSelectValues, setPrefixSelectValues] = useState(['Custom'])
	const [prefixTextValues, setPrefixTextValues] = useState([''])

	// Called only from this function
	const setPrefixSelect = (newValue, i) => {
		let values = prefixSelectValues.slice()
		values[i] = newValue
		setPrefixSelectValues(values)
	}

	// Called only from this function
	const setPrefixText = (newValue, i) => {
		let values = prefixTextValues.slice()
		values[i] = newValue
		setPrefixTextValues(values)
	}

	// Called by child components
	const prefixSelectHandler = (protocol, i) => {
		setPrefixSelect(protocol, i)

		// Set prefix text based on protocol selected
		if (protocolMap.has(protocol)) {
			setPrefixText(protocolMap.get(protocol), i)
		}
		else {
			setPrefixText('', i)
		}
	}

	// Called by child components
	const prefixTextHandler = (prefix, i) => {
		setPrefixText(prefix, i)

		// Reset prefix select input if text no longer matches protocol
		if (protocolMap.has(prefixSelectValues[i])) {
			if (protocolMap.get(prefixSelectValues[i]) !== prefix) {
				setPrefixSelect('Custom', i)
			}
		}
		// Change protocol select option based on prefix text
		if (prefixMap.has(prefix)) {
			setPrefixSelect(prefixMap.get(prefix), i)
		}
	}

	// Add a new prefix
	const addPrefixHandler = () => {
		let selectValues = prefixSelectValues.slice()
		let textValues = prefixTextValues.slice()
		selectValues.push('Custom')
		textValues.push('')

		setPrefixSelectValues(selectValues)
		setPrefixTextValues(textValues)
	}

	// Add many prefixes at once
	const addManyPrefix = prefixes => {
		setPrefixTextValues(prefixes)
		setPrefixSelectValues(prefixes.map(prefix => {
			if (prefixMap.has(prefix)) {
				return prefixMap.get(prefix)
			}
			return 'Custom'
		}))
	}

	// Remove prefix
	const deletePrefixHandler = prefixIdx => {
		let selectValues = prefixSelectValues.slice()
		let textValues = prefixTextValues.slice()
		selectValues.splice(prefixIdx, 1)
		textValues.splice(prefixIdx, 1)

		setPrefixSelectValues(selectValues)
		setPrefixTextValues(textValues)
	}

	return (
		<Component
			protocols={protocolMap}
			prefixTextValues={prefixTextValues}
			prefixSelectValues={prefixSelectValues}
			prefixSelectHandler={prefixSelectHandler}
			prefixTextHandler={prefixTextHandler}
			addPrefixHandler={addPrefixHandler}
			addManyPrefix={addManyPrefix}
			deletePrefixHandler={deletePrefixHandler}
			{ ...props }
		/>
	)
 }

 export default withPrefixes
