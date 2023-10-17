import { For, createSignal, onMount } from 'solid-js'
import { Data } from './models/Sorting';
import './styles.css'
import { Tone } from './models/Tones';

function App() {
  const [UIData, setUIData] = createSignal<number[]>([]);

  const data = new Data(setUIData, UIData);


  // const [tones, setTones] = createSignal<Tone[]>([]);

  onMount(() => {
    console.log("UIData", UIData()[1]);
    data.addContainer();
    data.addItems();
 


  })

  return (
    <>
    <div class='container'>
    </div>
    <button onClick={async() => {
      await data.setUpTones();
        console.log("finished")
    }}>Set up tones
    </button>

    <button onClick={async() => {
      await data.bublesort();

    }}>Change</button>
    </>
    
  )
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default App
