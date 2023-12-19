import React, { useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { CheckValidate } from "../ultil/checkValidate";


interface IProps {
    handleAddName: (name: {
        _id: string;
        name: string
    }) => void,
    children: React.ReactNode,
}

const Input = (props: IProps) => {

    const [name, setName] = useState('');
    const { handleAddName } = props;
    const handleOnClick = () => {
        let randomInput: string = uuidv4();
        let next = CheckValidate(name);
        if (!next) {
            toast.error('Vui lòng nhập đúng định dạng !!!');
            return;
        }

        handleAddName({
            _id: randomInput,
            name: name,
        });
        toast.success('Thêm mới thành công');
        setName('');
    }

    return (
        <React.Fragment>
            <label className='fw-bold mb-2'>Thêm mới người dùng</label>
            <div className='d-flex'>
                <input value={name} className='form-control'
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter")
                            handleOnClick();
                    }}
                />
                <button className='btn btn-primary mx-2'
                    onClick={() => handleOnClick()}
                >Save</button>
            </div>
        </React.Fragment>
    )
}

export default Input;