import React, { useState } from 'react';
import Layout from '../../../../components/Layout';
import { useRouter } from 'next/router';
import {Message, Button,Form,Input, Grid} from 'semantic-ui-react'
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';

const createRequest = () => {

    const router = useRouter();
    const [err,setErr] = useState(null);
    const [desc,setDesc] = useState(null);
    const [amt,setAmt] = useState(null);
    const [rec,setRec] = useState(null);
    const [loading,setLoading] = useState(false);

    const { address } = router.query

    const handleSubmit= async (e)=>{
        e.preventDefault();
        let a=0;
        setErr(null)
        setLoading(true)
        try{
            const campaign = await Campaign(address)
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.createRequest(desc,amt,rec).send({
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


  return(
      <Layout>
          <h1 style={{color:'white'}}>Create a Request</h1>

            {err?
                <Message
                negative
                icon='exclamation'
                header='Error Occurred :('
                content={err}
                style={{overflowWrap:'break-word'}}
            />:null}

            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column>
                    <div className='newdiv3'>
            
                        <Form style={{paddingTop:'40px'}} onSubmit={handleSubmit}> 
                            <Form.Field>
                                <label style={{color:'#11155d',fontSize:'20px', paddingBottom:'10px'}}>Description</label>
                                <Input onChange={(e)=>setDesc(e.target.value)}/>
                            </Form.Field>

                            <Form.Field>
                                <label style={{color:'#11155d',fontSize:'20px', paddingBottom:'10px'}}>Amount</label>
                                <Input label='Wei'labelPosition='right' onChange={(e)=>setAmt(e.target.value)}/>
                            </Form.Field>

                            <Form.Field>
                                <label style={{color:'#11155d',fontSize:'20px', paddingBottom:'10px'}}>Recipient (Address)</label>
                                <Input onChange={(e)=>setRec(e.target.value)}/>
                            </Form.Field>
                            <Button loading={loading} type='submit' style={{width:'100px'}}>Submit</Button>
                        </Form>
                        </div>
                    </Grid.Column>

                    <Grid.Column>
                        <Button type='button' style={{width:'150px', marginTop:'215px !important'}} onClick={()=>router.push({
                            pathname:'/campaigns/[address]/requests',
                            query:{address:address}
                        })}>View Requests
                        </Button>
                    </Grid.Column>

                </Grid.Row>

            
            

            </Grid>
      </Layout>
  );
};

export default createRequest;
