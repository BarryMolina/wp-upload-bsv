import React, { useState } from 'react'
import { makeStyles, styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import TxOptions from './TxOptions'
import withPrefixes from './withPrefixes'

const useStyles = makeStyles({
	buttons: {
		display: 'flex',
		alignItems: 'center',
		'& > :not(:first-child)': {
			marginLeft: '.5rem',
		},
		'& button': {
			textTransform: 'none'
		}
	},
})

const Prefixes = styled('div')({
	padding: '1rem 0',
})

const WpButton = styled(Button)({
	textTransform: 'none',
	fontSize: 'inherit',
	fontFamily: 'inherit',
	textTransform: 'none'
})

const DefaultPrefixes = ( props ) => {
	const {
			protocols,
			prefixTextValues,
			prefixSelectValues,
			prefixSelectHandler,
			prefixTextHandler,
			addPrefixHandler,
			deletePrefixHandler
	} = props

	const [prefixString, setPrefixString] = useState('')
	
	// const createPrefixString

	const handleSaveClick = () => {
		document.getElementById('wpbsv-settings-form').submit()
	}

	const classes = useStyles();

	return (
		<>
			<Prefixes>
			{
				prefixSelectValues.map((selectValue, i) => (
					<TxOptions
						key={i}
						optionsIndex={i}
						protocols={protocols}
						prefixTextValue={prefixTextValues[i]}
						prefixSelectValue={selectValue}
						setPrefixSelect={prefixSelectHandler}
						setPrefixText={prefixTextHandler}
						deleteHandler={deletePrefixHandler}
					/>
				))
			}
			</Prefixes> 
			<div className={classes.buttons}>
				<Button
					variant="contained"
					color="secondary"
					onClick={addPrefixHandler}
					>Add Prefix</Button>
				<Button 
					variant="contained" 
					color="primary" 
					onClick={() => handleSaveClick()}
				>Save Settings</Button>
			</div>
		</>
	)
}

export default withPrefixes(DefaultPrefixes)