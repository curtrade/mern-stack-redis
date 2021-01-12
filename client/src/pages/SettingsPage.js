import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import { SessionContext } from '../context/SessionContext'
import { useMessage } from '../hooks/message.hook'

export const SettingsPage = () => {
    const { token } = useContext(SessionContext)
    const message = useMessage()
    const { request } = useHttp()
    const [subpart, setSubpart] = useState('')

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const pressHandler = async (event) => {
        if (event.key === 'Enter') {
            try {
                await request(
                    '/api/user/subpart',
                    'PUT',
                    { action: 'update', subpart },
                    { Authorization: `Bearer ${token}` }
                )
                message('Subpart сохранен')
            } catch (e) {
                message(e.message)
            }
        }
    }

    return (
        <div className="row">
            <div className="col.s8.offset-s2" style={{ paddingTop: '2rem' }}>
                <div className="input-field">
                    <input
                        placeholder="Введите subpart"
                        id="subpart"
                        type="text"
                        value={subpart}
                        onChange={(e) => setSubpart(e.target.value)}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="subpart">
                        Введите subpart и нажмите Enter
                    </label>
                </div>
            </div>
        </div>
    )
}
