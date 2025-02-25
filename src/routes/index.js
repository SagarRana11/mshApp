import { Routes, Route } from "react-router-native";
import { Home, Login } from "../screens";
import AlarmList from "../screens/Home/AlarmList";
import PrivateRoute from "../utils/PrivateRoute";
import LoginForm from "../screens/Auth/LoginForm";
import FakeLoginForm from "../screens/Auth/FakeLoginPage";

const AllRoutes =()=>{
    return(
        <Routes>
           <Route path="/" element={<FakeLoginForm />} />
           <Route path="/home" element={
             <PrivateRoute>
                <AlarmList />
             </PrivateRoute>
            }
           />
        </Routes>
    )
}

export default AllRoutes