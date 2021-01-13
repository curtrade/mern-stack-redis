import { createContext } from 'react';

function noop() {}

export const SessionContext = createContext({
    token: null,
    userId: null,
    subpart: '',
    init: noop,
    clear: noop,
    isAlive: false
});
