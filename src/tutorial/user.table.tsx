import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FieldType } from './user';
import { Input } from 'antd';
import { UserAddOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Modal } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import { v4 as uuidv4 } from 'uuid';



interface IUser {
    _id: string;
    email: string;
    name: string;
    role: string;
}

const TableUser = () => {
    const [status, setStatus] = useState('new');
    const [users, setUsers] = useState([]);
    const [api, contextHolder] = notification.useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState<FieldType>({
        email: '',
        name: '',
        password: '',
        gender: '',
        age: 20,
        address: '',
        role: '',
    });
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection: TableRowSelection<IUser> = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Select Odd Row',
                onSelect: (changeableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return false;
                        }
                        return true;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Select Even Row',
                onSelect: (changeableRowKeys) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
                        if (index % 2 !== 0) {
                            return true;
                        }
                        return false;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
        ],
    };
    const openNotification = (message: string) => {
        api.open({
            message: 'Message',
            description:
                message,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const createNewUser = async (data: FieldType) => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjU3MTFkNWVjYjE3ZDUwODFkMDE2ZjhmIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MDI3MTE1MTAsImV4cCI6MTc4OTExMTUxMH0.VJd2iUHRANwYfzgUDfJbDMwEiD_GJq5swx0vA2Xqv1c';
        let rs = await fetch('http://localhost:8000/api/v1/users', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        let kq = await rs.json();
        if (kq.statusCode === 201) {
            setIsModalOpen(false);
            setNewUser({
                email: '',
                name: '',
                password: '',
                gender: '',
                age: 20,
                address: '',
                role: '',
            })
            fetchUser();
            openNotification(kq.message);
            setIsModalOpen(false);
        } else {
            openNotification(kq.message);
        }

    }

    const handleOk = async () => {
        if (status === 'new')
            await createNewUser(newUser);
        else {
            await editUser();
        }

    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleOnChange = (value: string, key: keyof FieldType) => {
        let user = { ...newUser };
        if (key in user) {
            if (key === 'age') {
                user[key] = +value;
            } else
                user[key] = value;
            setNewUser(user);
        }
    };

    const handleOnFocus = (e: any, key: string) => {
        if (e.code === 'Enter') {
            let arr: string[] = ['name', 'email', 'password', 'gender', 'age', 'address', 'role']
            let index: number = arr.indexOf(key);
            if (index < arr.length - 1) {
                document.getElementById(arr[index + 1])?.focus();
            } else {
                // xử lý login khi enter role => tạo mới người dùng
                handleOk();
            }
        }
    }
    const handleOnEdit = async (record: any) => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjU3MTFkNWVjYjE3ZDUwODFkMDE2ZjhmIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MDI1Mjc4MDEsImV4cCI6MTc4ODkyNzgwMX0.ZIYcXd01wqgA4ojZEQQhuF7JsOF3x9FwRsMgUBOYvE4';
        await new Promise((resolve, reject) => {
            setIsModalOpen(true);
            setStatus('edit');
            setTimeout(() => {
                resolve('Modal is opened');
            },);
        })
        let user = { ...record };
        user.password = uuidv4();
        const inputEmail = document.getElementById("email");
        const inputPassword = document.getElementById("password");
        if (inputPassword && inputEmail) {
            inputEmail.setAttribute('disabled', '');
            inputPassword.setAttribute('disabled', '');
        }
        setNewUser(user);
    }

    const editUser = async () => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjU3MTFkNWVjYjE3ZDUwODFkMDE2ZjhmIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MDI1Mjc4MDEsImV4cCI6MTc4ODkyNzgwMX0.ZIYcXd01wqgA4ojZEQQhuF7JsOF3x9FwRsMgUBOYvE4';
        let rs = await fetch('http://localhost:8000/api/v1/users', {
            method: 'PATCH',
            headers: {
                Authorization: 'Bearer ' + token,
                "Content-type": "application/json"
            },
            body: JSON.stringify(newUser)
        });
        let kq = await rs.json();
        if (kq.statusCode === 200) {
            const inputEmail = document.getElementById("email");
            const inputPassword = document.getElementById("password");
            if (inputPassword && inputEmail) {
                inputEmail.setAttribute('disabled', '');
                inputPassword.setAttribute('disabled', '');
            }
            setIsModalOpen(false);
            fetchUser();
            openNotification(kq.message);
        } else {
            openNotification(kq.message);
        }
    }

    const handleOnDelete = async (record: IUser) => {
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjU3MTFkNWVjYjE3ZDUwODFkMDE2ZjhmIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MDI1Mjc4MDEsImV4cCI6MTc4ODkyNzgwMX0.ZIYcXd01wqgA4ojZEQQhuF7JsOF3x9FwRsMgUBOYvE4';
        let rs = await fetch('http://localhost:8000/api/v1/users/' + record._id, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + token }
        });
        let kq = await rs.json();
        if (kq.statusCode === 200) {
            fetchUser();
            openNotification(kq.message);
        } else {
            openNotification(kq.message);
        }

    }

    const columns: ColumnsType<IUser> = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (value, record) => {
                return (
                    <span>{record.email}</span>
                )
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Action',
            width: '20%',
            render: (value, record) => {
                return (
                    <>
                        <Button className='mx-1' style={{ borderColor: '#FF9632' }} type="default" icon={<EditOutlined />}
                            onClick={() => handleOnEdit(record)}
                        >Edit</Button>
                        <Button danger className='mx-1' type="default" icon={<DeleteOutlined />}
                            onClick={() => handleOnDelete(record)}
                        >Delete</Button>
                    </>
                )
            }
        }
    ]
    const fetchUser = async () => {
        setLoading(true);
        setTimeout(async () => {
            let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjU3MTFkNWVjYjE3ZDUwODFkMDE2ZjhmIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MDI1Mjc4MDEsImV4cCI6MTc4ODkyNzgwMX0.ZIYcXd01wqgA4ojZEQQhuF7JsOF3x9FwRsMgUBOYvE4';
            let rs = await fetch('http://localhost:8000/api/v1/users/all', {
                method: 'GET',
                headers: { Authorization: 'Bearer ' + token }
            });
            let kq = await rs.json();
            let data = kq?.data?.result;
            setUsers(data);
            setLoading(false);
        }, 500);
    }

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setTimeout(async () => {
                let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjU3MTFkNWVjYjE3ZDUwODFkMDE2ZjhmIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MDI1Mjc4MDEsImV4cCI6MTc4ODkyNzgwMX0.ZIYcXd01wqgA4ojZEQQhuF7JsOF3x9FwRsMgUBOYvE4';
                let rs = await fetch('http://localhost:8000/api/v1/users/all', {
                    method: 'GET',
                    headers: { Authorization: 'Bearer ' + token }
                });
                let kq = await rs.json();
                let data = kq?.data?.result;
                setUsers(data);
                setLoading(false);
            }, 1000);
        }
        fetchUser();
    }, [])

    return (
        <>
            <div style={{ marginBottom: 16 }}>
            </div>
            {contextHolder}
            <div className="d-flex justify-content-between align-items-center px-3">
                <h3 className="text-center mt-5 mb-3">Quản lý người dùng</h3>
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={showModal}
                >Add new user</Button>
            </div>
            <Modal title={status === 'new' ? 'Create a user' : 'Edit a user'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div className='d-flex justify-around flex-column'>
                    <div className='mb-2'>
                        <label>Name</label>
                        <Input
                            placeholder="Domain Kashimiamilaza@gmail.com"
                            value={newUser.name}
                            onChange={(e) => handleOnChange(e.target.value, 'name')}
                            onKeyPress={(e) => handleOnFocus(e, 'name')}
                            id='name'
                        />
                    </div>
                    <div className='mb-2'>
                        <label>Email</label>
                        <Input placeholder="hongsonit10@gmail.com"
                            value={newUser.email}
                            onChange={(e) => handleOnChange(e.target.value, 'email')}
                            onKeyPress={(e) => handleOnFocus(e, 'email')}
                            id='email'
                        />
                    </div>
                    <div className='mb-2'>
                        <label>Password</label>
                        <Input.Password
                            placeholder="Password"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            value={newUser.password}
                            onChange={(e) => handleOnChange(e.target.value, 'password')}
                            onKeyPress={(e) => handleOnFocus(e, 'password')}
                            id='password'
                        />
                    </div>
                    <div className='mb-2'>
                        <label>Gender</label>
                        <Input placeholder="Male"
                            value={newUser.gender}
                            onChange={(e) => handleOnChange(e.target.value, 'gender')}
                            onKeyPress={(e) => handleOnFocus(e, 'gender')}
                            id='gender'
                        />
                    </div>
                    <div className='mb-2'>
                        <label>Age</label>
                        <Input placeholder="20"
                            value={newUser.age}
                            onChange={(e) => handleOnChange(e.target.value, 'age')}
                            onKeyPress={(e) => handleOnFocus(e, 'age')}
                            id='age'
                        />
                    </div>
                    <div className='mb-2'>
                        <label>Address</label>
                        <Input placeholder="London Endland"
                            value={newUser.address}
                            onChange={(e) => handleOnChange(e.target.value, 'address')}
                            onKeyPress={(e) => handleOnFocus(e, 'address')}
                            id='address'
                        />
                    </div>
                    <div className='mb-2'>
                        <label>Role</label>
                        <Input placeholder="Customer"
                            value={newUser.role}
                            onChange={(e) => handleOnChange(e.target.value, 'role')}
                            onKeyPress={(e) => handleOnFocus(e, 'role')}
                            id='role'
                        />
                    </div>

                </div>
            </Modal>
            <Table
                size='small'
                rowSelection={rowSelection}
                loading={loading}
                columns={columns}
                dataSource={users}
                rowKey={record => record._id}
            ></Table>
        </>

    )
}


export default TableUser;