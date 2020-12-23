import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import TableCell from '@material-ui/core/TableCell'
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized'
import TableRow from '@material-ui/core/TableRow'
import useStyles from './styles'
import Tooltip from '@material-ui/core/Tooltip'
import Checkbox from '@material-ui/core/Checkbox'
import _orderBy from 'lodash/orderBy'
import useHeaderRenderer from './hooks/useHeaderRenderer'

const VirtualizedTable = ({ columns, rowHeight, onSelect, onSelectAll, headerHeight, selected, rows, ...tableProps }) => {
  const classes = useStyles()
  const [ sortDirection, setSortDirection ] = useState(SortDirection.ASC)
  const [ sortBy, setSortBy ] = useState('')
  const [ filters, setFilters ] = useState([])

  const createSortHandler = useCallback((property) => () => {
    const isAsc = sortBy === property && sortDirection === SortDirection.ASC
    setSortDirection(isAsc ? SortDirection.DESC : SortDirection.ASC)
    setSortBy(property)
  }, [ sortBy, sortDirection ])

  const getRowClassName = useCallback(() => {
    return clsx(classes.tableRow, classes.flexContainer, classes.tableRowHover)
  }, [ classes ])

  const onChangeColumnFilters = useCallback((columnKey, columnFilters) => {
    const updatedFilter = {
      dataKey: columnKey,
      filters: columnFilters,
    }

    setFilters(prevFilters => {
      const existDataKeys = prevFilters.some(({ dataKey }) => dataKey === columnKey)
      if (existDataKeys) {
        return prevFilters.map((filter) => filter.dataKey === columnKey ? updatedFilter : filter)
      }
      return [ ...prevFilters, updatedFilter ]
    })
  }, [])

  const cellRenderer = useCallback(({ cellData, columnIndex }) => {
    const { align, role } = columns[columnIndex]

    return (
      <Tooltip title={cellData}>
        <TableCell
          component={'div'}
          padding={role === 'checkbox' ? 'none' : undefined}
          className={clsx(classes.tableCell, classes.flexContainer)}
          variant="body"
          align={align}
          style={{ height: rowHeight }}>
          {role === 'checkbox' ? <Checkbox checked={selected.includes(cellData)} /> : cellData}
        </TableCell>
      </Tooltip>
    )
  }, [ classes, rowHeight, selected, columns ])

  const allSelected = useMemo(() => (rows.length > 0 && selected.length === rows.length), [ rows, selected ])
  const isIndeterminate = useMemo(() => (selected.length > 0 && selected.length < rows.length), [ rows, selected ])
  const headerRenderer = useHeaderRenderer(rows, headerHeight, columns, createSortHandler, onSelectAll, allSelected, isIndeterminate, onChangeColumnFilters)

  const rowRenderer = useCallback(({
    className,
    columns,
    key,
    rowData,
    style,
  }) => (
    <TableRow
      key={key}
      className={className}
      style={style}
      component={'div'}
      hover
      role={rowData.role}
      onClick={event => onSelect(event, rowData)}
      selected={selected.includes(rowData.id)}>
      {columns}
    </TableRow>
  ), [ selected, onSelect ])

  const items = useMemo(() => {
    const filteredRows = rows.filter((row) => {
      return filters.every(filter => (
        !Array.isArray(filter.filters) ||
        filter.filters.length === 0 ||
        filter.filters.includes(row[filter.dataKey])
      ))
    })

    return (
      _orderBy(filteredRows, sortBy, (sortDirection || '').toLowerCase())
    )
  }, [ rows, sortBy, sortDirection, filters ])

  const rowGetter = useMemo(() => ({ index }) => items[index], [ items ])

  return (
    <AutoSizer>
      {({ height, width: tableWidth }) => (
        <Table
          size={'small'}
          height={height}
          width={tableWidth}
          rowHeight={rowHeight}
          headerHeight={headerHeight}
          className={classes.table}
          rowCount={items.length}
          {...tableProps}
          sortBy={sortBy}
          sortDirection={sortDirection}
          rowRenderer={rowRenderer}
          rowGetter={rowGetter}
          rowClassName={getRowClassName}>
          {columns.map(({ dataKey, fullWidth, ...other }, index) => {
            return (
              <Column
                key={dataKey}
                headerRenderer={(headerProps) =>
                  headerRenderer({
                    ...headerProps,
                    columnIndex: index,
                  })
                }
                className={classes.flexContainer}
                cellRenderer={cellRenderer}
                dataKey={dataKey}
                {...other}
              />
            )
          })}
        </Table>
      )}
    </AutoSizer>
  )
}


VirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onSelect: PropTypes.func,
  rowHeight: PropTypes.number,
  rows: PropTypes.array.isRequired,
}

VirtualizedTable.defaultProps = {
  headerHeight: 48,
  rowHeight: 48,
}

export default VirtualizedTable