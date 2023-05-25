import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher,{
    // 설정된 시간 동안 1번만 요청하고 나머지 같은 요청들은 받은 데이터, 즉 캐시된 것 그대로 사용
    dedupingInterval: 10000,  
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

  if (!data) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
