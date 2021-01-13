import React, { useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { SessionContext } from '../context/SessionContext';
import { Loader } from '../components/Loader';

export const InitPage = () => {
    const session = useContext(SessionContext);
    const message = useMessage();
    const { loading, request, error, clearError } = useHttp();

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const registerUserHandler = async () => {
        try {
            const data = await request('/api/user/register', 'POST', {
                action: 'create-user'
            });

            console.debug({ data });

            session.init(data.token, data.userId, data.subpart);
        } catch (err) {
            message('Что-то пошло не так, попробуйте перезагрузить страницу');
        }
    };

    useEffect(() => {
        registerUserHandler();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return <Redirect to="/create" />;
};
