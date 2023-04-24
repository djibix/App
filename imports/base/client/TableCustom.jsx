// A react component to render a table
import { useTracker } from "meteor/react-meteor-data";
import React, { useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";

// Renders the sort icon
const Sorting = ({ column }) => (
    <span className="react-table__column-header sortable">
        {column.isSortedDesc === undefined ? (
            <>N</>
        ) : (
            <span>
                {column.isSortedDesc
                    ? <>⌄</>
                    : <>⌃</>}
            </span>
        )}
    </span>
);

// Renders a table from columns and data:
// columns: an array of objects { Header: 'Header', accessor: 'accessor' }
// data: an array of objects to populate the table
export const TableCustom = ({ columns, records, setTableState }) => {
    // Memoize records
    const data = React.useMemo(
        () => records, [records]
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
    } = useTable({
        columns,
        data,
        // manualSortBy: true,
    }
        , useSortBy
    );

    // call setTableState after rendering
    useEffect(() => {
        setTableState(state);
    });

    return (
        <table {...getTableProps()} className="table table-striped">
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                {column.isSorted ? <Sorting column={column} /> : ''}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export const TableWithSubscription = ({ columns, collection, subscription }) => {
    // Store the table state
    const [tableState, setTableState] = useState([]);

    // Subscribe to the  publication
    // Track user and subscription
    const { data, isLoading } = useTracker(() => {
        var options = {limit: 10};
        if (tableState.sortBy) {
            options.sort = tableState.sortBy.map((sort) => {
                return [sort.id, sort.desc ? 'desc' : 'asc'];
            });
        }
        console.log('options', options);
        const handle = Meteor.subscribe(subscription, options);
        const isLoading = !handle.ready();
        const data = collection.find({},options).fetch();
        if (!isLoading) { console.log('data', data) }
        return { data, isLoading };
    });

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
    } = useTable({
        columns,
        data,
        manualSortBy: true,
    },
        useSortBy,
    );

    // Update the sortBy state when the table's sorting state changes
    React.useEffect(() => {
        setTableState(state);
    }, [state]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <table {...getTableProps()} className="table table-striped">
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                {column.isSorted ? <Sorting column={column} /> : ''}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
