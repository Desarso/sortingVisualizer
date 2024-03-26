import { Accessor, Setter } from "solid-js";
import { Wack } from "./Wack";

export class Data {
  data: number[];
  mapOfTones: Map<number, number> = new Map();
  tones: number[] = [];
  sorted: boolean = false;
  setData: Setter<number[]>;
  getData: Accessor<number[]>;
  container: HTMLElement | null = document.querySelector(".container");
  items: NodeListOf<Element> | null = document.querySelectorAll(".item");
  setUp: boolean = false;
  delay: number = 30;
  modifier: number = 60;
  dataSize = 30;

  constructor(setData: Setter<number[]>, getData: Accessor<number[]>) {
    let info = Data.generateRandomData(this.dataSize, this.mapOfTones);
    this.data = this.createDataProxy(info.data);
    this.mapOfTones = info.mapOfTones;
    this.tones = Data.generateTones(this.data);
    console.log("tones",this.tones);
    console.log(this.mapOfTones);
    console.log(this.data);

    this.setData = setData;
    this.getData = getData;
    this.setData(this.data);
  }

  createDataProxy(data: number[]) {
    return new Proxy(data, {
      get: (target, key: any) => {
        let value = target[key];

        (async () => {
          // let tone = new Tones(value * 2 + 100, this.delay);
          // console.log(value)
          if (this.items && this.items.length > 0 && this.setUp) {
            this.items[key]?.classList?.add("highlight");
            //round tone 
            let index = this.mapOfTones.get(value) || 0;

            Wack.playSound(this.tones[index]);


            // this.tone.play(value * 10 + 150, this.delay);
            await this.sleep(this.delay);
          }
          if (this.items && this.items.length > 0 && this.setUp) {
            this.items[key]?.classList?.remove("highlight");
          }
        })();

        //I want to highlight this particular bar, and generate a tone based on the value;
        return value;
      },
      set: (target, key: any, newValue) => {
        let height = window.innerHeight;
        target[key] = newValue;
        (this.items![key] as HTMLElement).style.height = `${
          this.data[key] * (0.015 * height)
        }px`;
        this.setData(target);
        return true;
      },
    });
  }

  static generateRandomData(size: number, mapOfTones: Map<number, number>) {
    let data = [];
    for (let i = 1; i < size + 1; i++) {
      data.push(i);
    }
    data = data.map((value) => {
      return (value / size) * 50;
    }); 
    //map the original data value to it's index before shuffling
    mapOfTones = new Map(data.map((value, index) => [value, index]));

    //shuffle the array
    for (let i = data.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
    }
    return {data, mapOfTones};
  }

  static generateTones(data: number[]) {
   let arrayOfIndexes = data.map((value, index) => {
      return index;
    });
    let maxTone = Wack.maxTone;
    let minTone = Wack.minTone; 




    let tones = arrayOfIndexes.map((value) => {
      //map from 40 to 300 no matter the size of the array
      return (value / data.length) * (maxTone-minTone) + minTone;
      
    });
    return tones;

  }

  addContainer() {
    this.container = document.querySelector(".mainContainer");
  }

