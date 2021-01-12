import React from 'react'
import { DataTable } from 'react-data-components'

/* eslint-disable react/prop-types */
export const PaginatedLinksList = ({ links }) => {
    if (!links.length) {
        return <p className="center">Ссылок пока нет</p>
    }

    const renderLinkPageUrl = (val, row) => (
        <a href={`/detail/${row['_id']}`}>Перейти</a>
    )

    const columns = [
        { title: 'Ваша ссылка', prop: 'from' },
        { title: 'Короткая ссылка', prop: 'to' },
        { title: '', render: renderLinkPageUrl, className: 'text-center' }
    ]

    return (
        <DataTable
            title="Ссылки"
            keys="to"
            columns={columns}
            initialData={links}
            initialPageLength={5}
        />
    )
}
/* eslint-enable react/prop-types */
