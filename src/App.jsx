import { useEffect } from "react";
import { useState, useRef } from "react"
import { useSearchParams } from 'react-router'

const CardCharacter = (props) => {
  return (
    <div key={props.id} className="rounded-xl border border-black/60 bg-white/70 flex flex-col items-center overflow-hidden">
      <div>
        <img className="w-full h-full object-cover" src={props.image} alt={props.name} />
      </div>
      <div className="p-2">
        <span>{props.name}</span>
        <span>{props.status}</span>
        <span>{props.spesies}</span>
      </div>
    </div>
  )
}

const SearchBar = (props) => {
  return (
    <div className="w-full flex justify-center items-center h-16 border border-black bg-pink-500 ">
      <form onSubmit={props.action} className="h-full w-[1280px] p-2 flex gap-4 flex justify-center items-center">
        <div className="text-lg font-bold">Rick and Morty</div>
        <input ref={props.refs} className="min-w-[80%] focus:outline-hidden border border-white/40 px-4 rounded-lg bg-pink-500 focus: h-full text-white" name="search-input" type="text" placeholder="Type a character name..." />
        <button className="min-w-[5%] h-full border border-white/30 shadow-sm rounded-lg bg-pink-700/50" type="submit">Search</button>
      </form>
    </div>
  )
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [character, setCharacter] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRefQ = useRef();
  
  const searchQuery = searchParams.get("q") || "";
  const handleForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get("search-input");
    // setSearch(value || "");
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({}); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`https://rickandmortyapi.com/api/character`);
      const data = await res.json();
      setCharacter(data.results);
      setLoading(false);
    }
    fetchData();
    searchRefQ.current.value = searchQuery;
  }, [setCharacter, searchQuery]);

  const filtered = () => character.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  
  return (
    <div className="flex items-center justify-center flex-col gap-2">
      <SearchBar
        action={handleForm}
        refs= {searchRefQ}
      />
      {loading ? <div className="h-screen flex items-center justifycenter">
        <span className="text-4xl">Loading...</span>
      </div> :
        <div>
        <div className="pb-2">Character: { filtered().length }</div>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
            {filtered().map((re) => (
              <CardCharacter
                key={re.id}
                id={re.id}
                name={re.name}
                image={re.image}
              />
            ))}
        </div>
      </div>
      }
    </div>
  );
}
