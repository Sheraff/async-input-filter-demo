// eslint-disable

import styles from "./styles.module.css";
import useAsyncInputStringDistance from "./useAsyncInputStringDistance";
import pokemons from "./data/pokemons";
import verbs from "./data/verbs-fr";
import names from "./data/names-fr";
import pokemonsFr from "./data/pokemons-fr";
import { useRef, useState } from "react";

const options = [
  { value: 1, name: 'pokemons (FR)', data: pokemonsFr },
  { value: 4, name: 'pokemons (EN)', data: pokemons },
  { value: 3, name: 'verbs (FR)', data: verbs },
  { value: 2, name: 'names (FR)', data: names },
]

export default function App() {
  const [option, setOption] = useState(options[0]);
  const input = useRef(/** @type {HTMLInputElement} */ (null));
  const list = useAsyncInputStringDistance(input, option.data);
  const trunc = list.slice(0, 200);
  const onChange = (e) => {
    const value = e.target.value;
    const option = options.find(o => o.value === Number(value));
    setOption(option);
  }
  return (
    <div className={styles.main}>
      <div className={styles.head}>
        <h1>{`Live search in list of ${option.data.length} items`}</h1>
        <form className={styles.inputs}>
          <select onChange={onChange}>
            {options.map(({value, name}) => (
              <option value={value} selected={option.value === value}>{name}</option>
            ))}
          </select>
          <input type="text" ref={input} placeholder={option.data[0].name} autoFocus />
        </form>
      </div>
      <ul className={styles.list}>
        {trunc.map((item) => (
          <li key={item.name}>
            <PokemonItem {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PokemonItem({ id, name, type }) {
  if(id && type)
    return <span>{`#${id}: ${name} (${type.join()})`}</span>;
  return <span>{name}</span>;
}
