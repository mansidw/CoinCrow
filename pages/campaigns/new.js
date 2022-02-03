import React,{useState} from 'react';
import Layout from '../../components/Layout'
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3'
import { useRouter } from 'next/router'
import {Form , Button, Input, Message} from 'semantic-ui-react';

const CampaignNew = () => {

  const [contri,setContri] = useState('');
  const router = useRouter();
  const [loading,setLoading] = useState(false)
  const [err,setErr] = useState(null)

  async function handleSubmit(e){
    e.preventDefault();
    let a=0;
    setLoading(true)
    setErr(null)
    try
    {
      
      const accounts = await web3.eth.getAccounts()
      await factory.methods.createCampaign(contri).send({
        from: accounts[0],
      });
      a=1;
    }
    catch(err){
      setErr(err.message)
    }
    setLoading(false)
    if(a){
      router.push('/')
    }
    
  }

  function handleChange(e){
    setContri(e.target.value)
  }

  return (
    <Layout>
      <h1 style={{color:'white'}}>Create a Campaign</h1>

      {err?
          <Message
          negative
          icon='exclamation'
          header='Error Occurred :('
          content={err}
        />:null}
      
      <div className='newdiv'>
        
        <Form style={{paddingTop:'40px'}} onSubmit={handleSubmit}> 
          <Form.Field>
            <label style={{color:'#11155d',fontSize:'20px', paddingBottom:'10px'}}>Minimum Contribution</label>
            <Input label='Wei' placeholder='100' labelPosition='right' onChange={handleChange}/>
          </Form.Field>
          <Button loading={loading} type='submit' style={{width:'100px'}}>Create</Button>
        </Form>
      </div>

    </Layout>
  );
};

export default CampaignNew;
