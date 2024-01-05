'use client'
import axios from 'axios';
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
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isValidLink = isValidEmagUrl(searchPrompt);
        if (!isValidLink) return alert("Please provide a valid link")

        try {
            setIsLoading(true);
            const response = await axios.post("/api/scraper", { searchPrompt })
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input onChange={(e) => setSearchPrompt(e?.target?.value)} value={searchPrompt} type='text' />
            <button type='submit' >Submit</button>
        </form>
    )
}

export default SearchBar