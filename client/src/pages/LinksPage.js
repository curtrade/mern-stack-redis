import React, {
    useState,
    useEffect,
    useCallback,
    Fragment,
    useContext
} from 'react';
import { useHttp } from '../hooks/http.hook';
import { SessionContext } from '../context/SessionContext';
import { Loader } from '../components/Loader';
import { PaginatedLinksList } from '../components/PaginatedLinksList';
import { useMessage } from '../hooks/message.hook';

export const LinksPage = () => {
    const message = useMessage();
    const [links, setLinks] = useState([]);
    const { loading, request } = useHttp();
    const { token } = useContext(SessionContext);

    const fetchLinks = useCallback(async () => {
        try {
            const fetched = await request(`/api/link`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setLinks(fetched);
        } catch (e) {
            message('Что-то пошло не так, попробуйте ещё раз');
        }
    }, [token, request]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    if (loading) {
        return <Loader />;
    }

    return <Fragment>{links && <PaginatedLinksList links={links} />}</Fragment>;
};
