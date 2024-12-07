import React from 'react'
import Form from 'next/form'
import SearchFormReset from "@/components/SearchFormReset"

const SearchForm = ({query}:{
  query?:string
}) => {
  // query = "test";
  return (
    <Form action='/' scroll={false} className='search-form'>
        <input 
        name='query'
        defaultValue={query}
        className='seach-input' 
        placeholder='search startups'
        />

        <div className='flex gap-2'>
          {query && <SearchFormReset/>}

          <button type='submit' className='search-btn text-white'>
            S
          </button>
        </div>

    </Form>
  )
}

export default SearchForm