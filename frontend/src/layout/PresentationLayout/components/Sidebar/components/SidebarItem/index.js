import React from 'react';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect'

//Project Components
import { withMemo } from 'components/HOC';

const SidebarItem = ({ key, menu, selected, ...props }) => {
    const location = useLocation().pathname;
    return (
        <Link to={menu.path}>
            <ListItem button key={key} className={location === menu.path || (menu.subpaths && Array.isArray(menu.subpaths) && menu.subpaths.includes(location)) ? "sidebar-list-item-selected" : ""}>
                <ListItemIcon>
                    {menu.icon}
                </ListItemIcon>
            </ListItem>
        </Link>
    )
}
const state = createStructuredSelector({});
export default connect(state)(withMemo(SidebarItem));

