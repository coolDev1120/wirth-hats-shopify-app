import {
  Card, Layout, Tabs, IndexTable, useIndexResourceState, Button, Spinner
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'

const apiUrl = 'https://wirth-hats.onrender.com/api';

export default function HomePage() {
  const [selected, setSelected] = useState(0);
  const [All, setAll] = useState([])
  const [Accept, setAccept] = useState([])
  const [Deny, setDeny] = useState([])
  const [update, setUpdate] = useState(false)
  const [loading, setloading] = useState(true)

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
        setloading(false)
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
          <IndexTable.Cell><Link to={`detail?id=${id}`} style={{ textDecoration: 'none' }}><div className="uppercase">{firstName} {lastName}</div></Link></IndexTable.Cell>
          <IndexTable.Cell><div className="uppercase">{address}</div></IndexTable.Cell>
          <IndexTable.Cell>{birthday}</IndexTable.Cell>
          <IndexTable.Cell>{email}</IndexTable.Cell>
          <IndexTable.Cell><div className="uppercase">{gender}</div></IndexTable.Cell>
          <IndexTable.Cell>{telephone}</IndexTable.Cell>
          <IndexTable.Cell>
            <div style={{ display: 'flex' }}>
              {status === 'accepted' &&
                <div className="mr-5">
                  <Button
                    disabled
                    primary
                    dataPrimaryLink
                  >
                    Accept
                  </Button>
                </div>
              }

              {status !== 'accepted' &&
                <div className="mr-5">
                  <Button
                    className="mr-5"
                    primary
                    dataPrimaryLink
                    onClick={() => counsellingAccept(id)}
                  >
                    Accept
                  </Button>
                </div>
              }

              {status === 'denied' &&
                <Button
                  disabled
                  dataPrimaryLink
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
            </div>
          </IndexTable.Cell>
        </IndexTable.Row>
      ),
    );

    const counsellingAccept = async (id) => {
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

          await fetch(`${apiUrl}/updateInfo/${id}`, requestOptions)
          setUpdate(!update)
        }
      }
    }

    const counsellingDeny = async (id) => {
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
          await fetch(`${apiUrl}/updateInfo/${id}`, requestOptions)
          setUpdate(!update)
        }
      }
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
            { title: 'Name' },
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
    <div className="p-20">
      <TitleBar title="Wirth-hats" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              <Card.Section>
                {loading && <div style={{ textAlign: 'center' }}><Spinner accessibilityLabel="Spinner example" size="large" /></div>}
                {!loading && <TabPane />}
              </Card.Section>
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </div>
  );
}
