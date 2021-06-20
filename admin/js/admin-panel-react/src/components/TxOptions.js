import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	inputContainer: {
		padding: '1rem 0',
		display: 'flex',
		alignItems: 'center',
		'& label': {
			fontSize: '1rem',
		},
		'& > :not(:first-child)': {
			marginLeft: '.4rem',
		},
		'& input[type="text"]': {
			width: "250px",
		}
	}
})

const protocols = new Map()
protocols.set('B://', '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut')
protocols.set('D://', '19iG3WTYSsbyos3uJ733yK4zEioi1FesNU')
// const protocols = [ 
// 	{
// 		name: 'B://',
// 		prefix: '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut', 
// 	},
// 	{
// 		name: 'D://',
// 		prefix: '19iG3WTYSsbyos3uJ733yK4zEioi1FesNU'
// 	}
// ]

let selectedProtocol = {}

const TxOptions = props => {
	const {
		prefixSelectValue,
		prefixTextValue,
		setPrefixSelect,
		setPrefixText,
	} = props

	const classes = useStyles();

	const currentPrefix = ''

	// Set prefix text input to protocol prefix string
	const handleSelectChange = e => {
		const protocol = e.target.value
		setPrefixSelect(protocol)

		if (protocols.has(protocol)) {
			setPrefixText(protocols.get(protocol))
		}
		else {
			setPrefixText('')
		}
	}

	// Reset prefix select input if text no longer matches protocol input
	const handleTextChange = e => {
		const prefix = e.target.value
		setPrefixText(prefix)

		if (protocols.has(prefixSelectValue)) {
			if (protocols.get(prefixSelectValue) !== prefix) {
				setPrefixSelect('Custom')
			}
		}
	}

	return (
		<div className={classes.inputContainer}>
			<label htmlFor="prefix" id="prefix-label">Prefix:</label>
			<select name="protocol" id="protocol" value={prefixSelectValue} onChange={handleSelectChange}>
				<option value="Custom">Custom</option>
				{
					// protocols.map(protocol => (
					// 	<option value={protocol.name} key={protocol.name}>{protocol.name}</option>
					// ))
					Array.from(protocols.keys(), protocol => (
						<option value={protocol} key={protocol}>{protocol}</option>
					))
				}
				{/* <option value="B">B://</option> */}
			</select>
			<input name="prefix" id="prefix" type="text" value={prefixTextValue} onChange={handleTextChange}/>
		</div>
	)
}

export default TxOptions