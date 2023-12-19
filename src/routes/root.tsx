import { Outlet } from "react-router-dom";
import Header from "../tutorial/Header";

export default function Root() {
    return (
        <>
            <div id="detail">
                <Header />
                <Outlet />
            </div>
        </>
    );
}