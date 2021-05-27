import React, { useEffect, useState, useCallback } from 'react';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  GroupingState,
  IntegratedGrouping,
  IntegratedSelection,
  SelectionState,
  PagingState,
  CustomPaging,
  EditingState
} from '@devexpress/dx-react-grid';
import clsx from 'clsx';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableGroupRow,
  TableSelection,
  PagingPanel,
  TableEditRow
} from '@devexpress/dx-react-grid-material-ui';
import { groupBy, last } from 'lodash';
import {
  TableHeaderCell,
  TableEditCell,
  TableHeaderRowComponent,
  TableStubCell,
  GroupRowComponent,
  GroupRowCellComponent,
  GroupRowCellContentComponent,
  GroupRowCellIconComponent,
  TableContentCell
} from './components';
//Project Components
import { withMemo } from 'components/HOC';
const EmoneyTable = ({
  data,
  columns,
  isGrouping,
  isSelectable,
  grouping,
  isSubHeader,
  subHeader,
  onSelected,
  isPagination,
  onRefreshPage,
  totalCount,
  isEditing,
  editingRowIds,
  className,
  currentPage,
  sizePerPage,
  onRowChangesChange,
  onEditingRowIdsChange,
  rowChanges,
  loadingPromise,
  ...props
}) => {
  const [expandedGroups, setExpandedGroups] = useState([]);

  const [loadingData, setLoadingData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // should only be called when loadingPromise changes
  // thats why I disabled the warning here
  /* eslint-disable react-hooks/exhaustive-deps*/
  useEffect(() => {
    if (!loadingPromise) {
      return;
    }

    async function waitForPromise() {
      setIsLoading(true);
      if (!data?.length) {
        setLoadingData(Array.apply(null, Array(sizePerPage)).map(() => ({[grouping?.field]: (<Skeleton style={{ height: 30, width: 100 }} variant="text" />)})));
      }
      await loadingPromise;
      setLoadingData(null);
      setIsLoading(false);
    }
    waitForPromise();
  }, [loadingPromise]);
  /* eslint-enable react-hooks/exhaustive-deps*/

  const groupingValues = isGrouping && [
    {
      columnName: grouping.field
    }
  ];
  const [pageSizes] = React.useState([10, 50, 100, 500, 0]);

  // handler
  const handleSelectChange = useCallback(
    (selectedIds) => {
      if (selectedIds?.length > 1) {
        selectedIds = [last(selectedIds)];
        setSelection(selectedIds);
      }
      if (onSelected && selectedIds?.length) {
        onSelected(data[selectedIds[0]]);
      }
    },
    [onSelected, data]
  );

  // Effect
  useEffect(() => {
    if (!isGrouping) {
      return;
    }

    const dataToGroup = !data?.length && loadingData ? loadingData : data;
    const groups = groupBy(dataToGroup, function (item) {
      return item[grouping.field];
    });
    setExpandedGroups(Object.keys(groups));
  }, [data, grouping, isGrouping, loadingData]);
  const [selection, setSelection] = useState([0]);

  return (
    <Paper className={clsx(className, 'emoney-grid-container')}>
      <Grid rows={loadingData || data} columns={columns}>
        {isGrouping && (
          <GroupingState
            grouping={groupingValues}
            expandedGroups={expandedGroups}
            onExpandedGroupsChange={setExpandedGroups}
          />
        )}
        {isGrouping && <IntegratedGrouping />}
        {isSelectable && (
          <SelectionState
            selection={selection}
            onSelectionChange={handleSelectChange}
          />
        )}
        {isSelectable && <IntegratedSelection selection={selection} />}
        <Table
          cellComponent={(props) => (
            <TableContentCell {...props} isLoading={isLoading} />
          )}
          stubCellComponent={TableStubCell}
        />
        <TableHeaderRow
          rowComponent={(props) => {
            return (
              <TableHeaderRowComponent
                {...props}
                columncount={columns.length}
                issubheader={isSubHeader}
                subheader={subHeader}
              />
            );
          }}
          cellComponent={TableHeaderCell}
        />
        {isSelectable && (
          <TableSelection
            selectByRowClick
            highlightRow
            showSelectionColumn={false}
          />
        )}
        {isGrouping && (
          <TableGroupRow
            rowComponent={GroupRowComponent}
            cellComponent={GroupRowCellComponent}
            contentComponent={GroupRowCellContentComponent}
            iconComponent={GroupRowCellIconComponent}
          />
        )}

        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={(page) => {
            if (onRefreshPage) {
              onRefreshPage(page, sizePerPage);
            }
          }}
          defaultPageSize={sizePerPage}
          onPageSizeChange={(size) => {
            if (onRefreshPage) {
              onRefreshPage(currentPage, size);
            }
          }}
        />
        <CustomPaging totalCount={totalCount} />
        {isPagination && <PagingPanel pageSizes={pageSizes} />}

        {isEditing && (
          <EditingState
            editingRowIds={editingRowIds}
            onRowChangesChange={onRowChangesChange}
            onEditingRowIdsChange={onEditingRowIdsChange}
            rowChanges={rowChanges}
          />
        )}
        {isEditing && <TableEditRow cellComponent={TableEditCell} />}
      </Grid>
    </Paper>
  );
};

export default withMemo(EmoneyTable);
