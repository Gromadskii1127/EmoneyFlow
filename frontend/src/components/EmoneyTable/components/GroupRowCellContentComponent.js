import { withMemo } from 'components/HOC';
const GroupRowCellContentComponent = ({ row, column, value, ...props }) => {
  return (
    <div className="emoney-group-row-content m-0">
      {row.value}
    </div>
  );
};
export default withMemo(GroupRowCellContentComponent);
