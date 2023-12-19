import React, { useState } from 'react';
import { UsergroupDeleteOutlined, HomeOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const items: MenuProps['items'] = [
    {
        label: <Link to="/">Home</Link>,
        key: 'home',
        icon: <HomeOutlined />,
    },
    {
        label: <Link to="users">Manage Users</Link>,
        key: 'users',
        icon: <UsergroupDeleteOutlined />,
    },

];

const Header: React.FC = () => {
    let arr: string[] = window.location.pathname.split('/');
    let lastPath: string = arr.at(-1) || 'home';
    const [current, setCurrent] = useState(lastPath);

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};

export default Header;