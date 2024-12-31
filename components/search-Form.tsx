import React from 'react'
import Form from 'next/form'
import SearchFormReset from "@/components/SearchFormReset"
import { Button } from '@/components/ui/button'

const SearchForm = ({query}:{
  query?:string
}) => {
  // query = "test";
  return (
    <Form action='/' scroll={false} className='search-form'>
        <input 
          name='query'
          defaultValue={query}
          className='search-input' 
          placeholder='search startups'
        />

        <div className='search-buttons-container'>
          {query && <SearchFormReset/>}
          <Button type='submit' className='search-btn'>
            S
          </Button>
        </div>
    </Form>
  )
}

export default SearchForm