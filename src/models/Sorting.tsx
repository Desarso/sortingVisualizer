import { Accessor, Setter } from "solid-js";
import { Tone } from "./Tones";



export class Data {
    data: number[];
    sorted: boolean = false;
    setData: Setter<number[]>;
    getData: Accessor<number[]>;
    container: HTMLElement | null = document.querySelector('.container');
    items: NodeListOf<Element> | null = document.querySelectorAll('.item');
    setUp: boolean = false;
    delay: number = 10;
    tone: Tone| null = null;

    constructor(setData: Setter<number[]>, getData: Accessor<number[]>) {
        this.data = this.createDataProxy(Data.generateRandomData(100));
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
                    if (this.items?.length > 0 && this.setUp) {
                        this.items![key]?.classList.add('highlight');
                        this.tone.oscillator.frequency.value = value*5 + 100;
                        await this.tone?.play(this.delay/2);

                    }
                    await this.sleep(this.delay);
                  
                    if (this.items?.length > 0 && this.setUp) {
                        this.items![key]?.classList.remove('highlight');
                    }
                })()
                //I want to highlight this particular bar, and generate a tone based on the value;
                return value;

            },
            set: (target, key: any, newValue) => {
                target[key] = newValue;
                this.items![key].style.height = `${this.data[key] * 4}px`;
                this.setData(target);
                return true;
            }
        });
    }

    static generateRandomData(size: number) {
        let data = [];
        for (let i = 0; i < size; i++) {
            data.push(i);
        }
        //shuffle the array
        for (let i = data.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [data[i], data[j]] = [data[j], data[i]];
        }
        return data;
    }


    addContainer() {
        this.container = document.querySelector('.container');
    }

    addItems() {
        for (let i = 0; i < this.data.length; i++) {
            let item = document.createElement('div');
            item.classList.add('item');
            item.style.height = `${this.data[i] * 4}px`;
            this.container?.appendChild(item);
        }

        this.items = document.querySelectorAll('.item');
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].addEventListener('click', () => {
                console.log(this.data[i]);
            })
        }

        this.setUp = true;

    }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setUpTones() {
        this.tone = new Tone(500);
    }


    async bublesort() {
        let n = this.data.length;
        let swapped = true;
        while (swapped) {
            swapped = false;
            for (let i = 1; i < n; i++) {
                if (this.data[i - 1] > this.data[i]) {
                    let temp = await this.data[i];
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
    }



}

//we want the sorting algo to directly control and affect the UI
//this means that we must work with accessors and mutators
//directly in the class