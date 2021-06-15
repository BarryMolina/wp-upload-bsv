import React, { useState } from 'react'
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
// import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import withSelections from 'react-item-select'

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

function createData(id, name, calories, fat, carbs, protein) {
  return { 
		id, 
		name, 
		calories, 
		fat, 
		carbs, 
		protein,
		history: [
      { date: '2020-01-05', customerId: '11091700', amount: 3 },
      { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
    ],
	};
}

const rows = [
  createData(1, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData(2,'Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData(3,'Eclair', 262, 16.0, 24, 6.0),
  createData(4,'Cupcake', 305, 3.7, 67, 4.3),
  createData(5,'Gingerbread', 356, 16.0, 49, 3.9),
];

const Row = ({ row, isItemSelected, handle }) => {
	const [open, setOpen] = useState(false)
	const classes = useStyles();
	return (
		<React.Fragment>
			<TableRow className={classes.row}>
				<TableCell padding="checkbox">
					<Checkbox
						checked={isItemSelected(row.id)} onClick={() => handle(row)}
					/>
				</TableCell>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? '>' : 'v'}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{row.name}
				</TableCell>
				<TableCell align="right">{row.calories}</TableCell>
				<TableCell align="right">{row.fat}</TableCell>
				<TableCell align="right">{row.carbs}</TableCell>
				<TableCell align="right">{row.protein}</TableCell>
			</TableRow>
			<TableRow>
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

	const classes = useStyles();

	const handleUploadClick = () => {
		console.log(selections)
	}
	const handle = (row) => {
		handleSelect(row.id)
		// console.log("clicked " + row.id)
		// console.log(selections)
	}
	return (
		<div>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell padding="checkbox">
								<Checkbox
									checked={areAllSelected(rows)}
									onClick={() => handleSelectAll(rows)}
									indeterminate={areAllIndeterminate(rows)}
								/>
							</TableCell>
							<TableCell>
								<IconButton aria-label="expand row" size="small" >
									{'v'}
								</IconButton>
							</TableCell>
							<TableCell>Dessert (100g serving)</TableCell>
							<TableCell align="right">Calories</TableCell>
							<TableCell align="right">Fat&nbsp;(g)</TableCell>
							<TableCell align="right">Carbs&nbsp;(g)</TableCell>
							<TableCell align="right">Protein&nbsp;(g)</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => { 
							return (
								<Row key={row.id} row={row} isItemSelected={isItemSelected} handle={handle}/>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<Button 
				variant="contained" 
				color="primary" 
				onClick={() => handleUploadClick()}
			>Send</Button>
		</div>
	)
}

export default withSelections(AdminPanel)