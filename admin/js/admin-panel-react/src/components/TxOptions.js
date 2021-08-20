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

	const handleSelectChange = e => {
		const protocol = e.target.value
		setPrefixSelect(protocol, optionsIndex)
	}

	const handleTextChange = e => {
		const prefix = e.target.value
		setPrefixText(prefix, optionsIndex)
	}

	return (
		<div className={classes.inputContainer}>
			<label htmlFor="prefix" id="prefix-label">Prefix:</label>
			<select name="protocol" id="protocol" value={prefixSelectValue} onChange={handleSelectChange}>
				{ Array.from(protocols.keys(), protocol => (
						<option value={protocol} key={protocol}>{protocol}</option>
					)) }
				<option value="Custom">Custom</option>
			</select>
			<input name="prefix" id="prefix" type="text" value={prefixTextValue} onChange={handleTextChange}/>
			<IconButton aria-label="delete" onClick={() => deleteHandler(optionsIndex)}>
        <DeleteIcon />
      </IconButton>
		</div>
	)
}

export default TxOptions