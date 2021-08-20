import React, { useState, useEffect } from 'react'
import axios from 'axios'
import MoneyButton from '@moneybutton/react-money-button'
import {  makeStyles, styled } from '@material-ui/core/styles';
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
import CircularProgress from '@material-ui/core/CircularProgress'
import moment from 'moment';

import TxOptions from './TxOptions';
import withPrefixes from './withPrefixes'
import { green } from '@material-ui/core/colors';

// const wpURL = 'http://localhost:8888/wordpress/wp-json'
// With trailing slash
console.log('running')
const wpURL = wpbsv_ajax_obj.urls.api
const useStyles = makeStyles({
  table: {
    minWidth: 650,
		'& > tbody tr:last-child > td': {
			// backgroundColor: 'green',
			// padding: '1rem'
			borderBottom: 'none',
		}
  },
	buttons: {
		display: 'flex',
		alignItems: 'center',
		'& > :not(:first-child)': {
			marginLeft: '.5rem',
		},
		'& button': {
			textTransform: 'none'
		}
		// '& > '
	},
	row: {
		// backgroundColor: 'rgba(224, 224, 224, 1)',
    '& > *': {
      borderBottom: 'unset',
      borderTop: 'unset',
    },
  },
	green: {
		color: 'green',
	},
	red: {
		color: 'red',
	},
	orange: {
		color: 'orange',
	},
});

const Prefixes = styled('div')({
	padding: '1rem 0',
})

const Row = ( props ) => {
	const { 
		post, 
		isItemSelected, 
		handleClick,
		handleExpand,
		isExpanded,
		transactions,
	} = props

	// const [open, setOpen] = useState(false)
	const classes = useStyles()

	return (
		<React.Fragment>
			<TableRow className={classes.row}>
				<TableCell padding="checkbox">
					<Checkbox
						checked={isItemSelected(post.id)} onClick={() => handleClick(post.id)}
					/>
				</TableCell>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => handleExpand(post.id)}>
						{isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				{transactions.length > 0 ? 
				// Check that at least one transaction was made after the last modified date
					transactions.some(tx => moment(tx.time).isSameOrAfter(post.modified)) ? 
						<TableCell className={classes.green}>Mirrored</TableCell>
					:
						<TableCell className={classes.orange}>Modified</TableCell>
				:
					<TableCell className={classes.red}>Not Mirrored</TableCell>
				}
				<TableCell component="th" scope="row">
					<Link href={post.link} target="_blank">{post.title.rendered}</Link>
				</TableCell>
				<TableCell>{post.author_name}</TableCell>
				{post.modified > post.date ? 
					<TableCell>Last Modified<br/>{moment(post.modified).format("MM/DD/YYYY [at] h:mm:ss a")}</TableCell>
				:
					<TableCell>Published<br/>{moment(post.date).format("MM/DD/YYYY [at] h:mm:ss a")}</TableCell>
				}
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
					<Collapse in={isExpanded} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography variant="h6" gutterBottom component="div">
								Transaction History
							</Typography>
							{ transactions.length > 0 ? 
									<Table size="small" aria-label="transactions">
										<TableHead>
											<TableRow>
												<TableCell>Date Posted</TableCell>
												<TableCell>Prefix</TableCell>
												<TableCell>Txid</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{transactions.map( tx => (
												<TableRow key={tx.id}>
													<TableCell>{moment(tx.time).format("MM/DD/YYYY [at] h:mm:ss a")}</TableCell>
													<TableCell>{tx.prefix}</TableCell>
													<TableCell><Link href={`https://bico.media/${tx.tx_id}`} target="_blank">{tx.tx_id}</Link></TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
							 : 
							 	<p>There are no transactions linked to this post.</p>
							}
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}



const AdminPanel = (props) => {
	const {
		// Selection props
    areAllIndeterminate,
    areAllSelected,
    areAnySelected,
    selectedCount,
    handleClearAll,
    handleSelect,
    handleSelectAll,
    isItemSelected,
		selections,
		// Prefix props
		protocols,
		prefixTextValues,
		prefixSelectValues,
		prefixSelectHandler,
		prefixTextHandler,
		addPrefixHandler,
		// addManyPrefix,
		deletePrefixHandler
  } = props;

	const [posts, setPosts] = useState([])
	const [transactions, setTransactions] = useState([])
	const [expanded, setExpanded] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect( () => {
		axios.get(wpURL + 'wp/v2/posts')
			.then( res => {
				// console.log(res)
				const postData = res.data
				// Get list of unique author ids
				const authorIds = [...new Set(postData.map( post => post.author))]
				Promise.all(
					authorIds.map( id => axios.get(`${wpURL}wp/v2/users/${id}`))
				)
					.then( responses => {
						return Promise.all(
							responses.map( res => res.data)
						)
					})
					.then( users => {
						let authorNames = {}
						// Add author names to post data
						authorIds.forEach( (id, idx) => authorNames[id] = users[idx].name)
						postData.forEach(post => post.author_name = authorNames[post.author])
						setPosts(postData)
					})
					.catch( err => {
						console.log(err)
					})
			})
			.catch( err => {
				console.log(err)
			})
		axios.get(`${wpURL}wpbsv/v1/transactions`)
			.then( res => {
				setTransactions(res.data)
			})
			.catch( err => {
				console.log(err)
			})
	}, [])

	const classes = useStyles();

	const handleSendClick = () => {
		// console.log(selections)

		setLoading(true);
		// Create post data object
		let postData = {
			postIds: Array.from(Object.entries(selections), ([key, value]) => {
				if (value === true) {
					return key
				}
			}),
			prefixes: prefixTextValues,
			filetype: "text/markdown",
			encoding: "utf-8"
		}

		axios.post(
			`${wpURL}wpbsv/v1/transactions`, 
			postData,
			{ headers: { 'X-WP-Nonce': wpbsv_ajax_obj.nonce} }
		)
			.then( res => { 
				setTransactions([...transactions, ...res.data])
				handleClearAll(posts)
				setLoading(false)
			 })
			.catch( err => {
				setLoading(false)
				console.log(err.response ? err.response : err)
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

	return (
		<div>
			{/* <div class="notice notice-error is-dismissible"><p>Error!</p></div> */}
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
							<TableCell>Status</TableCell>
							<TableCell>Post</TableCell>
							<TableCell>Author</TableCell>
							<TableCell>Date</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{posts.map((post) => { 
							return (
								<Row 
									key={post.id} 
									post={post} 
									isItemSelected={isItemSelected} 
									handleClick={handleClick}
									handleExpand={handleExpand}
									isExpanded={isExpanded(post.id)}
									transactions={transactions.filter( tx => tx.post_id == post.id )}
								/>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<Prefixes>
			{
				prefixSelectValues.map((value, i) => (
					<TxOptions
						key={i}
						optionsIndex={i}
						protocols={protocols}
						prefixTextValue={prefixTextValues[i]}
						prefixSelectValue={prefixSelectValues[i]}
						setPrefixSelect={prefixSelectHandler}
						setPrefixText={prefixTextHandler}
						deleteHandler={deletePrefixHandler}
					/>
				))
			}
			</Prefixes> 
			<div className={classes.buttons}>
				<Button variant="contained" color="secondary" onClick={addPrefixHandler}>Add Prefix</Button>
				<Button 
					variant="contained" 
					color="primary" 
					onClick={() => handleSendClick()}
				>Send</Button>
				{ loading && <CircularProgress style={{width: '32px', height: '32px'}} /> }
			</div>
		</div>
	)
}

export default withPrefixes(withSelections(AdminPanel))