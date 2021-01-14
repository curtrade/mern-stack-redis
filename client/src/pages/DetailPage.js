import React, { useState, useCallback, useContext, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { SessionContext } from '../context/SessionContext';
import { Loader } from '../components/Loader';
import { LinkCard } from '../components/LinkCard';

export const DetailPage = () => {
    const { token } = useContext(SessionContext);
    const { request, loading } = useHttp();
    const [link, setLink] = useState(null);
    const linkId = useParams().id;

    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            console.debug({ fetched });
            setLink(fetched);
        } catch (e) {
            /*...*/
        }
    }, [token, linkId, request]);

    useEffect(() => {
        getLink();
    }, [getLink]);

    if (loading) {
        return <Loader />;
    }

    return <Fragment>{link && <LinkCard link={link} />}</Fragment>;
};
