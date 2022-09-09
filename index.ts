import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

interface Hotel {
    id: number;
    name: string;
    rooms: number[];
    free: boolean;
}

class ReaderHotel {
    format: "json" | "csv";
    filePath: string;
    constructor(format: "json" | "csv", filePath: string) {
        this.format = format;
        this.filePath = filePath;
    }

    read() {
        let hotel: csvHotel | jsonHotel;
        
        if (this.format === "csv") {
            hotel = new csvHotel(this.filePath);
        } else {
            hotel = new jsonHotel(this.filePath);
        }

        hotel.display();
    }
}

abstract class Reader {
    filePath: string;
    data: string = '';

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    read() {
        (() => {
            const dataPath = path.resolve(__dirname, this.filePath);
            this.data = fs.readFileSync(dataPath, { encoding: 'utf-8' });
         })();

        return this.data;
    }
}

class csvHotel extends Reader {
      display() {
        const data = super.read();
        const headers = ['id', 'name', 'rooms', 'free'];

        parse(data, {
                delimiter: ';',
                columns: headers,
                cast: (columnValue, context) => {
                    if (context.column === 'id') {
                        return parseInt(columnValue, 10);
                    }
                    else if (context.column === "free") {
                        return Boolean(columnValue);
                    }
                    else if (context.column === "rooms") {
                        let beds: string[] = columnValue.split(',')
                        let rooms = beds.map(room => {
                            return Number(room);
                          });
                          
                        return rooms;
                    }
                    return columnValue;
                  }
                }, (error, result: Hotel[]) => {
                if (error) {
                    console.error(error);
                }
                new ViewHotel(result[0]);
                });
    }
}

class jsonHotel extends Reader {

    display() {
        const result: Hotel = JSON.parse(super.read());
        new ViewHotel(result);
    }
}

class ViewHotel {
    constructor(data: Hotel) {
        console.log(`Welcome to ${data.name} hotel, we have ${data.rooms.length} rooms.`);
        if (data.free) {
            console.log(`There are available rooms!\n`)
        } else {
            console.log(`Unfortunately, none are available.\n`)
        };
    }
}

const hotelA = new ReaderHotel("csv", "data/hotel.csv")
const hotelB = new ReaderHotel('json', 'data/hotel.json')
hotelA.read();
hotelB.read();
