import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import MoneyButton from '@moneybutton/react-money-button'
import { makeStyles } from '@material-ui/core/styles';
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
});

const Row = ( props ) => {
	const { 
		row, 
		isItemSelected, 
		handleClick,
		handleExpand,
		isExpanded
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
						{isExpanded(row.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
			{/* <TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography variant="h6" gutterBottom component="div">
								Transaction History
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>Date</TableCell>
										<TableCell>Customer</TableCell>
										<TableCell align="right">Amount</TableCell>
										<TableCell align="right">Total price ($)</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.history.map((historyRow) => (
										<TableRow key={historyRow.date}>
											<TableCell component="th" scope="row">
												{historyRow.date}
											</TableCell>
											<TableCell>{historyRow.customerId}</TableCell>
											<TableCell align="right">{historyRow.amount}</TableCell>
											<TableCell align="right">
												{Math.round(historyRow.amount * row.price * 100) / 100}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow> */}
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
	const [expanded, setExpanded] = useState([])

	// useEffect(() => {
	// 	axios.get(wpURL + '/wp/v2/posts')
	// 		.then((res) => {
	// 			// console.log(res)
	// 			setPosts(res.data)
	// 		})
	// 		.catch((err) => {
	// 			console.log(err)
	// 		})
	// }, [])

	const classes = useStyles();

	// const handleUploadClick = () => {
	// 	// console.log(selections)
	// 	// console.log(ajaxurl)

	// 	// console.log(selections)
	// 	// Create post data object
	// 	let postData = {
	// 		postIds: [],
	// 		prefix: "gendale.net",
	// 		filetype: "text/markdown",
	// 		encoding: "utf-8"
	// 	}

	// 	// Add post ids to post data
	// 	for (const [key, value] of Object.entries(selections)) {
	// 		if (value === true) {
	// 			postData.postIds.push(key)
	// 		}
	// 	}

	// 	console.log(JSON.stringify(postData))
	// 	axios.post(
	// 		wpbsv_ajax_obj.urls.transaction, 
	// 		postData,
	// 		{ headers: { 'X-WP-Nonce': wpbsv_ajax_obj.nonce} }
	// 	)
	// 		.then( res => {
	// 			console.log(res)
	// 		})
	// 		.catch( err => {
	// 			console.log(err)
	// 		})
	// }
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

	const top100Films = [
		{ title: 'The Shawshank Redemption', year: 1994 },
		{ title: 'The Godfather', year: 1972 },
		{ title: 'The Godfather: Part II', year: 1974 },
		{ title: 'The Dark Knight', year: 2008 },
		{ title: '12 Angry Men', year: 1957 },
		{ title: "Schindler's List", year: 1993 },
		{ title: 'Pulp Fiction', year: 1994 },
	]

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
									isExpanded={isExpanded}
								/>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
			{/* <div style={{ width: 300 }}>
				<Autocomplete
					id="free-solo-demo"
					freeSolo
					// options={top100Films.map((option) => option.title)}
					options={['B://', 'gendale.net', 'C://']}
					renderInput={(params) => (
						<TextField {...params} label="freeSolo" margin="normal" variant="outlined" />
					)}
				/>
			</div> */}
			{/* <Autocomplete
      id="combo-box-demo"
      options={top100Films}
      getOptionLabel={(option) => option.title}
      style={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" minHeight="0" />}
    /> */}
		<input type="text" name="example" list="exampleList" style={{ padding: ".3rem" }}/>
		<datalist id="exampleList">
			<option value="A"/>  
			<option value="B"/>
		</datalist>
			<Button 
				variant="contained" 
				color="primary" 
				onClick={() => handleUploadClick()}
			>Send</Button>
		</div>
	)
}

export default withSelections(AdminPanel)