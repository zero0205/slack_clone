import React, { useCallback, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Form,Error,Success, Label, Header, Input, LinkContainer, Button } from './styles';
import useInput from "@hooks/useInput";
import axios from "axios";
import fetcher from "@utils/fetcher";
import useSWR from 'swr';

const SignUp = () => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

  const [email, onChangeEmail, setEmail] = useInput('');
  const [nickname, onChangeNickname, setNickname] = useInput('');
  const [password, ,setPassword] = useInput('');
  const [passwordCheck, ,setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignupError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback((e)=>{
    setPassword(e.target.value);
    setMismatchError(e.target.value !== passwordCheck);
  },[passwordCheck]);

  const onChangePasswordCheck = useCallback((e)=>{
    setPasswordCheck(e.target.value);
    setMismatchError(e.target.value !== password);
  },[password]);

  const onSubmit = useCallback((e)=>{
    e.preventDefault();
    if(!mismatchError){
      console.log("서버로 회원가입하기");

      setSignupError('');
      setSignUpSuccess(false);

      axios.post('http://localhost:3095/api/users',{
        email,
        nickname,
        password,
      })
      .then((response)=>{
        console.log(response);
        setSignUpSuccess(true);
      })
      .catch((error)=>{
        console.log(error.response);
        setSignupError(error.response.data);
      })
      .finally(()=>{});
    }
  }, [email, nickname, password, passwordCheck]);

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

    return(
        <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
           {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
    )
}

export default SignUp;