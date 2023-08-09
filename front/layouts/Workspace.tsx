import fetcher from "@utils/fetcher";
import axios from "axios";
import React, { FC, useCallback } from "react";
import { Redirect } from "react-router";
import useSWR from 'swr';

const Workspace: FC = ({children})=> {
    const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher,{
        dedupingInterval: 2000, // 2초
    });

    const onLogout = useCallback(()=>{
        axios.post('http://localhost:3095/api/users/logout', null,{
            withCredentials: true,
        })
        .then((response)=>{
            mutate(response.data, false);   // OPIMISTIC UI
        })
    },[]);

    if (!data){
        return <Redirect to='/login'/>
    }

    return(
        <div>
            <button onClick={onLogout}>로그아웃</button>
            {children}
        </div>
    );
}

export default Workspace;