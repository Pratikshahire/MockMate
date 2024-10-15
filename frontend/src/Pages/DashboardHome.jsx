import { Header } from "../Components/Header";
import Dashboard  from "../Components/Dashboard";
import {ResumeUpload}  from "../Components/ResumeUpload";
import { useNavigate } from "react-router-dom";

export function DashboardHome(){
    const navigate = useNavigate();
    return <div>
        <Header />
        <Dashboard />
        <ResumeUpload />
        <button className="m-2" onClick={() => {
            navigate("/interview");
        }} > Take Interview </button>
    </div>
}