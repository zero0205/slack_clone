import { Container } from '@pages/Channel/styles';
import fetcher from '@utils/fetcher';
import React from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import gravatar from 'gravatar';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';

const DirectMessage = () => {
  const {workspace, id} = useParams<{workspace:string; id:string}>();
  const {data:userData} = useSWR(`http://localhost:3095/api/workspaces/${workspace}/users/${id}`, fetcher);
  const {data:myData} = useSWR(`http://localhost:3095/api/users`, fetcher);

  if (!userData || !myData){
    return null;
  }
  return <Container>
    <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
    <span>{userData.nickname}</span>
    <ChatList/>
    <ChatBox chat=""/>
  </Container>
};

export default DirectMessage;
