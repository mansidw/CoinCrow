import React from 'react';
import factory from '../ethereum/factory';
import { Card, Button, Icon } from 'semantic-ui-react'
import Layout from '../components/Layout';
import Link from 'next/link';
import Head from 'next/head'


const index = (props) => {

  const renderCampaigns= ()=>{
    const items=props.campaigns.map((item,key)=>{
      return{
        href:`/campaigns/${item}`,
        header:item,
        meta:`Contract ${key}`,
        fluid:true,
        description:'Dummy description!'
      }

    })
    return <Card.Group items={items}/>
  }


  return (<>

    <Head>
        <title>CoinCrow</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>

    <Layout>
      <h1 style={{color:'white'}}>Open Campaigns</h1>
      <div>
        <Link href='/campaigns/new'>
          <Button icon labelPosition='left'
          floated='right'>
            Create Campaign
            <Icon name='add' fitted/>
          </Button>
        </Link>
        {renderCampaigns()}
      </div>
    </Layout>
    
  </>);
};


export async function getServerSideProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return {
    props: {campaigns}, // will be passed to the page component as props
  }
}

export default index;
 