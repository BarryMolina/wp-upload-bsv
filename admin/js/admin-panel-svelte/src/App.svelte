<script>
	import axios from 'axios'
	export let name;

	const wpURL = 'http://localhost:8888/wordpress/wp-json'
	let posts = []
	let checked = {}
	$: areAllChecked = (posts.every( post => (checked[post.id] === true)))

	axios.get(wpURL + '/wp/v2/posts')
		.then((res) => {
			posts = res.data
			console.log(posts)
		})
		.catch((err) => {
			console.log(err)
		})

	const btnSendHandler = () => {
		console.log(checked)
		console.log(areAllChecked)
	}

	const checkAllHandler = () => {
		if (areAllChecked) {
			checked = {}
		}
		else {
			posts.forEach(post => { checked[post.id] = true })
		}
	}
	
</script>

<main>
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
	<button on:click={btnSendHandler}>Send</button>
</main>

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