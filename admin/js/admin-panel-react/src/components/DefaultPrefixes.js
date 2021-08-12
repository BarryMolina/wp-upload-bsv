import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
		addManyPrefix,
		deletePrefixHandler
	} = props

	const [prefixString, setPrefixString] = useState('')
	
	useEffect( () => {
		addManyPrefix(wpbsv_ajax_obj.prefixes)
	}, [])
	// const createPrefixString

	const handleSaveClick = () => {
		let config = new FormData
		config.append('_ajax_nonce', wpbsv_ajax_obj.nonce)
		config.append('action', 'wpbsv_default_prefixes')
		config.append('prefixes', JSON.stringify(prefixTextValues))

		axios.post(ajaxurl, config)
			.then( res => {
				// console.log(res)
			})
			.catch( err => {
				console.log(err)
			})
		document.getElementById('wpbsv-settings-form').submit()
	}

	const classes = useStyles()

	// console.log(prefixTextValues)
	// console.log(ajaxurl)
	// console.log(wpbsv_ajax_obj)
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