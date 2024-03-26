import { createSignal, onMount } from "solid-js";
import { Data } from "./models/Sorting";
import "./styles.css";
import {Wack} from "./models/Wack";

function App() {
  const [UIData, setUIData] = createSignal<number[]>([]);

  const data = new Data(setUIData, UIData);
  const [blocked, setBlocked] = createSignal<boolean>(false);

  onMount(() => {
    console.log("UIData", UIData()[1]);
    data.addContainer();
    data.addItems();
    window.wack = Wack;
  });

  return (
    <>
      <div class="outterContainer">
        <div class="mainContainer"></div>
        <div class="container">
          <button
            class={`${blocked() ? "blocked" : ""}`}
            onClick={async () => {
              console.log(blocked());
              if (blocked()) return;
              setBlocked(true);
              await data.bublesort();
              setBlocked(false);
              // audio.play();
            }}
          >
            Bubble Sort
          </button>
          <button
            class={`${blocked() ? "blocked" : ""}`}
            onClick={async () => {
              console.log(blocked());
              if (blocked()) return;
              setBlocked(true);
              await data.insertionSort();
              setBlocked(false);
              // audio.play();
            }}
          >
            Insertion Sort
          </button>
          <button
            class={`${blocked() ? "blocked" : ""}`}
            onClick={async () => {
              console.log(blocked());
              if (blocked()) return;
              setBlocked(true);
              await data.selectionSort();
              setBlocked(false);
              // audio.play();
            }}
          >
            SelectionSort
          </button>
          <button
            class={`${blocked() ? "blocked" : ""}`}
            onClick={async () => {
              console.log(blocked());
              if (blocked()) return;
              setBlocked(true);
              await data.mergeSort();
              await data.runEntireArray();
              setBlocked(false);
              // audio.play();
            }}
          >
            Merge Sort
          </button>
        </div>
        <div class="container">
          <button
            class={`${blocked() ? "blocked" : ""}`}
            onClick={async () => {
              console.log(blocked());
              if (blocked()) return;
              setBlocked(true);
              await data.quickSort();
              await data.runEntireArray();
              setBlocked(false);
              // audio.play();
            }}
          >
            Quick Sort
          </button>
          <button
            class={`${blocked() ? "blocked" : ""}`}
            onClick={async () => {
              console.log(blocked());
              if (blocked()) return;
              setBlocked(true);
              await data.heapSort();
              await data.runEntireArray();
              setBlocked(false);
              // audio.play();
            }}
          >
            Heap Sort
          </button>
          <button
            class={`${blocked() ? "blocked" : ""}`}
            onClick={async () => {
              console.log(blocked());
              if (blocked()) return;
              setBlocked(true);
              await data.randomize();
              setBlocked(false);
              // audio.play();
            }}
          >
            Randomize
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
