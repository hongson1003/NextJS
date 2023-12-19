import React, { useState } from "react"
import './tableIput.scss';

const TableInput = (props: {
    list: {
        _id: string;
        name: string;
    }[],
    handleDeleteName: (item: { _id: string, name: string }) => void,
    handleEdit: (item: { _id: string, name: string }) => boolean
}) => {
    const { list, handleDeleteName, handleEdit } = props;
    const [isEdit, setIsEdit] = useState(false);
    const [itemName, setItemName] = useState<{ _id: string, name: string }>({ _id: '-1', name: '' });


    return (
        <React.Fragment>
            {
                list?.length > 0 &&
                <table className="inputTable">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.map((item, index) => {
                                return (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        {
                                            item._id === itemName._id && isEdit === true ?
                                                <td><input className="form-control mt-2" value={itemName.name}
                                                    onChange={(e) => {
                                                        let temp = { ...itemName };
                                                        temp.name = e.target.value;
                                                        setItemName(temp);
                                                    }}
                                                /></td> :
                                                <td>{item.name}</td>
                                        }
                                        <td>
                                            {
                                                isEdit === false ?
                                                    <button className="btn btn-warning mx-2"
                                                        onClick={() => {
                                                            setIsEdit(true)
                                                            setItemName(item);
                                                        }}
                                                    >Sửa</button> : (
                                                        item._id === itemName._id && isEdit === true ?
                                                            <button className="btn btn-warning mx-2"
                                                                onClick={() => {
                                                                    let result = handleEdit(itemName)
                                                                    if (result)
                                                                        setIsEdit(false);
                                                                }}
                                                            >Lưu</button> :
                                                            <button className="btn btn-warning mx-2"
                                                                onClick={() => {
                                                                    setIsEdit(true)
                                                                    setItemName(itemName);
                                                                }}
                                                            >Sửa</button>
                                                    )

                                            }
                                            <button className="btn btn-danger"
                                                onClick={() => handleDeleteName(item)}
                                            >Xóa</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            }
        </React.Fragment>
    )
}

export default TableInput;