<script>
	import axios from 'axios'
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table'
	import Checkbox from '@smui/checkbox'
	import IconButton, { Icon } from '@smui/icon-button'
	import Button, { Label } from '@smui/button'


	const wpURL = 'http://localhost:8888/wordpress/wp-json'
	let posts = []
	let expanded = {}
	let selected = []
	$: areAllExpanded = (posts.every( post => (expanded[post.id] === true)))

	const btnSendHandler = () => {
		console.log(expanded)
	}

	const toggleExpandAll = () => {
		if (areAllExpanded) {
			posts.forEach(post => expanded[post.id] = false)
		}
		else {
			posts.forEach(post => { expanded[post.id] = true })
		}
	}

	axios.get(wpURL + '/wp/v2/posts')
		.then((res) => {
			posts = res.data
			console.log(posts)
			posts.forEach(post => expanded[post.id] = false)
		})
		.catch((err) => {
			console.log(err)
		})

</script>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/svelte-material-ui@4.0.0/bare.min.css" />
<!-- <main> -->
	<DataTable style="width: 100%;">
		<Head>
			<Row>
				<Cell checkbox>
					<Checkbox />
				</Cell>
				<Cell style="width: 100px;">
						<IconButton on:click={toggleExpandAll} toggle bind:pressed={areAllExpanded}>
							<Icon class="material-icons" on>expand_less</Icon>
							<Icon class="material-icons">expand_more</Icon>
						</IconButton>
				</Cell>
				<Cell>Title</Cell>
				<Cell>Author</Cell>
				<Cell>Date</Cell>
				<Cell>Mirrored</Cell>
			</Row>
		</Head>
		<Body>
			{#each posts as post}
				<Row>
					<Cell checkbox>
						<Checkbox
							bind:group={selected}
							value={post}
							valueKey={post.id}
						/>
					</Cell>
					<Cell>
						<IconButton toggle bind:pressed={expanded[post.id]}>
							<Icon class="material-icons" on>expand_less</Icon>
							<Icon class="material-icons">expand_more</Icon>
						</IconButton>
					</Cell>
					<Cell>{post.title.rendered}</Cell>
					<Cell>{post.author}</Cell>
					<Cell>{post.date}</Cell>
					<Cell>Mirrored</Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>
	<Button on:click={btnSendHandler} variant="raised">
		<Label>send</Label>
	</Button>
	<!-- <span class="material-icons">expand_more</span>
	<span class="material-icons">expand_less</span>
	<table>
		<thead>
			<tr>
				<th scope="col" class="short"><input type="checkbox" on:click={checkAllHandler} bind:checked={areAllChecked}></th>
				<th scope="col" class="short"><a href="#">v</a></th>
				<th scope="col">Title</th>
				<th scope="col">Author</th>
				<th scope="col">Date</th>
				<th scope="col">Mirrored</th>
			</tr>
		</thead>
		<tbody>
			{#each posts as post}
				<tr>
					<td class="short"><input type="checkbox"  bind:checked={checked[post.id]}></td>
					<td class="short"><a href="#">v</a></td>
					<td>{post.title.rendered}</td>
					<td>{post.author}</td>
					<td>{post.date}</td>
					<td>Mirrored</td>
				</tr>
			{/each}
		</tbody>
	</table>
</main> -->

<style>
	main {
		/* text-align: center; */
		padding-right: 1em;
		max-width: 240px;
		margin-bottom: 2rem;
	}


	table {
		width: 100%;
		/* border: 1px solid black; */
		border-radius: 4px;
		box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.4);
		background-color: #ffff;
		border-collapse: collapse;
	}

	tr:nth-child(even) {
		/* background-color: #f2f2f2; */
	}

	thead {
		/* background-color: #ffff; */
	}

	th, td {
		text-align: left;
		padding: 1rem;
	}

	.short {
		text-align: center;
		width: 20px;
	}


	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>