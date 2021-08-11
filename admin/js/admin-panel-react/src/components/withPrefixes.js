import React, { useState } from 'react'

const protocolList = [
	['B://', '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut'],
	['D://', '19iG3WTYSsbyos3uJ733yK4zEioi1FesNU']
]

// Define protocol list map 
const protocols = new Map(protocolList)

// Reverse map it as well
const prefixes = new Map(
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

		if (protocols.has(protocol)) {
			setPrefixText(protocols.get(protocol), i)
		}
		else {
			setPrefixText('', i)
		}
	}

	// Called by child components
	const prefixTextHandler = (prefix, i) => {
		setPrefixText(prefix, i)

		// Keep protocol select option and prefix text values synced
		if (protocols.has(prefixSelectValues[i])) {
			if (protocols.get(prefixSelectValues[i]) !== prefix) {
				setPrefixSelect('Custom', i)
			}
		}
		if (prefixes.has(prefix)) {
			setPrefixSelect(prefixes.get(prefix), i)
		}
	}

	const addPrefixHandler = () => {
		let selectValues = prefixSelectValues.slice()
		let textValues = prefixTextValues.slice()
		selectValues.push('Custom')
		textValues.push('')

		setPrefixSelectValues(selectValues)
		setPrefixTextValues(textValues)
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
			protocols={protocols}
			prefixTextValues={prefixTextValues}
			prefixSelectValues={prefixSelectValues}
			prefixSelectHandler={prefixSelectHandler}
			prefixTextHandler={prefixTextHandler}
			addPrefixHandler={addPrefixHandler}
			deletePrefixHandler={deletePrefixHandler}
			{ ...props }
		/>
	)
 }

 export default withPrefixes
