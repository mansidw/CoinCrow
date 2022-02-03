import React, { useState,useEffect } from 'react';
import Layout from '../../../../components/Layout';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
import { useRouter } from 'next/router';
import { Button, Table, Message,Label, Grid } from 'semantic-ui-react'

const requestShow = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [loadingF, setLoadingF] = useState(false)
    const [loadvar,setLoadvar] = useState(null)
    const [err,setErr] = useState(null)
    const [appr,setAppr] = useState(true)
    const [fin,setFin] = useState(false)
    const {address} = router.query;

    useEffect(async()=>{
        const accounts=  await web3.eth.getAccounts();
        if(accounts[0]===props.manager){
            setAppr(false)
            setFin(true)
        }
    })

    const handleApprove =async (key)=>{
        let a=0;
        setErr(null)
        setLoadvar(key)
        setLoading(true)
        try{
            const campaign = await Campaign(address)
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(key).send({
                from:accounts[0]
            });
            a=1
        }catch(err){
            setErr(err.message)
        }
        if(a){
            location.reload();
        }
        setLoading(false)
    }


    const handleFinalize = async(key)=>{
        let a=0;
        setErr(null)
        setLoadvar(key)
        setLoadingF(true)
        try{
            const campaign = await Campaign(address)
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(key).send({
                from:accounts[0]
            });
            a=1
        }catch(err){
            setErr(err.message)
        }
        if(a){
            location.reload();
        }
        setLoadingF(false)
    }

    const renderRequests = ()=>{
        return(
            props.req.map((item,key)=>{
                return(
                    <Table.Row>
                        {item[3]==false?<Table.Cell>{key+1}</Table.Cell>:
                        <Table.Cell>
                            <Label as='a' color='blue' tag>
                                Complete
                            </Label>
                        </Table.Cell>}
                        <Table.Cell>{item[0]}</Table.Cell>
                        <Table.Cell>{item[1]}</Table.Cell>
                        <Table.Cell>{item[2]}</Table.Cell>
                        <Table.Cell>{item[4]}/{props.totapp}</Table.Cell>
                        {appr?
                        <Table.Cell>
                            <Button loading={loadvar==key?loading:false} disabled={item[3]} onClick={()=>handleApprove(key)} style={{width:'100px !important'}}>YES</Button>
                        </Table.Cell>:null}
                        {fin?<Table.Cell><Button loading={loadvar==key?loadingF:false} disabled={item[3]} onClick={()=>handleFinalize(key)} style={{width:'100px !important'}}>YES</Button></Table.Cell>:null}
                    </Table.Row>
                );
            })
        );
    }

    return(
        <Layout>
            
            <Grid>
            <Grid.Row columns={2}>
                <Grid.Column>
                <h1 style={{color:'white',marginTop:'20px'}}>
                    Requests for Contract
                </h1>
                <p style={{color:"white"}}>{address}</p>
                </Grid.Column>
                <Grid.Column style={{marginTop:'20px', paddingLeft:'300px'}}>
                    {fin?<Button type='button' onClick={()=>router.push({
                        pathname:'/campaigns/[address]/requests/new',
                        query:{address:address}
                    })}>Create Request</Button>:null}
                </Grid.Column>
            </Grid.Row>
            </Grid>

            {err?
                <Message
                negative
                icon='exclamation'
                header='Error Occurred :('
                content={err}
                style={{overflowWrap:'break-word'}}
            />:null}

            <Table celled style={{marginTop:'30px'}} textAlign='center'>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Amount (Wei)</Table.HeaderCell>
                    <Table.HeaderCell>Recipient</Table.HeaderCell>
                    <Table.HeaderCell>Approval Count</Table.HeaderCell>
                    {appr?<Table.HeaderCell>Approve</Table.HeaderCell>:null}
                    {fin?<Table.HeaderCell>Finalize</Table.HeaderCell>:null}
                </Table.Row>
                </Table.Header>

                <Table.Body>
                    {renderRequests()}
                </Table.Body>
            </Table>
        </Layout>
    );
};

export async function getServerSideProps(context) {
    const campaign = await Campaign(context.query.address)
    const len = await campaign.methods.getRequestsCount().call();
    const totapp = await campaign.methods.totApprovers().call();
    const manager = await campaign.methods.manager().call();
    const requests =[]
    for(let o =0;o<len;o++){
        requests.push(await campaign.methods.requests(o).call())
    }
    // console.log(JSON.parse(JSON.stringify(requests)));
    return {
        props:{
            req:JSON.parse(JSON.stringify(requests)),
            totapp:totapp,
            manager:manager
        }
    }
  }

export default requestShow;
