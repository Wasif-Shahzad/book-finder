import React, {useState} from 'react';
import axios from 'axios';
import { TrophySpin } from "react-loading-indicators";
import './App.scss';

type Book = {
  "kind": "books#volume",
  "id": string,
  "etag": string,
  "selfLink": string,
  "volumeInfo": {
    "title": string,
    "subtitle": string,
    "authors": [
      string
    ],
    "publisher": string,
    "publishedDate": string,
    "description": string,
    "industryIdentifiers": [
      {
        "type": string,
        "identifier": string
      }
    ],
    "pageCount": number,
    "dimensions": {
      "height": string,
      "width": string,
      "thickness": string
    },
    "printType": string,
    "mainCategory": string,
    "categories": [
      string
    ],
    "averageRating": number,
    "ratingsCount": number,
    "contentVersion": string,
    "imageLinks": {
      "smallThumbnail": string,
      "thumbnail": string,
      "small": string,
      "medium": string,
      "large": string,
      "extraLarge": string
    },
    "language": string,
    "previewLink": string,
    "infoLink": string,
    "canonicalVolumeLink": string
  },
  "userInfo": {
    "review": unknown,
    "readingPosition": unknown,
    "isPurchased": boolean,
    "isPreordered": boolean,
    "updated": string
  },
  "saleInfo": {
    "country": string,
    "saleability": string,
    "onSaleDate": string,
    "isEbook": boolean,
    "listPrice": {
      "amount": number,
      "currencyCode": string
    },
    "retailPrice": {
      "amount": number,
      "currencyCode": string
    },
    "buyLink": string
  },
  "accessInfo": {
    "country": string,
    "viewability": string,
    "embeddable": boolean,
    "publicDomain": boolean,
    "textToSpeechPermission": string,
    "epub": {
      "isAvailable": boolean,
      "downloadLink": string,
      "acsTokenLink": string
    },
    "pdf": {
      "isAvailable": boolean,
      "downloadLink": string,
      "acsTokenLink": string
    },
    "webReaderLink": string,
    "accessViewStatus": string,
    "downloadAccess": {
      "kind": "books#downloadAccessRestriction",
      "volumeId": string,
      "restricted": boolean,
      "deviceAllowed": boolean,
      "justAcquired": boolean,
      "maxDownloadDevices": number,
      "downloadsAcquired": number,
      "nonce": string,
      "source": string,
      "reasonCode": string,
      "message": string,
      "signature": string
    }
  },
  "searchInfo": {
    "textSnippet": string
  }
};

interface SearchBoxProps {
  setBook: React.Dispatch<React.SetStateAction<string>>;
  queryBooks: (book: string) => Promise<void>;
}

interface SearchResultProps {
  queryResult: Book[] | null;
}

interface BooksResponse {
  items: Book[];
}

interface BookCardProps {
  book: Book;
}

function SearchBox({ setBook, queryBooks }: SearchBoxProps) {
  const updateBook = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value: string = e.target.text.value;
    setBook(value);
    await queryBooks(value);
  };

  return (
      <div className="search-box-container">
        <form onSubmit={updateBook} className="search-box-form">
          <input name="text" className="search-box" placeholder="Search book by name..." />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
  )
}

function BookCard({ book }: BookCardProps) {
  const imageSrc = book.volumeInfo?.imageLinks?.thumbnail ?? "https://www.pngkey.com/png/detail/207-2079264_download-placeholder-icon-svg.png";
  return (
    <div className="book-card" key={book.id}>
      <img className="book-card-thumbnail" src={imageSrc} alt="Thumbnail"/>
      <h3>{book.volumeInfo.title}</h3>
      <button onClick={() => window.open(book.volumeInfo.infoLink, '_blank')} type="button">View More...</button>
    </div>
  )
}

function SearchResult({ queryResult }: SearchResultProps) {
  return (
    <div className="search-result-inner-container">
      {
        queryResult?.map((i) => (
          <BookCard book={i} />
        ))
      }
    </div>
  );
}

export default function App() {
  const [book, setBook] = useState('');
  const [response, setResponse] = useState<Book[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const apiKey: string = import.meta.env.VITE_BOOKS_API_KEY;

  const queryBooks = async (book: string) => {
    setLoading(true);
    const trimmed: string = book.trim();
    const query_string: string = trimmed.replaceAll(' ', '+');
    const url: string = 'https://www.googleapis.com/books/v1/volumes?q=' + query_string + '&key=' + apiKey;
    const res = await axios.get<BooksResponse>(url);
    setLoading(false);
    console.log(res.data.items);
    setResponse(res.data.items);
  };

  return (
    <>
      <h1>Book Finder</h1>
      <SearchBox setBook={setBook} queryBooks={queryBooks} />
      <div className="search-result-outer-container">
        {!response ? null : (
          loading ? <TrophySpin color="#000000" size="small" text="" textColor="" /> :
            <SearchResult queryResult={response} />
        )}
      </div>
    </>
  )
}
