// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

import Twit = require("twit");


export interface GeoData {
    query:  Query;
    result: Result;
}

export interface Query {
    params: Params;
    type:   string;
    url:    string;
}

export interface Params {
    accuracy:     number;
    autocomplete: boolean;
    granularity:  string;
    query:        string;
    trim_place:   boolean;
}

export interface Result {
    places: Place[];
}

export interface Place {
    attributes:        Attributes;
    bounding_box:      BoundingBox;
    contained_within?: Place[];
    country:           Country;
    country_code:      CountryCode;
    full_name:         string;
    id:                string;
    name:              string;
    place_type:        PlaceType;
    url:               string;
}

export interface Attributes {
}

export interface BoundingBox {
    coordinates: Array<Array<number[]>>;
    type:        BoundingBoxType;
}


export interface GeoParams extends Twit.Params {
    query?: String;
    granularity?: "neigborhood" | "city" | "country" | "admin";
  }
  
export enum PlaceType {
    Admin = "admin",
    City = "city",
    Country = "country",
    Poi = "poi",
}

export enum BoundingBoxType {
    Polygon = "Polygon",
}

export enum Country {
    Empty = "",
    Indonesia = "Indonesia",
    Malaysia = "Malaysia",
    Singapore = "Singapore",
    新加坡 = "新加坡",
}

export enum CountryCode {
    Empty = "",
    ID = "ID",
    My = "MY",
    Sg = "SG",
}