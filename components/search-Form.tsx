import React from 'react'
import Form from 'next/form'

const SearchForm = () => {
  return (
    <Form className='search-form'>
        <input className='seach-input' type="text" />
        <button className='search-btn' type='submit'></button>
    </Form>
  )
}

export default SearchForm