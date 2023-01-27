import {
  Card,
  Page,
  Layout,
  Tabs,
  IndexTable,
  useIndexResourceState,
  Button
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from 'react';
import React from 'react';

const apiUrl = 'https://wirth-hats.onrender.com/api';

export default function HomePage() {
  const [selected, setSelected] = useState(0);
  const [All, setAll] = useState([])
  const [Accept, setAccept] = useState([])
  const [Deny, setDeny] = useState([])
  const [update, setUpdate] = useState(false)

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: '1',
      content: 'All',
      accessibilityLabel: 'All customers',
      panelID: 'All customers',
    },
    {
      id: '2',
      content: 'Accepted',
      panelID: 'Accepted',
    },
    {
      id: '3',
      content: 'Denied',
      panelID: 'Denied',
    },
  ];

  const TabPane = () => {
    if (selected === 0) {
      return (
        AllTable(All)
      )
    }
    if (selected === 1) {
      return (
        AllTable(Accept)
      )
    }
    if (selected === 2) {
      return (
        AllTable(Deny)
      )
    }
  }

  useEffect(() => {
    fetch(`${apiUrl}/getAllInfo`)
      .then(res => res.json())
      .then((result) => {
        var data1 = result.listing;
        var Allcustomer = [];
        var Acceptcustomer = [];
        var Denystomer = [];

        for (let i = 0; i < data1.length; i++) {
          var temp = {}
          temp.id = data1[i].id
          temp.firstName = data1[i].firstName['firstName']
          temp.lastName = data1[i].firstName['lastName']
          temp.email = data1[i].firstName['email']
          temp.birthday = data1[i].firstName['birthday']
          temp.gender = data1[i].firstName['gender']
          temp.address = data1[i].firstName['address']
          temp.status = data1[i].firstName['status']
          temp.telephone = data1[i].firstName['telephone']
          Allcustomer.push(temp)
          if (temp.status === 'accepted') {
            Acceptcustomer.push(temp)
          }
          if (temp.status === 'denied') {
            Denystomer.push(temp)
          }
        }
        setAll(Allcustomer)
        setAccept(Acceptcustomer)
        setDeny(Denystomer)
      })
  }, [update]);


  function AllTable(customers) {
    const resourceName = {
      singular: 'customer',
      plural: 'customers',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
      useIndexResourceState(customers);

    const rowMarkup = customers.map(
      ({ id, firstName, lastName, address, birthday, email, gender, telephone, status }, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>{firstName}</IndexTable.Cell>
          <IndexTable.Cell>{lastName}</IndexTable.Cell>
          <IndexTable.Cell>{address}</IndexTable.Cell>
          <IndexTable.Cell>{birthday}</IndexTable.Cell>
          <IndexTable.Cell>{email}</IndexTable.Cell>
          <IndexTable.Cell>{gender}</IndexTable.Cell>
          <IndexTable.Cell>{telephone}</IndexTable.Cell>
          <IndexTable.Cell>
            {status === 'accepted' &&
              <Button
                disabled
                dataPrimaryLink
                onClick={() => counsellingAccept(id)}
              >
                Accept
              </Button>
            }

            {status !== 'accepted' &&
              <Button
                dataPrimaryLink
                onClick={() => counsellingAccept(id)}
              >
                Accept
              </Button>
            }

            {status === 'denied' &&
              <Button
                disabled
                dataPrimaryLink
                onClick={() => counsellingDeny(id)}
              >
                Deny
              </Button>
            }


            {status !== 'denied' &&
              <Button
                dataPrimaryLink
                onClick={() => counsellingDeny(id)}
              >
                Deny
              </Button>
            }
          </IndexTable.Cell>
        </IndexTable.Row>
      ),
    );

    const counsellingAccept = (id) => {
      for (let i = 0; i < customers.length; i++) {
        if (customers[i].id === id) {
          var sendValue = customers[i];
          sendValue.status = 'accepted';
          console.log(sendValue)

          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sendValue)
          };

          fetch(`${apiUrl}/updateInfo/${id}`, requestOptions)
        }
      }
      setUpdate(!update)
    }

    const counsellingDeny = (id) => {
      for (let i = 0; i < customers.length; i++) {
        if (customers[i].id === id) {
          var sendValue = customers[i];
          console.log(customers[i])
          sendValue.status = 'denied';
          console.log(sendValue)

          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sendValue)
          };
          // console.log(sendValue)
          fetch(`${apiUrl}/updateInfo/${id}`, requestOptions)
        }
      }
      setUpdate(!update)
    }

    return (
      <Card>
        <IndexTable
          resourceName={resourceName}
          itemCount={customers.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: 'FirstName' },
            { title: 'LastName' },
            { title: 'Address' },
            { title: 'Birthday' },
            { title: 'Email' },
            { title: 'Gender' },
            { title: 'Telephone' },
            {},
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    );
  }

  return (
    <Page narrowWidth>
      <TitleBar title="Wirth-hats" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              <Card.Section>
                <TabPane />
              </Card.Section>
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
