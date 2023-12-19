import TableUser from "./user.table";


export type FieldType = {
    name: string;
    email: string;
    password: string;
    gender: string;
    age: number,
    address: string;
    role: string;
    _id?: string,
};

const ManageUser = () => {

    return (
        <div className="px-3">
            <TableUser />
        </div >
    )
}

export default ManageUser;
