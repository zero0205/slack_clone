import React, { useCallback } from 'react';
import { Container, Header } from '@pages/Channel/styles';
import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import ChatList from '@components/ChatList';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log('ch submit');
    setChat('');
  }, []);
  return (
    <Container>
      <Header>채널</Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default Channel;
