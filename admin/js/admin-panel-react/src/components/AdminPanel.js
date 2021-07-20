import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import MoneyButton from '@moneybutton/react-money-button'
import {  makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import withSelections from 'react-item-select'
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { forEach } from 'lodash';

import TxOptions from './TxOptions';

const wpURL = 'http://localhost:8888/wordpress/wp-json'
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
	button: {
    '& > *': {
      // margin: theme.spacing(1),
    },
  },
	row: {
    '& > *': {
      borderBottom: 'unset',
      borderTop: 'unset',
    },
  },
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
	// textField: {
		// '& label': {
		// 	top: '-3px'
		// },
		// '& label:focus': {
		// 	top: 0
		// }
    // '& > *': {
		// 	backgroundColor: '#ffff'
		// '& input': {
		// 	border: 'none',
		// 	minHeight: '0px',
		// },
		// '& input:focus': {
		// 	boxShadow: 'none'
		// }
	// }
});

const PrefixContainer = styled.div`
	padding: 1rem 0;
`

const Row = ( props ) => {
	const { 
		row, 
		isItemSelected, 
		handleClick,
		handleExpand,
		isExpanded,
		transactions,
	} = props

	// const [open, setOpen] = useState(false)
	const classes = useStyles();

	return (
		<React.Fragment>
			<TableRow className={classes.row}>
				<TableCell padding="checkbox">
					<Checkbox
						checked={isItemSelected(row.id)} onClick={() => handleClick(row.id)}
					/>
				</TableCell>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => handleExpand(row.id)}>
						{isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell>Mirrored</TableCell>
				<TableCell component="th" scope="row">
					<Link href={row.link} target="_blank">{row.title.rendered}</Link>
				</TableCell>
				<TableCell align="right">{row.author}</TableCell>
				<TableCell align="right">{row.date}</TableCell>
				<TableCell align="right">{row.type}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
					<Collapse in={isExpanded} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography variant="h6" gutterBottom component="div">
								Transaction History
							</Typography>
							<Table size="small" aria-label="transactions">
								<TableHead>
									<TableRow>
										<TableCell>Date</TableCell>
										<TableCell>Prefix</TableCell>
										<TableCell>Txid</TableCell>
										<TableCell>Preview</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{transactions && transactions.map( tx => (
										<TableRow key={tx.time}>
											<TableCell component="th" scope="row">
												{tx.time}
											</TableCell>
											<TableCell>{tx.prefix}</TableCell>
											<TableCell>{tx.tx_id}</TableCell>
											<TableCell>link</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}



const AdminPanel = (props) => {
	const {
    areAllIndeterminate,
    areAllSelected,
    areAnySelected,
    selectedCount,
    handleClearAll,
    handleSelect,
    handleSelectAll,
    isItemSelected,
		selections,
  } = props;

	const [posts, setPosts] = useState([])
	const [transactions, setTransactions] = useState({})
	const [expanded, setExpanded] = useState([])
	const [prefixSelectValues, setPrefixSelectValues] = useState(['Custom'])
	const [prefixTextValues, setPrefixTextValues] = useState([''])

	useEffect(() => {
		axios.get(wpURL + '/wp/v2/posts')
			.then((res) => {
				// console.log(res)
				setPosts(res.data)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [])

	const classes = useStyles();

	const handleSendClick = () => {
		// console.log(selections)
		// Create post data object
		let postData = {
			postIds: Array.from(Object.entries(selections), ([key, value]) => {
				if (value === true) {
					return key
				}
			}),
			// postIds: Object.keys(selections),
			prefixes: prefixTextValues,
			filetype: "text/markdown",
			encoding: "utf-8"
		}

		// console.log(postData)
		// console.log(JSON.stringify(postData))
		axios.post(
			wpbsv_ajax_obj.urls.transaction, 
			postData,
			{ headers: { 'X-WP-Nonce': wpbsv_ajax_obj.nonce} }
		)
			.then( res => { 
				// console.log(res)
				setTransactions(res.data)
			 })
			.catch( err => {
				console.log(err)
			})
	}

	// Row expand handlers
	const handleClick = (row) => {
		handleSelect(row)
	}

	const handleExpand = (row) => {
		if (expanded.includes(row)) {
			setExpanded(expanded.filter((value) => ( value !== row)))
		}
		else {
			setExpanded([...expanded, row])
		}
	}

	const isExpanded = (row) => {
		return expanded.includes(row)
	}
	
	const areAllExpanded = () => {
		return posts.length === expanded.length
	}

	const toggleExpandAll = () => {
		if (posts.length === expanded.length) {
			setExpanded([])
		}
		else {
			setExpanded(posts.map( post => post.id ))
		}
	}

	const prefixSelectHandler = (newValue, i) => {
		let values = prefixSelectValues.slice()
		values[i] = newValue
		setPrefixSelectValues(values)
	}

	const prefixTextHandler = (newValue, i) => {
		let values = prefixTextValues.slice()
		values[i] = newValue
		setPrefixTextValues(values)
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


	// console.log(prefixSelectValue)
	// console.log(prefixTextValue)
	console.log(transactions)
	return (
		<div>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox">
								<Checkbox
									checked={areAllSelected(posts)}
									onClick={() => handleSelectAll(posts)}
									indeterminate={areAllIndeterminate(posts)}
								/>
							</TableCell>
							<TableCell>
								<IconButton aria-label="expand row" size="small" onClick={() => toggleExpandAll()} >
									{areAllExpanded() ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> }
								</IconButton>
							</TableCell>
							<TableCell>Mirrored</TableCell>
							<TableCell>Post</TableCell>
							<TableCell align="right">Author</TableCell>
							<TableCell align="right">Date</TableCell>
							<TableCell align="right">Type</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{posts.map((post) => { 
							return (
								<Row 
									key={post.id} 
									row={post} 
									isItemSelected={isItemSelected} 
									handleClick={handleClick}
									handleExpand={handleExpand}
									isExpanded={isExpanded(post.id)}
									transactions={transactions[post.id]}
								/>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<PrefixContainer>
			{
				prefixSelectValues.map((value, i) => (
					<TxOptions
						key={i}
						optionsIndex={i}
						prefixTextValue={prefixTextValues[i]}
						prefixSelectValue={prefixSelectValues[i]}
						setPrefixSelect={prefixSelectHandler}
						setPrefixText={prefixTextHandler}
						deleteHandler={deletePrefixHandler}
					/>
				))
			}
			</PrefixContainer> 
			<Button variant="contained" color="secondary" onClick={addPrefixHandler}>Add Prefix</Button>
			<Button 
				style={{ marginLeft: ".5rem"}} 
				variant="contained" 
				color="primary" 
				onClick={() => handleSendClick()}
			>Send</Button>
		</div>
	)
}

export default withSelections(AdminPanel)