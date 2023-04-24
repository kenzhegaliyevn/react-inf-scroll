import { useState, useRef, useCallback } from 'react';
import useBookSearch from './useBookSearch';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      console.log(observer);
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <>
      <input type='text' value={query} onChange={handleSearch} />
      {books.map((book, idx) => {
        const props = {
          key: book,
        };

        if (books.length === idx + 1) {
          props.ref = lastBookElementRef;
        }
        // if (books.length === idx + 1) {
        //   return (
        //     <div ref={lastBookElementRef} key={book}>
        //       {book}
        //     </div>
        //   );
        // }
        return <div {...props}>{book}</div>;
      })}
      <h1>{loading && 'loading...'}</h1>
      <div style={{ color: 'red' }}>{error && 'error'}</div>
    </>
  );
}

export default App;
