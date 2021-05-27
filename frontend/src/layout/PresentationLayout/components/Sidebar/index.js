import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect'
import List from '@material-ui/core/List';

// Project Components
import { withMemo } from 'components/HOC';
import { SidebarItem } from './components';


const Sidebar = ({ menuList, ...props }) => {    
    return (
        <div className="sidebar">
            <List>
                {
                    menuList.map((menu, index) => {
                        return (
                            <SidebarItem menu={menu} key={"sidebar-" + index} {...props}/>
                        )
                    })
                }                
            </List>
        </div>
    );
}

const state = createStructuredSelector({});
export default connect(state)(withMemo(Sidebar));