  addItems() {
    //get screen height
    let height = window.innerHeight;
    console.log(height);

    //make a map of heights based on the size of the data
    let minHeight = 20;
    let maxHeight = 0.4 * height;
    let mapOfHeights = this.data.map((value, index) => {
      //make the min 20 and the max 60% of the screen height
      return (value / this.dataSize) * (maxHeight - minHeight) + minHeight;
    })
    console.log("maps",mapOfHeights);


    for (let i = 0; i < this.data.length; i++) {
      let item = document.createElement("div");
      item.classList.add("item");
      item.style.height = `${mapOfHeights[i]}px`;
      this.container?.appendChild(item);
    }

    this.items = document.querySelectorAll(".item");
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].addEventListener("click", () => {
        console.log(this.data[i]);
      });
    }

    this.setUp = true;
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async runEntireArray() {
    const size = this.data.length;
    for (let i = 0; i < size; i++) {
      this.data[i];
      // let tone = (this.data[i] * 2) + 50;
      // Wack.playSound(tone);
      await this.sleep(this.delay);
    }
  }

  async randomize() {
    let n = this.data.length;
    while (n > 1) {
      let k = Math.floor(Math.random() * n);
      n--;
      let temp = this.data[n];
      this.data[n] = this.data[k];
      this.data[k] = temp;
    }
  }

  async bublesort() {
    let n = this.data.length;
    let swapped = true;
    while (swapped) {
      swapped = false;
      for (let i = 1; i < n; i++) {
        if (this.data[i - 1] > this.data[i]) {
          let temp = this.data[i];
          //play sound
          let tone = (this.data[i] * 2) + 50;
          Wack.playSound(tone);
          await this.sleep(this.delay);
          this.data[i] = this.data[i - 1];
          await this.sleep(this.delay);
          this.data[i - 1] = temp;
          await this.sleep(this.delay);
          swapped = true;
        }
      }
      n--;
    }
    await this.runEntireArray();
  }

  async insertionSort() {
    let n = this.data.length;
    for (let i = 1; i < n; i++) {
      let current = this.data[i];
      await this.sleep(this.delay);
      let j = i - 1;
      while (j > -1 && current < this.data[j]) {
        await this.sleep(this.delay);
        this.data[j + 1] = this.data[j];
        await this.sleep(this.delay);
        j--;
      }
      this.data[j + 1] = current;
      await this.sleep(this.delay);
    }
    await this.runEntireArray();
  }

  async selectionSort() {
    let n = this.data.length;
    for (let i = 0; i < n; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) {
        await this.sleep(this.delay);
        if (this.data[j] < this.data[min]) {
          min = j;
        }
      }
      if (min != i) {
        let temp = this.data[i];
        await this.sleep(this.delay);
        this.data[i] = this.data[min];
        await this.sleep(this.delay);
        this.data[min] = temp;
        await this.sleep(this.delay);
      }
    }
    await this.runEntireArray();
  }

  async mergeSort(data = this.data, start = 0, end = data.length - 1) {
    if (start < end) {
      let middle = Math.floor((start + end) / 2);

      await this.mergeSort(data, start, middle);
      await this.mergeSort(data, middle + 1, end);

      let temp = [];

      let i = start,
        j = middle + 1,
        k = 0;

      while (i <= middle && j <= end) {
        if (data[i] < data[j]) {
          temp[k++] = data[i++];
          await this.sleep(this.delay);
        } else {
          temp[k++] = data[j++];
          await this.sleep(this.delay);
        }
      }

      while (i <= middle) {
        temp[k++] = data[i++];
        await this.sleep(this.delay);
      }

      while (j <= end) {
        temp[k++] = data[j++];
        await this.sleep(this.delay);
      }

      for (i = start; i <= end; i++) {
        data[i] = temp[i - start];
        await this.sleep(this.delay);
      }
    }
  }

  async quickSort(data = this.data, start = 0, end = data.length - 1) {
    if (start < end) {
      let pivot = await this.partition(data, start, end);
      await this.quickSort(data, start, pivot - 1);
      await this.quickSort(data, pivot + 1, end);
    }
  }

  async partition(data = this.data, start = 0, end = data.length - 1) {
    let pivot = data[end];
    await this.sleep(this.delay);
    let i = start - 1;
    for (let j = start; j < end; j++) {
      if (data[j] < pivot) {
        i++;
        let temp = data[i];
        data[i] = data[j];
        await this.sleep(this.delay);
        data[j] = temp;
        await this.sleep(this.delay);
      }
    }
    let temp = data[i + 1];
    data[i + 1] = data[end];
    await this.sleep(this.delay);
    data[end] = temp;
    await this.sleep(this.delay);
    return i + 1;
  }

  async heapSort() {
    let n = this.data.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await this.heapify(n, i);
    }
    for (let i = n - 1; i > 0; i--) {
      let temp = this.data[0];
      this.data[0] = this.data[i];
      await this.sleep(this.delay);
      this.data[i] = temp;
      await this.sleep(this.delay);
      await this.heapify(i, 0);
    }
  }

  async heapify(n: number, i: number) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n && this.data[l] > this.data[largest]) {
      largest = l;
    }

    if (r < n && this.data[r] > this.data[largest]) {
      largest = r;
    }

    if (largest != i) {
      let temp = this.data[i];
      this.data[i] = this.data[largest];
      await this.sleep(this.delay);
      this.data[largest] = temp;
      await this.sleep(this.delay);
      await this.heapify(n, largest);
    }
  }
}

//we want the sorting algo to directly control and affect the UI
//this means that we must work with accessors and mutators
//directly in the class
