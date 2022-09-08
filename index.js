"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const csv_parse_1 = require("csv-parse");
class Reader {
    constructor(filePath) {
        this.data = '';
        this.filePath = filePath;
    }
    read() {
        (() => {
            const dataPath = path.resolve(__dirname, this.filePath);
            this.data = fs.readFileSync(dataPath, { encoding: 'utf-8' });
        })();
        return this.data;
    }
    load(data) {
        console.log(`Welcome to ${data.name} hotel, we have ${data.rooms.length} rooms.`);
        if (data.free) {
            console.log(`There are available rooms!\n`);
        }
        else {
            console.log(`Unfortunately, none are available.\n`);
        }
    }
}
class ReaderHotel {
    constructor(format, filePath) {
        this.format = format;
        this.filePath = filePath;
    }
    read() {
        let hotel;
        if (this.format === "csv") {
            hotel = new csvHotel(this.filePath);
        }
        else {
            hotel = new jsonHotel(this.filePath);
        }
        hotel.display();
    }
}
class csvHotel extends Reader {
    constructor(filePath) {
        super(filePath);
    }
    display() {
        const data = super.read();
        const headers = ['id', 'name', 'rooms', 'free'];
        (0, csv_parse_1.parse)(data, {
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
                    let beds = columnValue.split(',');
                    let rooms = beds.map(room => {
                        return Number(room);
                    });
                    return rooms;
                }
                return columnValue;
            }
        }, (error, result) => {
            if (error) {
                console.error(error);
            }
            super.load(result[0]);
        });
    }
}
class jsonHotel extends Reader {
    constructor(filePath) {
        super(filePath);
    }
    display() {
        const result = JSON.parse(super.read());
        super.load(result);
    }
}
const hotelA = new ReaderHotel("csv", "data/hotel.csv");
const hotelB = new ReaderHotel('json', 'data/hotel.json');
hotelA.read();
hotelB.read();
