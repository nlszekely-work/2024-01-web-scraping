'use client'
import React, { FormEvent, useState } from 'react'

const isValidEmagUrl = (url: string) =>{
    try{
        const parsedUrl = new URL(url);
        const hostName = parsedUrl.hostname;
        if(hostName.includes("emag.ro"))
    }catch(error){

    }
}

const SearchBar = () => {
    const [searchPrompt, setSearchPrompt] = useState("");
    const handleSubmit = (event: FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
    }
  return (
    <form onSubmit={handleSubmit}>
        <input value={searchPrompt}  type='text' />
        <button type='submit' />
    </form>
  )
}

export default SearchBar