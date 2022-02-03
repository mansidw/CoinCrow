import React,{useState,useEffect} from 'react';
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Grid, Accordion,Form , Button, Input,Statistic, Message } from 'semantic-ui-react'


const details = (props) => {
    const router = useRouter();
    const [contri,setContri] = useState('');
    const [err,setErr] = useState('');
    const [loading,setLoading] = useState(false)
    const [dis,setDis] = useState(false)
    const { address } = router.query

    useEffect(async()=>{
      const accounts = await web3.eth.getAccounts()
      if(props.manager==accounts[0]){setDis(true)}
    })


    const panels = [
        {
            key: 'q1',
            title: {
              content: 'Contract Manager?',
              icon: 'question',
            },
            content: {
              content: (
                <span>
                  The entity with the address {props.manager} is the contract owner.
                </span>
              ),
            },
          },
        {
          key: 'q2',
          title: {
            content: 'Campaign Balance (Wei)',
            icon: 'question',
          },
          content: {
            content: (
              <span>
                The balance is how much money the campaign has left to spend.
              </span>
            ),
          },
        },
        {
          key: 'q3',
          title: {
            content: 'Minimum Contribution (Wei)',
            icon: 'question',
          },
          content: {
            content: (
              <span>
                You must contribute atlest this much wei to become a approver.
              </span>
            ),
          },
        },
        {
            key: 'q4',
            title: {
              content: 'Number of Requests',
              icon: 'question',
            },
            content: {
              content: (
                <span>
                  A request tries to withdraw money from the contract. Requests must be approved from the approvers.
                </span>
              ),
            },
          },
          {
            key: 'q5',
            title: {
              content: 'Number of Approvers',
              icon: 'question',
            },
            content: {
              content: (
                <span>
                  Number of people who have already contributed to this campaign.
                </span>
              ),
            },
          },
      ]


    const handleSubmit = async(e)=>{
        e.preventDefault();

        setErr(null)
        setLoading(true)
        try{
            const campaign = await Campaign(address)
            const accounts = await web3.eth.getAccounts()
            if(props.manager==accounts[0]){setDis(true)}
            await campaign.methods.contribute().send({
                value:contri,
                from:accounts[0]
            });
        }catch(err){
            setErr(err.message)
        }
        location.reload();
        setLoading(false)
    }

    function handleChange(e){
        setContri(e.target.value)
    }

    return(
        <Layout>
            <h1 style={{color:'white',marginTop:'20px'}}>
                Campaign Details
            </h1>
            <p style={{color:"white"}}>{address}</p>
            <Grid columns={4} divided>
                <Grid.Row stretched>
                {err?
                <Message
                negative
                icon='exclamation'
                header='Error Occurred :('
                content={err}
                />:null}
                    <Grid.Column width={4} className='newdiv' style={{marginTop:'50px !important'}}>
                        <Form onSubmit={handleSubmit} style={{paddingTop:'50px !important'}}> 
                            <Form.Field>
                                <label style={{color:'#11155d',fontSize:'20px', paddingBottom:'10px'}}>Amount to Contribute</label>
                                <Input label='Wei' placeholder='100' labelPosition='right' onChange={handleChange}/>
                            </Form.Field>
                            <Button type='submit' style={{width:'100px'}} disabled={dis} loading={loading}>Donate</Button>
                        </Form>
                        
                    </Grid.Column>
                    
                <Grid.Column style={{marginTop:'50px !important'}}>
                    <Statistic>
                        <Statistic.Label style={{color:'white !important'}}>Campaign Balance</Statistic.Label>
                        <Statistic.Value style={{color:'white !important'}}>{props.contbal}</Statistic.Value>
                    </Statistic>
                    <Statistic>
                        <Statistic.Label style={{color:'white !important'}}>Minimum Contribution</Statistic.Label>
                        <Statistic.Value style={{color:'white !important'}}>{props.mincontr}</Statistic.Value>
                    </Statistic>
                </Grid.Column>
                <Grid.Column style={{marginTop:'50px !important'}}>
                    <Statistic>
                        <Statistic.Label style={{color:'white !important'}}>Number of Requests</Statistic.Label>
                        <Statistic.Value style={{color:'white !important'}}>{props.totreq}</Statistic.Value>
                    </Statistic>
                    <Statistic>
                        <Statistic.Label style={{color:'white !important'}}>Number of Contributors</Statistic.Label>
                        <Statistic.Value style={{color:'white !important'}}>{props.totapp}</Statistic.Value>
                    </Statistic>
                </Grid.Column>

                <Grid.Column className='newdiv1' style={{marginTop:'45px !important'}}>
                    <Accordion style={{fontSize:'15px !important',overflowWrap:'break-word'}} panels={panels} />    
                </Grid.Column>
                </Grid.Row>
            </Grid>
            <Button type='button' style={{width:'200px'}}  onClick={()=>router.push(`${address}/requests`)}>View Requests</Button>
            
        </Layout>
    );
};

export async function getServerSideProps(context) {
    // console.log(context.query.address);
    const campaign = await Campaign(context.query.address)
    const summary = await campaign.methods.getSummary().call();
    return {
        props:{
            mincontr:summary[0],
            contbal: summary[1],
            totreq : summary[2],
            totapp: summary[3],
            manager: summary[4]
        }
    }
  }

export default details;
