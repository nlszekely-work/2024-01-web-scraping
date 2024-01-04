'use client'
import React, { FormEvent, useState } from 'react'

const isValidEmagUrl = (url: string) => {
    try {
        const parsedUrl = new URL(url);
        const hostName = parsedUrl.hostname;
        if (hostName.includes("emag.ro") || hostName.includes("emag.") || hostName.endsWith("emag")) {
            return true
        }
    } catch (error) {
        return false
    }
    return false

}

const SearchBar = () => {
    const [searchPrompt, setSearchPrompt] = useState("");
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isValidLink = isValidEmagUrl(searchPrompt);
        alert(isValidLink)
    }
    return (
        <form onSubmit={handleSubmit}>
            <input onChange={(e)=> setSearchPrompt(e?.target?.value)} value={searchPrompt} type='text' />
            <button type='submit' >Submit</button>
        </form>
    )
}

export default SearchBar