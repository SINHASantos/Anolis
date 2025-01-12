import * as React from "react"
import { Link } from "react-router-dom"
import "./style.scss"

export const Header: React.FC = () => {
    return (
        <nav>
            <Link to="/">Anolis</Link>

            <Link to="/user/login">Login</Link>
        </nav>
    )
}