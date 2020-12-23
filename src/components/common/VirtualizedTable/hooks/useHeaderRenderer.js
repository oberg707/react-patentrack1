import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TableCell from '@material-ui/core/TableCell'
import clsx from 'clsx'
import Checkbox from '@material-ui/core/Checkbox'
import { FilterList } from '@material-ui/icons'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Menu from '@material-ui/core/Menu'
import Fade from '@material-ui/core/Fade'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import _groupBy from 'lodash/groupBy'
import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'

const useStyles = makeStyles(() => ({
  listItemIcon: {
    minWidth: 0,
  },
  filterList: {
    marginRight: 3,
    fontSize: 13,
  },
  th: {
    display: 'flex',
    border: 'none',
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableCell: {
    flex: 1,
    whiteSpace: 'nowrap',
    border: 'none',
    alignItems: 'center',
    padding: '0 10px',
  },
  paper: {
    maxHeight: 300,
    overflow: 'auto',
  },
  chip: {
    marginLeft: 15,
  },
}))

const HeadCell = ({
  headerHeight,
  createSortHandler,
  onSelectAll,
  allSelected,
  isIndeterminate,
  sortBy,
  dataKey,
  sortDirection,
  label,
  columns,
  columnIndex,
  rows,
  onChangeColumnFilters,
}) => {
  const classes = useStyles()
  const { align, role, disableSort, filterable } = columns[columnIndex]
  const [ anchorEl, setAnchorEl ] = useState(null)
  const [ columnFilters, setColumnFilters ] = useState([])

  const openMenu = e => setAnchorEl(e.currentTarget)
  const closeMenu = () => setAnchorEl(null)

  const filterValues = useMemo(() => {
    return Object.entries(_groupBy(rows, dataKey)).map(([ key, values ]) => ({ key, count: values.length }))
  }, [ rows, dataKey ])

  const onChangeFilter = (value) => () => (
    setColumnFilters(prevFilters => prevFilters.includes(value) ? prevFilters.filter((val) => val !== value) : [ ...prevFilters, value ])
  )

  useEffect(() => {
    onChangeColumnFilters(dataKey, columnFilters)
  }, [ onChangeColumnFilters, dataKey, columnFilters ])

  return (
    <TableCell
      component={'div'}
      padding={role === 'checkbox' ? 'none' : undefined}
      className={clsx(classes.tableCell, classes.flexContainer, classes.th)}
      variant="head"
      style={{ height: headerHeight }}
      align={align}>
      {
        role === 'checkbox' ? (
          onSelectAll && <Checkbox checked={allSelected} onChange={onSelectAll} indeterminate={isIndeterminate} />
        ) : (
          <>
            {
              filterable && (
                <FilterList
                  className={classes.filterList}
                  color={columnFilters.length ? 'secondary' : 'inherit'}
                  size={'small'}
                  onClick={openMenu} />
              )
            }


            {
              disableSort ? label : (
                <TableSortLabel
                  onClick={createSortHandler(dataKey)}
                  active={dataKey === sortBy}
                  direction={sortDirection.toLowerCase()}>
                  {label}
                </TableSortLabel>
              )
            }

            {
              (
                <Menu
                  anchorEl={anchorEl}
                  open={!!anchorEl}
                  onClose={closeMenu}
                  classes={{ paper: classes.paper }}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  TransitionComponent={Fade}>
                  {
                    filterValues.map(({ key, count }) => {
                      return (
                        <MenuItem key={key} onClick={onChangeFilter(key)}>
                          <ListItemIcon className={classes.listItemIcon}>
                            <Checkbox
                              checked={columnFilters.includes(key)}
                              edge="start"
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': 'labelId' }}
                            />
                          </ListItemIcon>
                          <ListItemText id={'labelId'} primary={key} />
                          <Chip className={classes.chip} label={count} size={'small'} variant={'outlined'} />
                        </MenuItem>
                      )
                    })
                  }
                </Menu>
              )
            }
          </>
        )
      }
    </TableCell>
  )
}

function useHeaderRenderer(rows, headerHeight, columns, createSortHandler, onSelectAll, allSelected, isIndeterminate, onChangeColumnFilters) {
  return useCallback(({ sortBy, dataKey, sortDirection, label, columnIndex }) => {
    return (
      <HeadCell
        columns={columns}
        columnIndex={columnIndex}
        headerHeight={headerHeight}
        createSortHandler={createSortHandler}
        onSelectAll={onSelectAll}
        allSelected={allSelected}
        isIndeterminate={isIndeterminate}
        sortBy={sortBy}
        dataKey={dataKey}
        sortDirection={sortDirection}
        label={label}
        rows={rows}
        onChangeColumnFilters={onChangeColumnFilters}
      />
    )
  }, [
    headerHeight,
    columns,
    createSortHandler,
    onSelectAll,
    allSelected,
    isIndeterminate,
    rows,
    onChangeColumnFilters,
  ])
}


export default useHeaderRenderer

// checked={columnFilters.some((filter) => filter.columnName === column.name && filter.value === value)}
