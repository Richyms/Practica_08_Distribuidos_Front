import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css"

import Footer from "./components/Footer";

import Index from "./pages/Index";
import Content from "./pages/Content";
import Contract from "./pages/Contract";
import Film from "./pages/Film";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import KeyGenerator from "./pages/KeyGenerator";
import Payment from "./pages/Payment";

function App()  {
    return(
        <Router>
            <div className="app">
                <main>
                    <Routes>
                        <Route path="/" element={<Index />} /> 
                        <Route path="/login" element={<Login />}/>
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/content/:id" element={<Content />} />
                        <Route path="/film/:id" element={<Film />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/contract" element={<Contract />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/key-generator" element={< KeyGenerator/>}/>
                        <Route path="/payment" element={<Payment/>}/>
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
