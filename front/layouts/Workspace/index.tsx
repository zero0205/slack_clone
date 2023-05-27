import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceName,
  WorkspaceWrapper,
  Workspaces,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import { Link } from 'react-router-dom';
import { Button, Input, Label } from '@pages/LogIn/styles';
import useInput from '@hooks/useInput';
import { toast } from 'react-toastify';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
const Menu = loadable(() => import('@components/Menu'));
const Modal = loadable(() => import('@components/Modal'));

const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, {
    // 설정된 시간 동안 1번만 요청하고 나머지 같은 요청들은 받은 데이터, 즉 캐시된 것 그대로 사용
    dedupingInterval: 2000,
  });

  const onLogout = useCallback((e) => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        // mutate: 서버에 데이터를 보내기 전 데이터를 미리 바꿔줌. 즉 서버 검사없이 프론트 데이터 미리 수정.
        // optimistic UI:
        // 먼저 성공할거라 생각하고 나중에 점검
        // mutate에서는 2번째 인자인 shouldRevalidate 옵션을 false로 주면 됨.
        // 기본적으로는 true(이 경우 pessimistic UI)
        mutate(false, false);
      });
  }, []);

  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  // 토글 함수
  const onClickUserProfile = useCallback((e) => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      // 폼에서는 새로고침 안되게 항상 e.preventDefault();
      e.preventDefault();
      // 띄어쓰기까지 막으려면 trim도 넣어야 함
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;

      // 워크스페이스 생성
      axios
        .post(
          'http://localhost:3095/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate();
          setShowCreateWorkspaceModal(false);
          // 폼 제출 후 input 창 비워놓기(다음에 클릭했을때 이전 값 안 남아있도록)
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
  }, []);

  if (!userData) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to="/workspace/${}/channel/일반">
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>Menuscroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      {children}
    </div>
  );
};

export default Workspace;
