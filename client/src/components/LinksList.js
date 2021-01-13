import React from 'react';
import { Link } from 'react-router-dom';

/* eslint-disable react/prop-types */
export const LinksList = ({ links }) => {
    if (!links.length) {
        return <p className="center">Ссылок пока нет</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>№</th>
                    <th>Ваша ссылка</th>
                    <th>Короткая ссылка</th>
                    <th>...</th>
                </tr>
            </thead>
            <tbody>
                {links.map(({ from, to, _id }, index) => {
                    return (
                        <tr key={_id}>
                            <td>{index + 1}</td>
                            <td>{to}</td>
                            <td>{from}</td>
                            <td>
                                <Link to={`/detail/${_id}`}>Открыть</Link>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
/* eslint-enable react/prop-types */
