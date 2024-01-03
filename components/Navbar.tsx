import React from 'react';
import { AiOutlineHeart } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";

const icons = [AiOutlineHeart, AiOutlineSearch, AiOutlineUser]

export default function Navbar() {
    return (
        <header >
            <nav className='flex p-4 justify-between'>
                <p className='text-xl  text-[#0082e6]'>
                    Price <span className='text-xl font-bold text-[#ff1d25] ' >insider</span>
                </p>
                <div className='flex gap-2'>
                    <AiOutlineSearch color="#0082e6" size={30} />
                    <AiOutlineHeart color="#ff1d25" size={30} />
                    <AiOutlineUser color="#0082e6" size={30} />
                </div>
            </nav>
        </header>
    )
}
