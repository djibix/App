import React from 'react';
import { TableWithSubscription } from '/imports/base/client/TableCustom';
import { Logs } from '/imports/logger/both-methods';
import { log } from '/imports/logger/client-functions';

// A button to test logs recording
export function LogButton() {
    const handleClick = () => {
        log('info', 'Hello from APP');
    }
    return (
        <button onClick={handleClick}>Log</button>
    )
}

// Component to display logs in a table
export function LogsTable() {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Server Timestamp',
                accessor: 'serverTimeStamp',
            },
            {
                Header: 'Server DateTime',
                accessor: 'serverDateTime',
            },
            {
                Header: 'Client Timestamp',
                accessor: 'clientTimeStamp',
            },
            {
                Header: 'Client DateTime',
                accessor: 'clientDateTime',
            },
            {
                Header: 'Level',
                accessor: 'level',
            },
            {
                Header: 'Message',
                accessor: 'message',
            },
            {
                Header: 'User',
                accessor: 'userLogin',
            },
            {
                Header: 'User Id',
                accessor: 'userId',
            },
        ],
        []
    )

    return (
        <TableWithSubscription columns={columns} collection={Logs} subscription={'logs'} />
    )
}

