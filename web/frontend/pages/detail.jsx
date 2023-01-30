import {
  Card,
  Page,
  Layout,
  TextContainer,
  Heading,
  Stack,
  ButtonGroup,
  Button,
} from '@shopify/polaris'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TitleBar } from '@shopify/app-bridge-react'
const apiUrl = 'https://wirth-hats.onrender.com/api'

export default function PageName() {
  const [data, setData] = useState({})
  const [update, setUpdate] = useState(false)
  const searchParams = new URLSearchParams(document.location.search)
  const id = searchParams.get('id')

  useEffect(() => {
    fetch(`${apiUrl}/getInfo/${id}`)
      .then(res => res.json())
      .then(result => {
        setData(result)
      })
  }, [update])

  const counsellingAccept = async () => {
    var sendValue = data
    sendValue.status = 'accepted'

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sendValue)
    }

    await fetch(`${apiUrl}/updateInfo/${data.id}`, requestOptions)
    setUpdate(!update)
  }

  const counsellingDeny = async () => {
    var sendValue = data
    sendValue.status = 'denied'

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sendValue)
    }
    await fetch(`${apiUrl}/updateInfo/${data.id}`, requestOptions)
    setUpdate(!update)
  }

  return (
    <Page>
      <TitleBar title='Profile' />
      <Layout>
        <Layout.Section>
          <div className='mainLink'>
            <ButtonGroup>
              <Link to='/' style={{ textDecoration: 'none' }}>
                <Button>Go to Dashboard</Button>
              </Link>
            </ButtonGroup>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Card sectioned>
            <Heading><div className='mb-12'>Detail</div></Heading>
            <Stack>
              <h1 className='bold'>Gender</h1>
              <h1><div className="uppercase">{data.gender}</div></h1>
            </Stack>
            <Stack>
              <h1 className='bold'>Birthday</h1>
              <h1>{data.birthday}</h1>
            </Stack>
          </Card>
        </Layout.Section>

        <Layout.Section secondary>
          <Card sectioned>
            <Heading><div className='mb-12'>Status</div></Heading>
            <TextContainer>
              <div className='status'>
                {data.status === 'accepted' && (
                  <ButtonGroup>
                    <Button disabled primary>
                      Accept
                    </Button>
                    <Button onClick={counsellingDeny}>Deny</Button>
                  </ButtonGroup>
                )}

                {data.status === 'denied' && (
                  <ButtonGroup>
                    <Button onClick={counsellingAccept} primary>
                      Accept
                    </Button>
                    <Button disabled>Deny</Button>
                  </ButtonGroup>
                )}

                {data.status === 'suspended' && (
                  <ButtonGroup>
                    <Button onClick={counsellingAccept} primary>
                      Accept
                    </Button>
                    <Button onClick={counsellingDeny}>Deny</Button>
                  </ButtonGroup>
                )}
              </div>
            </TextContainer>
          </Card>
          <Card sectioned>
            <Heading><div className='mb-12'>Contact Details</div></Heading>
            <Stack>
              <h1 className='bold'>Name</h1>
              <h1>
                <div className="uppercase">{data.firstName} {data.lastName}</div>
              </h1>
            </Stack>
            <Stack>
              <h1 className='bold'> Email </h1>
              <h1>
                {data.email}
              </h1>
            </Stack>
            <Stack>
              <h1 className='bold'>Phone</h1>
              <h1>{data.telephone}</h1>
            </Stack>
            <Stack>
              <h1 className='bold'>Address</h1>
              <h1><div className="uppercase">{data.address}</div></h1>
            </Stack>

          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
