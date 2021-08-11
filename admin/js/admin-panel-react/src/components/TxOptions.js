import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
	inputContainer: {
		// padding: '.4rem 0',
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

// const protocolList = [
// 	['B://', '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut'],
// 	['D://', '19iG3WTYSsbyos3uJ733yK4zEioi1FesNU']
// ]

// // Define protocol list map 
// const protocols = new Map(protocolList)

// // Reverse map it as well
// const prefixes = new Map(
// 	protocolList.map(x => [x[1], x[0]])
// )





// protocols.set('B://', '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut')
// protocols.set('D://', '19iG3WTYSsbyos3uJ733yK4zEioi1FesNU')

// const protocols = {
// 	'B://': '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut',
// 	'D://': '19iG3WTYSsbyos3uJ733yK4zEioi1FesNU'
// }

let selectedProtocol = {}

const TxOptions = props => {
	const {
		optionsIndex,
		protocols,
		prefixSelectValue,
		prefixTextValue,
		setPrefixSelect,
		setPrefixText,
		deleteHandler,
	} = props

	const classes = useStyles();

	// Set prefix text input to protocol prefix string
	const handleSelectChange = e => {
		const protocol = e.target.value
		setPrefixSelect(protocol, optionsIndex)

		// if (protocols.has(protocol)) {
		// 	setPrefixText(protocols.get(protocol), optionsIndex)
		// }
		// else {
		// 	setPrefixText('', optionsIndex)
		// }
	}

	// Reset prefix select input if text no longer matches protocol input
	const handleTextChange = e => {
		const prefix = e.target.value
		setPrefixText(prefix, optionsIndex)

		// // Keep protocol select option and prefix text values synced
		// if (protocols.has(prefixSelectValue)) {
		// 	if (protocols.get(prefixSelectValue) !== prefix) {
		// 		setPrefixSelect('Custom', optionsIndex)
		// 	}
		// }
		// if (prefixes.has(prefix)) {
		// 	setPrefixSelect(prefixes.get(prefix), optionsIndex)
		// }
	}

	return (
		<>
		<div className={classes.inputContainer}>
			<label htmlFor="prefix" id="prefix-label">Prefix:</label>
			<select name="protocol" id="protocol" value={prefixSelectValue} onChange={handleSelectChange}>
				<option value="Custom">Custom</option>
				{ Array.from(protocols.keys(), protocol => (
						<option value={protocol} key={protocol}>{protocol}</option>
					)) }
			</select>
			<input name="prefix" id="prefix" type="text" value={prefixTextValue} onChange={handleTextChange}/>
			<IconButton aria-label="delete" onClick={() => deleteHandler(optionsIndex)}>
        <DeleteIcon />
      </IconButton>
		</div>
		{/* <Button variant="contained" color="secondary">Add Prefix</Button> */}
		</>
	)
}

export default TxOptions