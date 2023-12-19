import { useState } from 'react';
import './Home.scss';
import Input from './input';
import TableInput from './tableInput';
import { toast } from 'react-toastify';
import { CheckValidate } from "../ultil/checkValidate";

const MyComponent = () => {
  return (
    <span>Xin chào, tôi là component</span>
  )
}

interface myName {
  _id: string;
  name: string;
}
const Home = () => {
  const [list, setList] = useState<myName[]>([]);

  const handleAddName = (name: myName): void => {
    let temp: myName[] = [...list];
    temp.push(name);
    setList(temp);
  }
  const handleDeleteName = (a: myName) => {
    let temp: myName[] = list.filter(item => item._id !== a._id)
    setList(temp);
  }
  const handleEdit = (a: myName): boolean => {
    let temps = [...list];
    let isNext = CheckValidate(a.name);
    if (!isNext) {
      toast.error('Vui lòng nhập đúng định dạng !!!');
      return false;
    }
    let arr = temps.map(item => {
      if (item._id === a._id) {
        let b = { ...item };
        b.name = a.name;
        return b;
      } else
        return item;
    })
    setList(arr);
    return true;
  }
  return (
    <div className='main-container pt-5'>
      <h1 className='mb-5'>Chào mừng bạn đến với NextJS</h1>
      <div className='w-50'>
        <Input
          handleAddName={handleAddName}
        >
          <MyComponent />
        </Input>
        <hr />
        <TableInput
          list={list}
          handleDeleteName={handleDeleteName}
          handleEdit={handleEdit}
        />

      </div>
    </div>
  )
}

export default Home
