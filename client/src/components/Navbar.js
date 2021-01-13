import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { SessionContext } from '../context/SessionContext';

export const Navbar = () => {
    const history = useHistory();
    const session = useContext(SessionContext);

    const logoutHandler = (event) => {
        event.preventDefault();
        session.clear();
        history.push('/');
    };

    return (
        <nav>
            <div
                className="nav-wrapper blue darken-1"
                style={{ padding: '0 2rem' }}
            >
                <a href="#" className="brand-logo">
                    Сокращение ссылок
                </a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li>
                        <NavLink to="/create">Создать</NavLink>
                    </li>
                    <li>
                        <NavLink to="/links">Ссылки</NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings">Настройки</NavLink>
                    </li>
                    <li>
                        <a href="/clear" onClick={logoutHandler}>
                            Очистить сессию
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
