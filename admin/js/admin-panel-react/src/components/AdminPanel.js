import React from 'react'
import styled from 'styled-components'
import MoneyButton from '@moneybutton/react-money-button'

const Wrap = styled.div`
`
const H3 = styled.h3`
	color: orange;
`

const AdminPanel = () => {
	return (
		<Wrap>
			<H3>Hello World!!</H3>
			<MoneyButton 
				outputs={[
					{
						script: 'OP_FALSE OP_RETURN',
						amount: '0',
						currency: 'BSV',
					}
				]}
			/>
		</Wrap>
	)
}

export default AdminPanel