import React,{useState} from 'react';
import { Menu,Icon } from 'semantic-ui-react'
import { useRouter } from 'next/router'


const Header = () => {

    const [item,setItem] = useState('');
    const router = useRouter();

    const handleClick = (e,{name})=>{
        setItem(name)
        router.push(name)
    }


  return(
    <Menu className="Header" size='huge' inverted>
        <Menu.Item
          name='coincrow'
          // active={item === '/'}
          // onClick={handleClick}
        >
          CoinCrow
        </Menu.Item>
    
        <Menu.Menu position='right'>
              <Menu.Item
              name='/'
              active={item === '/'}
              onClick={handleClick}
              >
              Campaigns
              </Menu.Item>

              <Menu.Item
              name='/campaigns/new'
              active={item === '/campaigns/new'}
              onClick={handleClick}
              >
              <Icon name='add' fitted/>
              </Menu.Item>
        </Menu.Menu>
  </Menu>
  );
};

export default Header;
