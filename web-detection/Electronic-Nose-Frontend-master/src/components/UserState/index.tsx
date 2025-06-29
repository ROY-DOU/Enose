import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useAccess, useModel } from "@umijs/max";
import { Avatar,  Dropdown, Space } from "antd";
import { history } from "@umijs/max";
import React from "react";
import User from "@/services/user";
import { useEffect } from "react";

const UserState: React.FC = () => {
    const access = useAccess()
    const { initialState, setInitialState } = useModel('@@initialState')


    useEffect(() => {
        if (!access.isLogin) {
            history.push('/login')
        }
    }, [access.isLogin])


    const handleLogout = async () => {
        await User.logout();
        setInitialState({ userInfo: undefined })
    }

    const items = [
        {
            key: '1',
            label: (
                <a onClick={(e) => { e.preventDefault(); handleLogout() }}>
                    退出登录
                </a>
            ),
        },
    ];

    if (!access.isLogin)
        return <></>

    return <div style={{ display: 'flex', alignItems: "center", height: 64, gap: 8 }}>
        <Avatar icon={<UserOutlined />} />
        <Dropdown
            menu={{ items }}
            placement="top"
        >
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    {initialState?.userInfo?.Username}
                    <DownOutlined />
                </Space>
            </a>
        </Dropdown>

    </div>
}

export default UserState